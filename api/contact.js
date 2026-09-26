import { randomUUID } from "node:crypto";
import { verifyTurnstile } from "../server/turnstile.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 24 * 1024;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 6;
const REQUEST_TIMEOUT_MS = 15000;
const MAX_LENGTHS = {
  firstName: 120,
  lastName: 120,
  email: 254,
  phone: 40,
  address: 240,
  projectDetails: 2400,
  pageUrl: 500,
};
const requestBuckets = new Map();

const cleanString = (value) => (typeof value === "string" ? value.trim() : "");

function getClientIp(request) {
  return cleanString(request.headers["x-forwarded-for"]).split(",")[0]
    || cleanString(request.socket?.remoteAddress)
    || "unknown";
}

function isRateLimited(key) {
  const now = Date.now();

  if (requestBuckets.size > 1000) {
    for (const [bucketKey, bucket] of requestBuckets) {
      if (bucket.resetAt <= now) requestBuckets.delete(bucketKey);
    }
  }

  const bucket = requestBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    requestBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX_REQUESTS;
}

function exceedsLength(value, key) {
  return cleanString(value).length > MAX_LENGTHS[key];
}

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Método no permitido." });
  }

  if (!cleanString(request.headers["content-type"]).toLowerCase().startsWith("application/json")) {
    return response.status(415).json({ error: "El contenido debe enviarse como JSON." });
  }

  const contentLength = Number(request.headers["content-length"] || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return response.status(413).json({ error: "La solicitud supera el tamaño permitido." });
  }

  const clientIp = getClientIp(request);
  if (isRateLimited(clientIp)) {
    response.setHeader("Retry-After", "3600");
    return response.status(429).json({ error: "Has realizado varios intentos. Espera antes de volver a enviar." });
  }

  const body = request.body && typeof request.body === "object" ? request.body : {};
  const elapsed = Date.now() - Number(body.startedAt);

  if (cleanString(body.website) || !Number.isFinite(elapsed) || elapsed < 1500) {
    return response.status(200).json({ ok: true, message: "Solicitud recibida." });
  }

  const turnstile = await verifyTurnstile({ token: body.turnstileToken, remoteIp: clientIp });
  if (!turnstile.success) {
    const statusCode = turnstile.code === "not-configured" ? 503 : 403;
    return response.status(statusCode).json({
      error: statusCode === 503
        ? "El formulario está temporalmente en configuración. Inténtalo más tarde."
        : "No pudimos validar la verificación de seguridad. Inténtalo de nuevo.",
    });
  }

  const firstName = cleanString(body.firstName);
  const lastName = cleanString(body.lastName);
  const email = cleanString(body.email).toLowerCase();
  const phone = cleanString(body.phone);
  const address = cleanString(body.address);
  const projectDetails = cleanString(body.projectDetails);
  const pageUrl = cleanString(body.pageUrl);

  if (!firstName || !lastName || !email || !phone || !projectDetails || body.dataConsentGranted !== true) {
    return response.status(400).json({ error: "Completa los campos obligatorios y autoriza el tratamiento de datos." });
  }
  if (!EMAIL_PATTERN.test(email)) {
    return response.status(400).json({ error: "Ingresa un correo electrónico válido." });
  }
  if (projectDetails.length < 20) {
    return response.status(400).json({ error: "Cuéntanos un poco más sobre tu proyecto." });
  }
  if (
    exceedsLength(firstName, "firstName")
    || exceedsLength(lastName, "lastName")
    || exceedsLength(email, "email")
    || exceedsLength(phone, "phone")
    || exceedsLength(address, "address")
    || exceedsLength(projectDetails, "projectDetails")
    || exceedsLength(pageUrl, "pageUrl")
  ) {
    return response.status(400).json({ error: "Uno de los campos supera la longitud permitida." });
  }

  const webhookUrl = cleanString(process.env.MAKE_CONTACT_WEBHOOK_URL);
  if (!webhookUrl) {
    console.error("Falta MAKE_CONTACT_WEBHOOK_URL en el entorno.");
    return response.status(503).json({ error: "El formulario no está disponible en este momento." });
  }

  const webhookHeaders = { "Content-Type": "application/json" };
  const webhookToken = cleanString(process.env.MAKE_CONTACT_WEBHOOK_TOKEN);
  if (webhookToken) webhookHeaders["x-make-apikey"] = webhookToken;

  const payload = {
    submissionId: randomUUID(),
    source: "ceniza-contact-form",
    submittedAt: new Date().toISOString(),
    firstName,
    lastName,
    email,
    phone,
    address,
    projectDetails,
    pageUrl,
    dataConsentGranted: true,
    dataPolicyVersion: cleanString(body.dataPolicyVersion) || "unknown",
  };

  try {
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: webhookHeaders,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!webhookResponse.ok) {
      throw new Error(`Make returned ${webhookResponse.status}`);
    }

    return response.status(200).json({ ok: true, message: "Solicitud enviada correctamente." });
  } catch (error) {
    console.error("Error enviando la solicitud al servicio configurado:", error.message);
    return response.status(502).json({ error: "No pudimos enviar tu solicitud. Inténtalo de nuevo." });
  }
}
