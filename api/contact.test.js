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
    dataPolicyVersion: "2026-09",
    startedAt: Date.now() - 5000,
    turnstileToken: "test-token",
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
  const calls = [];

  process.env.MAKE_CONTACT_WEBHOOK_URL = "https://hook.example.test/contact";
  process.env.MAKE_CONTACT_WEBHOOK_TOKEN = "shared-test-token";
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
    assert.equal(calls.length, 2);
    assert.equal(calls[1].url, "https://hook.example.test/contact");
    assert.equal(calls[1].options.headers["x-make-apikey"], "shared-test-token");

    const payload = JSON.parse(calls[1].options.body);
    assert.equal(payload.firstName, "Mariana");
    assert.equal(payload.lastName, "Ejemplo");
    assert.equal(payload.email, "mariana@example.com");
    assert.equal(payload.dataConsentGranted, true);
    assert.equal("unexpectedField" in payload, false);
    assert.match(payload.submissionId, /^[0-9a-f-]{36}$/i);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalWebhook === undefined) delete process.env.MAKE_CONTACT_WEBHOOK_URL;
    else process.env.MAKE_CONTACT_WEBHOOK_URL = originalWebhook;
    if (originalToken === undefined) delete process.env.MAKE_CONTACT_WEBHOOK_TOKEN;
    else process.env.MAKE_CONTACT_WEBHOOK_TOKEN = originalToken;
  }
});
