import { randomUUID } from "node:crypto";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const DEVELOPMENT_SECRET_KEY = "1x0000000000000000000000000000000AA";
const DEFAULT_ACTION = "contact_form";

const cleanString = (value) => (typeof value === "string" ? value.trim() : "");

function getSecretKey() {
  const configuredKey = cleanString(process.env.TURNSTILE_SECRET_KEY);
  const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";

  if (configuredKey) return configuredKey;
  return isProduction ? "" : DEVELOPMENT_SECRET_KEY;
}

export async function verifyTurnstile({ token, remoteIp = "" }) {
  const secret = getSecretKey();
  const responseToken = cleanString(token);

  if (!secret) return { success: false, code: "not-configured" };
  if (!responseToken || responseToken.length > 2048) return { success: false, code: "missing-token" };

  const body = new URLSearchParams({
    secret,
    response: responseToken,
    idempotency_key: randomUUID(),
  });
  const cleanIp = cleanString(remoteIp);
  if (cleanIp && cleanIp !== "unknown") body.set("remoteip", cleanIp);

  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(10000),
    });
    const result = await response.json();

    if (!response.ok || result.success !== true) {
      return { success: false, code: "verification-failed" };
    }

    const usingDevelopmentKey = secret === DEVELOPMENT_SECRET_KEY;
    const expectedAction = cleanString(process.env.TURNSTILE_EXPECTED_ACTION || DEFAULT_ACTION);
    if (!usingDevelopmentKey && expectedAction && result.action !== expectedAction) {
      return { success: false, code: "action-mismatch" };
    }

    const allowedHostnames = cleanString(process.env.TURNSTILE_ALLOWED_HOSTNAMES)
      .split(",")
      .map((hostname) => hostname.trim().toLowerCase())
      .filter(Boolean);
    if (
      !usingDevelopmentKey
      && allowedHostnames.length > 0
      && !allowedHostnames.includes(cleanString(result.hostname).toLowerCase())
    ) {
      return { success: false, code: "hostname-mismatch" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error validando Cloudflare Turnstile:", error.message);
    return { success: false, code: "service-unavailable" };
  }
}
