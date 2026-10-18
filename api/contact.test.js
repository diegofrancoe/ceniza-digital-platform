import assert from "node:assert/strict";
import test from "node:test";
import handler from "./contact.js";

function responseRecorder() {
  return {
    headers: {},
    statusCode: 200,
    body: undefined,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

function request(overrides = {}) {
  return {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.10" },
    socket: {},
    body: {},
    ...overrides,
  };
}

function validBody(overrides = {}) {
  return {
    firstName: "  Mariana ",
    lastName: " Ejemplo  ",
    email: " MARIANA@EXAMPLE.COM ",
    phone: "+57 300 000 0000",
    address: "Bogotá",
    projectDetails: "Producción audiovisual de demostración con fecha y locación por definir.",
    pageUrl: "https://ceniza.example/contacto",
    dataConsentGranted: true,
    dataPolicyVersion: "=forged-policy",
    startedAt: Date.now() - 5000,
    turnstileToken: "test-token",
    requestId: "6f96bb91-e248-4b37-8e15-2a4c73b41111",
    ...overrides,
  };
}

function successfulTurnstileResponse() {
  return {
    ok: true,
    async json() {
      return { success: true };
    },
  };
}

test("rejects methods other than POST", async () => {
  const response = responseRecorder();
  await handler(request({ method: "GET" }), response);
  assert.equal(response.statusCode, 405);
  assert.equal(response.headers.allow, "POST");
});

test("requires JSON", async () => {
  const response = responseRecorder();
  await handler(request({ headers: { "content-type": "text/plain", "x-forwarded-for": "203.0.113.11" } }), response);
  assert.equal(response.statusCode, 415);
});

test("rejects bodies declared above the size limit", async () => {
  const response = responseRecorder();
  await handler(request({ headers: { "content-type": "application/json", "content-length": "25000", "x-forwarded-for": "203.0.113.12" } }), response);
  assert.equal(response.statusCode, 413);
});

test("silently accepts honeypot submissions without calling providers", async () => {
  const response = responseRecorder();
  await handler(request({ body: { website: "https://spam.example", startedAt: Date.now() - 5000 } }), response);
  assert.equal(response.statusCode, 200);
  assert.equal(response.body.ok, true);
});

test("silently accepts submissions completed too quickly", async () => {
  const response = responseRecorder();
  await handler(request({ body: { startedAt: Date.now() } }), response);
  assert.equal(response.statusCode, 200);
  assert.equal(response.body.ok, true);
});

test("rejects incomplete data after server-side bot verification", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => successfulTurnstileResponse();

  try {
    const response = responseRecorder();
    await handler(request({
      headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.13" },
      body: validBody({ projectDetails: "" }),
    }), response);
    assert.equal(response.statusCode, 400);
    assert.match(response.body.error, /campos obligatorios/i);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("normalizes and forwards only the approved payload", async () => {
  const originalFetch = globalThis.fetch;
  const originalWebhook = process.env.MAKE_CONTACT_WEBHOOK_URL;
  const originalToken = process.env.MAKE_CONTACT_WEBHOOK_TOKEN;
  const originalCrmUrl = process.env.CRM_INTAKE_URL;
  const originalCrmToken = process.env.CRM_INTAKE_TOKEN;
  const calls = [];

  process.env.MAKE_CONTACT_WEBHOOK_URL = "https://hook.example.test/contact";
  process.env.MAKE_CONTACT_WEBHOOK_TOKEN = "shared-test-token";
  process.env.CRM_INTAKE_URL = "https://crm.example.test/website-lead";
  process.env.CRM_INTAKE_TOKEN = "a-secure-test-token-that-is-at-least-32-chars";
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    if (calls.length === 1) return successfulTurnstileResponse();
    return { ok: true, status: 200 };
  };

  try {
    const response = responseRecorder();
    await handler(request({
      headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.14" },
      body: validBody({ unexpectedField: "must-not-be-forwarded" }),
    }), response);

    assert.equal(response.statusCode, 200);
    assert.equal(calls.length, 3);
    assert.equal(calls[1].url, "https://hook.example.test/contact");
    assert.equal(calls[1].options.headers["x-make-apikey"], "shared-test-token");
    assert.equal(calls[2].url, "https://crm.example.test/website-lead");
    assert.equal(calls[2].options.headers["x-ceniza-ingest-token"], "a-secure-test-token-that-is-at-least-32-chars");
    assert.match(calls[2].options.headers["x-ceniza-client-fingerprint"], /^[a-f0-9]{64}$/);

    const payload = JSON.parse(calls[1].options.body);
    assert.equal(payload.firstName, "Mariana");
    assert.equal(payload.lastName, "Ejemplo");
    assert.equal(payload.email, "mariana@example.com");
    assert.equal(payload.dataConsentGranted, true);
    assert.equal(payload.dataPolicyVersion, "2026-09-04");
    assert.equal(payload.safe.html.dataPolicyVersion, "2026-09-04");
    assert.equal(payload.safe.sheet.dataPolicyVersion, "2026-09-04");
    assert.equal("unexpectedField" in payload, false);
    assert.equal(payload.submissionId, "6f96bb91-e248-4b37-8e15-2a4c73b41111");
    assert.equal(payload.safe.html.projectDetails, payload.projectDetails);
    assert.equal(payload.safe.sheet.email, payload.email);
    const crmPayload = JSON.parse(calls[2].options.body);
    assert.equal(crmPayload.requestId, payload.submissionId);
    assert.deepEqual(Object.keys(crmPayload).sort(), ["contact", "requestId", "source"]);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalWebhook === undefined) delete process.env.MAKE_CONTACT_WEBHOOK_URL;
    else process.env.MAKE_CONTACT_WEBHOOK_URL = originalWebhook;
    if (originalToken === undefined) delete process.env.MAKE_CONTACT_WEBHOOK_TOKEN;
    else process.env.MAKE_CONTACT_WEBHOOK_TOKEN = originalToken;
    if (originalCrmUrl === undefined) delete process.env.CRM_INTAKE_URL;
    else process.env.CRM_INTAKE_URL = originalCrmUrl;
    if (originalCrmToken === undefined) delete process.env.CRM_INTAKE_TOKEN;
    else process.env.CRM_INTAKE_TOKEN = originalCrmToken;
  }
});

test("escapes values for HTML and neutralizes spreadsheet formulas", async () => {
  const originalFetch = globalThis.fetch;
  const originalWebhook = process.env.MAKE_CONTACT_WEBHOOK_URL;
  const originalToken = process.env.MAKE_CONTACT_WEBHOOK_TOKEN;
  const originalCrmUrl = process.env.CRM_INTAKE_URL;
  const originalCrmToken = process.env.CRM_INTAKE_TOKEN;
  const calls = [];
  process.env.MAKE_CONTACT_WEBHOOK_URL = "https://hook.example.test/contact";
  process.env.MAKE_CONTACT_WEBHOOK_TOKEN = "shared-test-token";
  process.env.CRM_INTAKE_URL = "https://crm.example.test/website-lead";
  process.env.CRM_INTAKE_TOKEN = "a-secure-test-token-that-is-at-least-32-chars";
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    if (calls.length === 1) return successfulTurnstileResponse();
    return { ok: true, status: 200 };
  };
  try {
    const response = responseRecorder();
    await handler(request({
      headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.15" },
      body: validBody({ firstName: "<b>Mariana</b>", company: "=IMPORTXML(\"https://evil.test\")", projectDetails: "=HYPERLINK(\"https://evil.test\",\"ver\") descripción suficiente" }),
    }), response);
    assert.equal(response.statusCode, 200);
    const payload = JSON.parse(calls[1].options.body);
    assert.equal(payload.safe.html.firstName, "&lt;b&gt;Mariana&lt;/b&gt;");
    assert.ok(payload.safe.sheet.projectDetails.startsWith("'="));
  } finally {
    globalThis.fetch = originalFetch;
    if (originalWebhook === undefined) delete process.env.MAKE_CONTACT_WEBHOOK_URL; else process.env.MAKE_CONTACT_WEBHOOK_URL = originalWebhook;
    if (originalToken === undefined) delete process.env.MAKE_CONTACT_WEBHOOK_TOKEN; else process.env.MAKE_CONTACT_WEBHOOK_TOKEN = originalToken;
    if (originalCrmUrl === undefined) delete process.env.CRM_INTAKE_URL; else process.env.CRM_INTAKE_URL = originalCrmUrl;
    if (originalCrmToken === undefined) delete process.env.CRM_INTAKE_TOKEN; else process.env.CRM_INTAKE_TOKEN = originalCrmToken;
  }
});
