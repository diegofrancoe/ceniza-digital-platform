import { useEffect, useRef } from "react";

const SCRIPT_ID = "cloudflare-turnstile-script";
const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const DEVELOPMENT_SITE_KEY = "1x00000000000000000000AA";

let scriptPromise;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(SCRIPT_ID);
    const script = existingScript || document.createElement("script");

    const handleLoad = () => resolve(window.turnstile);
    const handleError = () => {
      scriptPromise = undefined;
      reject(new Error("No se pudo cargar la verificación de seguridad."));
    };

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existingScript) {
      script.id = SCRIPT_ID;
      script.src = SCRIPT_URL;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });

  return scriptPromise;
}

function getSiteKey() {
  const configuredKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim();
  const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  return configuredKey || (isLocalhost ? DEVELOPMENT_SITE_KEY : "");
}

export default function TurnstileWidget({ onTokenChange, onError, resetKey }) {
  const containerRef = useRef(null);
  const siteKey = getSiteKey();

  useEffect(() => {
    if (!siteKey || !containerRef.current) {
      onError("La verificación de seguridad no está configurada.");
      return undefined;
    }

    let cancelled = false;
    let widgetId;

    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !containerRef.current) return;
        widgetId = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action: "contact_form",
          appearance: "interaction-only",
          size: "flexible",
          theme: "light",
          callback: (token) => onTokenChange(token),
          "expired-callback": () => onTokenChange(""),
          "timeout-callback": () => onTokenChange(""),
          "error-callback": () => {
            onTokenChange("");
            onError("No pudimos completar la verificación de seguridad.");
            return true;
          },
        });
      })
      .catch((error) => onError(error.message));

    return () => {
      cancelled = true;
      if (widgetId !== undefined && window.turnstile) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [onError, onTokenChange, resetKey, siteKey]);

  return (
    <div className="turnstile-field contact-form-wide">
      <span>Verificación de seguridad *</span>
      <div className="turnstile-widget" ref={containerRef} />
    </div>
  );
}
