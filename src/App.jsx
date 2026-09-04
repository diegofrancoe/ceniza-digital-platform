import { useEffect, useRef, useState } from "react";
import heroSoftboxOff from "./assets/ceniza-godox-qrp70-left-off-grid.png";
import heroSoftboxOn from "./assets/ceniza-godox-qrp70-left-on-cases-grid.png";
import portfolioCardImage from "./assets/ceniza-card-portafolio-molus-x60-v3.png";
import processCardImage from "./assets/ceniza-card-proceso-v2.png";
import cenizaLogo from "./assets/ceniza-logo-cropped.png";
import aboutLight from "./assets/luz.png";
import catalogAccentLight from "./assets/lumina2.webp";
import portfolioLight from "./assets/lumina1.png";
import studioVideo from "./assets/reel-juanita-detras-de-camara.mp4";
import studioVideoPoster from "./assets/reel-juanita-poster.jpg";
import portfolioVideo from "./assets/reel-editorial-semilla.mp4";
import portfolioVideoPoster from "./assets/reel-editorial-semilla-poster.jpg";
import atmosphereVideo from "./assets/reel-atmosferas-diego.mp4";
import atmosphereVideoPoster from "./assets/reel-atmosferas-diego-poster.jpg";
import portfolioSpaceVideo from "./assets/reel-diego-detras-de-camaras.mp4";
import portfolioSpaceVideoPoster from "./assets/reel-diego-detras-de-camaras-poster.jpg";
import characterVideo from "./assets/video-ambientes-con-caracter.mp4";
import characterVideoPoster from "./assets/video-ambientes-con-caracter-poster.jpg";
import eventTwoImage from "./assets/evento 2.webp";
import eventThreeImage from "./assets/evento 3.webp";
import eventFourImage from "./assets/evento 4.webp";
import eventFiveImage from "./assets/evento 5 .webp";
import eventSixImage from "./assets/evento 6.webp";
import portfolioCasesImage from "./assets/portafolio-cases-ceniza.webp";
import serviceOneImage from "./assets/servicios 1.webp";
import catalogOneImage from "./assets/catalogo 1.webp";
import comboOneHomeImage from "./assets/combo 1.1.webp";
import comboFourHomeImage from "./assets/combo 4.4.webp";
import comboCreatorStartImage from "./assets/combo-creador-start.webp";
import comboDetailOneImage from "./assets/combo-detail-1.webp";
import comboDetailTwoImage from "./assets/combo-detail-2.webp";
import comboDetailThreeImage from "./assets/combo-detail-3.webp";
import comboDetailFourImage from "./assets/combo-detail-4.webp";
import comboDetailFiveImage from "./assets/combo-detail-5.webp";
import comboDetailSixImage from "./assets/combo-detail-6.webp";
import landingCreatorProImage from "./assets/landing-creador-pro.webp";
import landingProfessionalBrandImage from "./assets/landing-marca-profesional.webp";
import landingPhotographyProfessionalImage from "./assets/landing-fotografia-profesional.webp";

const equipmentBannerModules = import.meta.glob("./assets/*equiposceniza.webp", {
  eager: true,
  import: "default",
});

const SERVICES_PATH = "/servicios";
const CATALOG_PATH = "/catalogo";
const PRODUCTS_PATH = "/catalogo/productos";
const PORTFOLIO_PATH = "/portafolio";
const CONTACT_PATH = "/contacto";
const CART_PATH = "/carrito";
const DATA_POLICY_PATH = "/tratamiento-de-datos";
const TERMS_PATH = "/terminos-y-condiciones";
const WHATSAPP_URL = "https://wa.me/573203624348";
const CONTACT_EMAIL = "gerencia@cenizaproducciones.com";
const INSTAGRAM_URL = "https://www.instagram.com/cenizaproducciones?igsh=NDdxam85cHV6cDRm";
const CATALOG_QUOTE_WHATSAPP_URL = `${WHATSAPP_URL}?text=${encodeURIComponent(
  [
    "Hola, quiero cotizar equipos de iluminación para una producción.",
    "",
    "Tipo de producción:",
    "Fecha:",
    "Equipos o referencias:",
    "Locación:",
    "",
    "¿Me ayudan a elegir la opción adecuada?",
  ].join("\n"),
)}`;
const COMBO_QUOTE_WHATSAPP_URL = `${WHATSAPP_URL}?text=${encodeURIComponent(
  "Hola, quiero cotizar un combo de iluminación para mi producción. ¿Me ayudan a elegir la opción adecuada?",
)}`;
const PORTFOLIO_QUOTE_WHATSAPP_URL = `${WHATSAPP_URL}?text=${encodeURIComponent(
  "Hola, vi el portafolio de Ceniza y quiero contarles sobre un proyecto que necesita dirección de iluminación. ¿Podemos hablar?",
)}`;
const CART_STORAGE_KEY = "ceniza-cart-draft";
const CART_UPDATED_EVENT = "ceniza-cart-updated";
const COOKIE_CONSENT_KEY = "ceniza-cookie-consent";
const CART_WEBHOOK_URL = import.meta.env.VITE_MAKE_CART_WEBHOOK_URL ?? "";
const CONTACT_WEBHOOK_URL = import.meta.env.VITE_MAKE_CONTACT_WEBHOOK_URL ?? "";
const CART_PAYMENT_URL = import.meta.env.VITE_CENIZA_PAYMENT_URL ?? "";
const GOOGLE_ANALYTICS_ID = "G-HDX27BVTHQ";

function formatCatalogTechnicalText(value) {
  return String(value).replace(
    /(\d[\d.,]*)\s+(K|W|V|Hz|cm|mm|kg|COP)\b/g,
    "$1\u00A0$2",
  );
}

function loadAnalytics() {
  if (typeof window === "undefined" || document.getElementById("ceniza-google-analytics")) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GOOGLE_ANALYTICS_ID);

  const script = document.createElement("script");
  script.id = "ceniza-google-analytics";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
  document.head.appendChild(script);
}

function formDataToObject(formData) {
  return Object.fromEntries(formData.entries());
}

function normalizeWebhookUrl(url) {
  return String(url ?? "").trim();
}

async function postWebhookSubmission(url, payload) {
  const normalizedUrl = normalizeWebhookUrl(url);

  if (!normalizedUrl) {
    throw new Error("El formulario aún no está conectado. Inténtalo por WhatsApp.");
  }

  const response = await fetch(normalizedUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("No pudimos enviar la información al webhook.");
  }

  return response;
}

function readStoredCartDraft(fallbackItems = []) {
  if (typeof window === "undefined") return fallbackItems;

  try {
    const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!rawValue) return fallbackItems;

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue : fallbackItems;
  } catch {
    return fallbackItems;
  }
}

function parseCopAmount(value) {
  return Number(String(value ?? "").replace(/[^\d]/g, "")) || 0;
}

function addItemToStoredCart(item) {
  if (typeof window === "undefined") return;

  const currentItems = readStoredCartDraft([]);
  const existingItem = currentItems.find((entry) => entry.id === item.id);
  const nextItems = existingItem
    ? currentItems.map((entry) =>
        entry.id === item.id
          ? { ...entry, quantity: (entry.quantity ?? 1) + (item.quantity ?? 1) }
          : entry,
      )
    : [...currentItems, item];

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

function createServiceCartItem(service) {
  return {
    id: `combo-${service.slug}`,
    title: `Combo ${service.title}`,
    note: service.summary,
    unitPriceLabel: service.price.replace("Precio base: ", ""),
    unitAmount: parseCopAmount(service.price),
    quantity: 1,
    units: service.eyebrow,
    image: service.homeImage ?? service.serviceImage,
    href: `${SERVICES_PATH}/${service.slug}`,
  };
}

function createProductCartItem(product, priceOption) {
  return {
    id: `product-${product.slug}-${priceOption.label.toLowerCase().replace(/[^\w]+/g, "-")}`,
    title: product.label,
    note: product.shortDescription,
    unitPriceLabel: priceOption.value,
    unitAmount: parseCopAmount(priceOption.value),
    quantity: 1,
    units: priceOption.label,
    image: product.src,
    href: `${PRODUCTS_PATH}/${product.slug}`,
  };
}

const catalogProductDetails = {
  1: {
    slug: "luz-led-rgb-ulanzi-vl120-con-clip",
    name: "Luz LED RGB Ulanzi VL120 con Clip para Celular",
    category: "Luz de acento",
    shortDescription:
      "Luz LED RGB portátil para creadores de contenido, fotografía móvil y producciones audiovisuales ligeras.",
    description:
      "La Ulanzi VL120 RGB es una luz LED compacta y portátil, pensada para creadores de contenido y producciones audiovisuales que necesitan versatilidad en un formato ligero.",
    specs: [
      "Tipo: luz LED RGB portátil",
      "Potencia: 7 W aprox.",
      "Modos: RGB (HSI) y CCT",
      "Temperatura de color: 2.500 K - 9.000 K",
      "Control de intensidad: 0% - 100%",
    ],
    includes: ["1 luz VL120 RGB Ulanzi", "1 difusor", "1 cable USB-C", "1 soporte", "1 clip para celular"],
    pricing: [
      { label: "Unitario + reflector", value: "50.000 COP" },
      { label: "Reflector + trípode", value: "95.000 COP" },
      { label: "Reflector + trípode + softbox", value: "190.000 COP" },
    ],
  },
  2: {
    slug: "barra-led-pl183-washer-pro-dj",
    name: "Barra LED PL183 Washer Pro DJ",
    category: "Barras luminosas",
    shortDescription:
      "Barra LED RGB para eventos, escenarios y montajes que necesitan bañar superficies con color homogéneo.",
    description:
      "La Barra LED PL183 Washer Pro DJ es una solución de iluminación versátil y potente, diseñada para cubrir superficies amplias con colores intensos y homogéneos.",
    specs: [
      "Fuente de luz: 18 LEDs de alta potencia",
      "Configuración de color: RGB",
      "Potencia total: 54 W aprox.",
      "Uso recomendado: ambientación, wash de color y refuerzo escénico",
    ],
    includes: ["1 barra LED PL183 Washer Pro DJ"],
    pricing: [
      { label: "Unitario", value: "60.000 COP" },
      { label: "Combo x2", value: "114.000 COP" },
    ],
  },
  3: {
    slug: "barra-led-pl183-washer-pro-dj-02",
    name: "Barra LED PL183 Washer Pro DJ",
    category: "Barras luminosas",
    shortDescription:
      "Barra LED RGB para eventos, escenarios y montajes que necesitan bañar superficies con color homogéneo.",
    description:
      "La Barra LED PL183 Washer Pro DJ es una solución de iluminación versátil y potente, diseñada para cubrir superficies amplias con colores intensos y homogéneos.",
    specs: [
      "Fuente de luz: 18 LEDs de alta potencia",
      "Configuración de color: RGB",
      "Potencia total: 54 W aprox.",
      "Uso recomendado: ambientación, wash de color y refuerzo escénico",
    ],
    includes: ["1 barra LED PL183 Washer Pro DJ"],
    pricing: [
      { label: "Unitario", value: "60.000 COP" },
      { label: "Combo x2", value: "114.000 COP" },
    ],
  },
  4: {
    slug: "cabeza-movil-pl61-spot-pro-dj-lighting",
    name: "Cabeza móvil PL61 SPOT PRO DJ LIGHTING",
    category: "Eventos",
    shortDescription:
      "Cabeza móvil LED compacta para escenarios, eventos y pistas de baile con haces definidos y movimientos rápidos.",
    description:
      "La Cabeza Móvil LED PL61 Spot Pro DJ es una luminaria compacta y potente diseñada para crear efectos dinámicos, haces definidos y movimientos rápidos en escenarios, eventos y pistas de baile.",
    specs: [
      "Tipo: cabeza móvil LED spot",
      "Uso recomendado: escenarios, eventos y pistas de baile",
      "Haces definidos para efectos dinámicos",
      "Movimientos rápidos para ambientación y show",
    ],
    includes: ["1 cabeza móvil PL61 Spot Pro DJ Lighting"],
    pricing: [
      { label: "Unitario", value: "60.000 COP" },
      { label: "Combo x2", value: "114.000 COP" },
      { label: "Combo x4", value: "228.000 COP" },
    ],
  },
  5: {
    slug: "softbox-cuadrado-estudio",
    name: "Softbox Cuadrado de Estudio",
    category: "Paneles LED",
    shortDescription:
      "Softbox cuadrado para estudio fotográfico y producción audiovisual con luz más suave y uniforme.",
    description:
      "Softbox cuadrado de estudio diseñado para suavizar la fuente de luz y lograr una iluminación más uniforme en fotografía, video, retrato y producto.",
    specs: [
      "Tipo: softbox cuadrado de estudio",
      "Uso recomendado: retrato, producto, video y contenido",
      "Luz más difusa y controlada",
      "Ideal para sets de estudio y fondos limpios",
    ],
    includes: ["1 softbox cuadrado de estudio con bombillo"],
    pricing: [
      { label: "Bombillo + softbox", value: "30.000 COP" },
      { label: "Bombillo + softbox x2", value: "60.000 COP" },
    ],
  },
  6: {
    slug: "cabeza-movil-pl61-spot-pro-dj-lighting-02",
    name: "Cabeza móvil PL61 SPOT PRO DJ LIGHTING",
    category: "Eventos",
    shortDescription:
      "Cabeza móvil LED compacta para escenarios, eventos y pistas de baile con haces definidos y movimientos rápidos.",
    description:
      "La Cabeza Móvil LED PL61 Spot Pro DJ es una luminaria compacta y potente diseñada para crear efectos dinámicos, haces definidos y movimientos rápidos en escenarios, eventos y pistas de baile.",
    specs: [
      "Tipo: cabeza móvil LED spot",
      "Uso recomendado: escenarios, eventos y pistas de baile",
      "Haces definidos para efectos dinámicos",
      "Movimientos rápidos para ambientación y show",
    ],
    includes: ["1 cabeza móvil PL61 Spot Pro DJ Lighting"],
    pricing: [
      { label: "Unitario", value: "60.000 COP" },
      { label: "Combo x2", value: "114.000 COP" },
      { label: "Combo x4", value: "228.000 COP" },
    ],
  },
  7: {
    slug: "blinder-pl2200-pro-dj",
    name: "Blinder PL2200 Pro DJ",
    category: "Eventos",
    shortDescription:
      "Blinder LED de alto impacto para conciertos, shows en vivo y eventos que necesitan golpes de luz intensos.",
    description:
      "El Blinder PL2200 Pro DJ es una luminaria de alto impacto diseñada para generar golpes de luz intensos y efectos de audiencia característicos de conciertos, shows en vivo y eventos de gran energía.",
    specs: [
      "Tipo: LED Blinder Light",
      "Potencia: 200 W (2 ojos)",
      "Voltaje: 110-240 V / 50-60 Hz",
      "Temperatura de color: 3.200 K - 5.600 K",
    ],
    includes: ["1 blinder PL2200 Pro DJ"],
    pricing: [
      { label: "Unitario", value: "70.000 COP" },
      { label: "Combo x2", value: "133.000 COP" },
    ],
  },
  8: {
    slug: "ulanzi-ua12-air-tube",
    name: "Ulanzi UA12 Air Tube",
    category: "Tubos",
    shortDescription:
      "Luz LED inflable tubular para producciones audiovisuales que necesitan una iluminación suave, uniforme y portátil.",
    description:
      "La Ulanzi UA12 Air Tube es una luz LED inflable de formato tubular diseñada para producciones audiovisuales modernas que requieren una iluminación suave, uniforme y portátil.",
    specs: [
      "Luz LED tipo tubo de aire plegable",
      "Fácil de transportar y usar",
      "Ideal para espacios limitados o uso al aire libre",
      "Brillo y temperatura de color ajustables",
      "12 efectos de iluminación",
    ],
    includes: ["1 Ulanzi UA12 Air Tube"],
    pricing: [
      { label: "Unitario", value: "50.000 COP" },
      { label: "Combo x2", value: "95.000 COP" },
    ],
  },
  10: {
    slug: "luz-cuadrada-gvm-800d",
    name: "Luz Cuadrada GVM 800D",
    category: "Paneles LED",
    shortDescription:
      "Panel LED RGB profesional para producciones audiovisuales que necesitan control de color, luz blanca y versatilidad creativa.",
    description:
      "La GVM 800D RGB es un panel LED profesional diseñado para producciones audiovisuales que requieren máximo control creativo del color, sin sacrificar calidad de luz blanca. Combina iluminación RGB completa, modos CCT y HSI, y efectos dinámicos para entrevistas, sets y ambientaciones visuales.",
    specs: [
      "Tipo: panel LED RGB",
      "Potencia: 40 W aprox.",
      "Modos de color: RGB (HSI) y CCT",
      "Temperatura de color: 3.200 K - 5.600 K",
      "Control desde la app GVM",
    ],
    includes: ["1 panel LED GVM 800D", "1 reflector"],
    pricing: [
      { label: "Unitario + trípode", value: "60.000 COP" },
      { label: "Combo X3 + trípode", value: "171.000 COP" },
      { label: "Combo / Baterias", value: "191.000 COP" },
    ],
  },
  11: {
    slug: "luz-led-rgb-ulanzi-vl120-con-clip-02",
    groupKey: "luz-led-rgb-ulanzi-vl120-con-clip-equipo-11",
    name: "Luz LED RGB Ulanzi VL120 con Clip para Celular",
    category: "Luz de acento",
    shortDescription:
      "Luz LED RGB portátil para creadores de contenido, fotografía móvil y producciones audiovisuales ligeras.",
    description:
      "La Ulanzi VL120 RGB es una luz LED compacta y portátil, pensada para creadores de contenido y producciones audiovisuales que necesitan versatilidad en un formato ligero.",
    specs: [
      "Tipo: luz LED RGB portátil",
      "Potencia: 7 W aprox.",
      "Modos: RGB (HSI) y CCT",
      "Temperatura de color: 2.500 K - 9.000 K",
      "Control de intensidad: 0% - 100%",
    ],
    includes: ["1 luz VL120 RGB Ulanzi", "1 difusor", "1 cable USB-C", "1 soporte", "1 clip para celular"],
    pricing: [
      { label: "Unitario + reflector", value: "50.000 COP" },
      { label: "Reflector + trípode", value: "95.000 COP" },
      { label: "Reflector + trípode + softbox", value: "190.000 COP" },
    ],
  },
  12: {
    slug: "maquina-de-humo-f400",
    name: "Máquina de Humo F400",
    category: "Eventos",
    shortDescription:
      "Máquina de humo compacta para eventos, espectáculos y montajes que buscan resaltar la luz y crear atmósferas impactantes.",
    description:
      "La Máquina de Humo F400 es un equipo compacto y eficiente diseñado para generar efectos de niebla que realzan la iluminación y crean atmósferas impactantes en eventos y espectáculos.",
    specs: [
      "Potencia: 400 W",
      "Tiempo de calentamiento: 3-5 minutos aprox.",
      "Salida de humo: flujo continuo controlado",
      "Control: control remoto con cable",
    ],
    includes: ["1 máquina de humo F400"],
    pricing: [
      { label: "Máquina sin líquido", value: "40.000 COP" },
      { label: "Máquina con líquido", value: "50.000 COP" },
    ],
  },
  14: {
    slug: "maquina-de-humo-f400-02",
    name: "Máquina de Humo F400",
    category: "Eventos",
    shortDescription:
      "Máquina de humo compacta para eventos, espectáculos y montajes que buscan resaltar la luz y crear atmósferas impactantes.",
    description:
      "La Máquina de Humo F400 es un equipo compacto y eficiente diseñado para generar efectos de niebla que realzan la iluminación y crean atmósferas impactantes en eventos y espectáculos.",
    specs: [
      "Potencia: 400 W",
      "Tiempo de calentamiento: 3-5 minutos aprox.",
      "Salida de humo: flujo continuo controlado",
      "Control: control remoto con cable",
    ],
    includes: ["1 máquina de humo F400"],
    pricing: [
      { label: "Máquina sin líquido", value: "40.000 COP" },
      { label: "Máquina con líquido", value: "50.000 COP" },
    ],
  },
  16: {
    slug: "reflector-5-en-1-110-cm",
    name: "Reflector 5 en 1 (110 cm)",
    category: "Accesorios",
    shortDescription:
      "Reflector 5 en 1 para fotografía y producción audiovisual, ideal para controlar, modelar y optimizar la iluminación.",
    description:
      "El Reflector 5 en 1 de 110 cm es una herramienta esencial en fotografía y producción audiovisual, diseñada para controlar, modelar y optimizar la iluminación de forma rápida y eficiente.",
    specs: [
      "Incluye 5 reflectores",
      "Dorado: ofrece calidez a la imagen",
      "Plateado: ilumina la imagen",
      "Blanco: rebota la luz hacia las sombras",
      "Negro: bloquea las luces no deseadas",
      "Transluciente: suaviza la luz",
    ],
    includes: ["1 reflector 5 en 1 de 110 cm"],
    pricing: [{ label: "Unitario", value: "35.000 COP" }],
  },
  19: {
    slug: "ulanzi-l024-40w-rgb-02",
    name: "Ulanzi L024 40W RGB",
    category: "Luces COB",
    shortDescription:
      "Luz LED COB RGB compacta y potente para producciones audiovisuales que necesitan control total del color en un formato portátil.",
    description:
      "La Ulanzi L024 40W RGB es una luz LED COB compacta y potente diseñada para producciones audiovisuales que requieren control total del color en un formato portátil.",
    specs: [
      "Tipo: LED COB RGB",
      "Potencia: 40 W",
      "Modos de color: RGB (HSI) y CCT (blanco ajustable)",
      "Temperatura de color: 2.500 K - 9.000 K",
    ],
    includes: ["1 Ulanzi L024 40W RGB", "1 reflector", "1 softbox"],
    pricing: [
      { label: "Unitario", value: "80.000 COP" },
      { label: "Combo x2", value: "190.000 COP" },
      { label: "Unitario + trípode + softbox", value: "110.000 COP" },
      { label: "Combo x2 + trípode + softbox", value: "209.000 COP" },
    ],
  },
  20: {
    slug: "softbox-godox-qr-p70-03",
    name: "Softbox Godox QR-P70",
    category: "Accesorios",
    shortDescription:
      "Modificador de luz profesional para producir una iluminación suave, uniforme y controlada en fotografía y producción audiovisual.",
    description:
      "El Softbox Godox QR-P70 es un modificador de luz profesional diseñado para producir una iluminación suave, uniforme y controlada en fotografía y producción audiovisual.",
    specs: [
      "Tipo: softbox parabólico",
      "Diámetro: 70 cm",
      "Sistema: Quick Release (plegable rápido)",
      "Montura: Bowens",
      "Difusión: difusor interno y difusor frontal",
      "Interior: plateado altamente reflectivo",
    ],
    includes: ["1 Softbox Godox QR-P70"],
    pricing: [{ label: "Unitario", value: "80.000 COP" }],
  },
  21: {
    slug: "barra-led-rgb-50cm-ulanzi-vl119",
    name: "Barra LED RGB 50cm Ulanzi VL119",
    category: "Barras luminosas",
    shortDescription:
      "Barra LED RGB portátil para creadores de contenido, producciones audiovisuales y sets creativos con control total del color.",
    description:
      "La Ulanzi VL119 es una barra LED RGB de 50 cm diseñada para creadores de contenido, producciones audiovisuales y sets creativos que requieren iluminación flexible, portátil y con control total del color.",
    specs: [
      "Tipo: barra LED RGB",
      "Longitud: 50 cm",
      "Fuente de luz: LED de alta eficiencia",
      "Modos de color: RGB completo",
    ],
    includes: ["1 barra LED RGB 50 cm Ulanzi VL119"],
    pricing: [
      { label: "Unitario", value: "50.000 COP" },
      { label: "Combo x2", value: "95.000 COP" },
    ],
  },
  22: {
    slug: "softbox-godox-qr-p70",
    name: "Softbox Godox QR-P70",
    category: "Accesorios",
    shortDescription:
      "Modificador de luz profesional para producir una iluminación suave, uniforme y controlada en fotografía y producción audiovisual.",
    description:
      "El Softbox Godox QR-P70 es un modificador de luz profesional diseñado para producir una iluminación suave, uniforme y controlada en fotografía y producción audiovisual.",
    specs: [
      "Tipo: softbox parabólico",
      "Diámetro: 70 cm",
      "Sistema: Quick Release (plegable rápido)",
      "Montura: Bowens",
      "Difusión: difusor interno y difusor frontal",
      "Interior: plateado altamente reflectivo",
    ],
    includes: ["1 Softbox Godox QR-P70"],
    pricing: [{ label: "Unitario", value: "80.000 COP" }],
  },
  23: {
    slug: "ulanzi-l024-40w-rgb-04",
    name: "Ulanzi L024 40W RGB",
    category: "Luces COB",
    shortDescription:
      "Luz LED COB RGB compacta y potente para producciones audiovisuales que necesitan control total del color en un formato portátil.",
    description:
      "La Ulanzi L024 40W RGB es una luz LED COB compacta y potente diseñada para producciones audiovisuales que requieren control total del color en un formato portátil.",
    specs: [
      "Tipo: LED COB RGB",
      "Potencia: 40 W",
      "Modos de color: RGB (HSI) y CCT (blanco ajustable)",
      "Temperatura de color: 2.500 K - 9.000 K",
    ],
    includes: ["1 Ulanzi L024 40W RGB", "1 reflector", "1 softbox"],
    pricing: [
      { label: "Unitario", value: "80.000 COP" },
      { label: "Combo x2", value: "190.000 COP" },
      { label: "Unitario + trípode + softbox", value: "110.000 COP" },
      { label: "Combo x2 + trípode + softbox", value: "209.000 COP" },
    ],
  },
  24: {
    slug: "ulanzi-l024-40w-rgb-03",
    name: "Ulanzi L024 40W RGB",
    category: "Luces COB",
    shortDescription:
      "Luz LED COB RGB compacta y potente para producciones audiovisuales que necesitan control total del color en un formato portátil.",
    description:
      "La Ulanzi L024 40W RGB es una luz LED COB compacta y potente diseñada para producciones audiovisuales que requieren control total del color en un formato portátil.",
    specs: [
      "Tipo: LED COB RGB",
      "Potencia: 40 W",
      "Modos de color: RGB (HSI) y CCT",
      "Temperatura de color: 2.500 K - 9.000 K",
    ],
    includes: ["1 Ulanzi L024 40W RGB", "1 reflector", "1 softbox"],
    pricing: [
      { label: "Unitario", value: "80.000 COP" },
      { label: "Combo x2", value: "190.000 COP" },
      { label: "Unitario + trípode + softbox", value: "110.000 COP" },
      { label: "Combo x2 + trípode + softbox", value: "209.000 COP" },
    ],
  },
  25: {
    slug: "par-led-big-dipper-lc200",
    name: "Par LED Big Dipper LC200",
    category: "Eventos",
    shortDescription:
      "Luminaria compacta y eficiente para iluminación de escenarios, eventos y aplicaciones decorativas.",
    description:
      "El Par LED Big Dipper LC200 es una luminaria compacta y eficiente diseñada para iluminación de escenarios, eventos y aplicaciones decorativas.",
    specs: [
      "Fuente de luz: LEDs RGB de alta intensidad",
      "Frecuencia: 50/60 HZ",
      "Potencia nominal: 200 W",
      "Modos de operación: automático, sonido, DMX",
    ],
    includes: ["1 Par LED Big Dipper LC200"],
    pricing: [
      { label: "Unitario", value: "80.000 COP" },
      { label: "Combo x2", value: "152.000 COP" },
      { label: "Reflector + trípode + softbox", value: "304.000 COP" },
    ],
  },
  26: {
    slug: "cable-de-alimentacion-y-dmx",
    name: "Cable de Alimentación y DMX",
    category: "Soportes",
    shortDescription:
      "Cable de conexión para integrar alimentación y señal DMX en montajes de iluminación.",
    description:
      "Cable de apoyo para montajes técnicos que requieren conexión de energía y señal DMX entre luminarias, controladores y accesorios de iluminación.",
    specs: [
      "Conectores de alimentación y señal DMX",
      "Uso recomendado: integración técnica en montajes de luces",
      "Compatible con setups de escenario y estudio",
    ],
    includes: ["1 cable de alimentación y DMX"],
    pricing: [{ label: "Unitario", value: "Según cotización" }],
  },
  28: {
    slug: "controlador-dmx-pro-dj-pc384",
    name: "Controlador DMX Pro DJ PC384",
    category: "Control",
    shortDescription:
      "Consola de iluminación profesional para el control preciso y eficiente de sistemas DMX en escenarios y eventos.",
    description:
      "El Controlador DMX Pro DJ PC384 es una consola de iluminación profesional diseñada para el control preciso y eficiente de sistemas DMX en escenarios, eventos y espectáculos en vivo.",
    specs: [
      "Canales DMX: hasta 384 canales",
      "16 faders de 2 capas y 12 scanners",
      "Faders de control de Speed y Fade Time",
      "Entrada y salida DMX 3 pines",
    ],
    includes: ["1 controlador DMX Pro DJ PC384"],
    pricing: [{ label: "Unitario", value: "60.000 COP" }],
  },
  29: {
    slug: "consola-dmx-operator-384",
    name: "Consola DMX Operator 384",
    category: "Control",
    shortDescription:
      "Controlador DMX de formato compacto para operar luminarias, escenas y secuencias en montajes técnicos.",
    description:
      "La Consola DMX Operator 384 es un controlador compacto pensado para operar luminarias y programaciones básicas en montajes de eventos, escenarios y setups audiovisuales.",
    specs: [
      "Tipo: consola/controlador DMX",
      "Formato compacto para operación técnica",
      "Uso recomendado: luces, escenas y secuencias programadas",
    ],
    includes: ["1 consola DMX Operator 384"],
    pricing: [{ label: "Unitario", value: "Según cotización" }],
  },
  30: {
    slug: "godox-sl-100bi",
    name: "Godox SL-100Bi",
    category: "Luces COB",
    shortDescription:
      "Luz LED continua bi-color de alto rendimiento para producciones audiovisuales que requieren control preciso de temperatura de color.",
    description:
      "La Godox SL-100Bi es una luz LED continua bi-color de alto rendimiento diseñada para producciones audiovisuales profesionales que requieren control preciso de temperatura de color y una iluminación potente y estable.",
    specs: [
      "Temperatura de color: 2.800 K - 6.500 K",
      "Graduación: 0% a 100%",
      "Efectos de iluminación integrados: 11",
    ],
    includes: ["1 Godox SL-100Bi", "1 reflector"],
    pricing: [
      { label: "Unitario + reflector", value: "150.000 COP" },
      { label: "Reflector + trípode", value: "165.000 COP" },
      { label: "Reflector + trípode + softbox", value: "220.000 COP" },
    ],
  },
  17: {
    slug: "kit-kt272-telones-y-luces-02",
    name: "KIT KT272 - Telones y Luces",
    category: "Fondos",
    shortDescription:
      "Kit de fondos y luces para estudio fotográfico y producciones audiovisuales que necesitan fondos limpios y cobertura amplia.",
    description:
      "El Kit de Telones Fondo Sinfín 3x6 m KT272 con bombillos y softbox es una solución versátil y profesional para estudios fotográficos y producciones audiovisuales que requieren fondos limpios, uniformes y de gran cobertura.",
    specs: [
      "3 telones de fondo fotográfico de tela de 1,7 m x 2,8 m",
      "Tipo: fondo sinfín de tela",
      "Dimensiones por telón: 3 x 6 metros",
      "Colores incluidos: negro, verde y blanco",
      "1 soporte de fondo de 2 m x 3 m",
      "2 bombillos de 65 W",
      "2 trípodes de luz de 2 metros",
      "2 softbox con socket",
    ],
    includes: ["1 tela", "1 soporte + tela", "1 soporte + 3 telas", "Bombillo + softbox"],
    pricing: [
      { label: "1 tela", value: "40.000 COP" },
      { label: "Soporte + tela", value: "80.000 COP" },
      { label: "Soporte + 3 telas", value: "150.000 COP" },
      { label: "Bombillo + softbox", value: "30.000 COP" },
      { label: "Bombillo + softbox x2", value: "60.000 COP" },
      { label: "Kit completo", value: "342.000 COP" },
    ],
  },
  18: {
    slug: "luz-cuadrada-gvm-800d-02",
    name: "Luz Cuadrada GVM 800D",
    category: "Paneles LED",
    shortDescription:
      "Panel LED RGB profesional para producciones audiovisuales que necesitan control de color, luz blanca y versatilidad creativa.",
    description:
      "La GVM 800D RGB es un panel LED profesional diseñado para producciones audiovisuales que requieren máximo control creativo del color, sin sacrificar calidad de luz blanca. Combina iluminación RGB completa, modos CCT y HSI, y efectos dinámicos, permitiendo crear desde una iluminación natural para entrevistas hasta ambientaciones creativas para sets audiovisuales.",
    specs: [
      "Tipo: panel LED RGB",
      "Potencia: 40 W aprox.",
      "Modos de color: RGB (HSI) / CCT",
      "Temperatura de color: 3.200 K - 5.600 K",
      "Control desde la app GVM",
    ],
    includes: ["1 panel LED GVM 800D", "1 reflector"],
    pricing: [
      { label: "Unitario + trípode", value: "60.000 COP" },
      { label: "Combo X3 + trípode", value: "171.000 COP" },
      { label: "Combo / Baterias", value: "191.000 COP" },
    ],
  },
  31: {
    slug: "par-led-pro-dj-pl006",
    name: "Par LED Pro DJ PL006",
    category: "Eventos",
    shortDescription:
      "Luminaria compacta y versátil para iluminación de escenarios, eventos y aplicaciones decorativas.",
    description:
      "El Par LED Pro DJ PL006 es una luminaria compacta y versátil diseñada para iluminación de escenarios, eventos y aplicaciones decorativas.",
    specs: [
      "Potencia: 18 LEDs de 15 W (RGBWA UV 6 en 1)",
      "Potencia total: 270 W",
      "Voltaje/Frecuencia: 110-240 V, 50-60 Hz",
      "Modos de operación: automático, sonido, DMX",
    ],
    includes: ["1 Par LED Pro DJ PL006"],
    pricing: [
      { label: "Unitario", value: "60.000 COP" },
      { label: "Combo x2", value: "114.000 COP" },
    ],
  },
  34: {
    slug: "tripoide-de-iluminacion-reforzado",
    name: "Trípode de Iluminación Reforzado",
    category: "Soportes",
    shortDescription:
      "Soporte alto y estable para montar luminarias, modificadores y accesorios de estudio.",
    description:
      "Trípode de iluminación reforzado diseñado para sostener luminarias y accesorios en montajes de estudio, fotografía, video y producción técnica.",
    specs: [
      "Tipo: trípode de iluminación",
      "Base amplia para mayor estabilidad",
      "Uso recomendado: luces, modificadores y accesorios",
      "Ideal para estudio y producción audiovisual",
    ],
    includes: ["1 trípode de iluminación reforzado"],
    pricing: [{ label: "Unitario", value: "Según cotización" }],
  },
  33: {
    slug: "ulanzi-ua12-air-tube-02",
    name: "Ulanzi UA12 Air Tube",
    category: "Tubos",
    shortDescription:
      "Luz LED inflable tubular para producciones audiovisuales que necesitan una iluminación suave, uniforme y portátil.",
    description:
      "La Ulanzi UA12 Air Tube es una luz LED inflable de formato tubular diseñada para producciones audiovisuales modernas que requieren una iluminación suave, uniforme y portátil.",
    specs: [
      "Luz LED tipo tubo de aire plegable",
      "Fácil de transportar y usar",
      "Ideal para espacios limitados o uso al aire libre",
      "Brillo y temperatura de color ajustables",
      "12 efectos de iluminación",
    ],
    includes: ["1 Ulanzi UA12 Air Tube"],
    pricing: [
      { label: "Unitario", value: "50.000 COP" },
      { label: "Combo x2", value: "95.000 COP" },
    ],
  },
  37: {
    slug: "kit-kt272-telones-y-luces-03",
    name: "KIT KT272 - Telones y Luces",
    category: "Fondos",
    shortDescription:
      "Kit de fondos y luces para estudio fotográfico y producciones audiovisuales que necesitan fondos limpios y cobertura amplia.",
    description:
      "El Kit de Telones Fondo Sinfín 3x6 m KT272 con bombillos y softbox es una solución versátil y profesional para estudios fotográficos y producciones audiovisuales que requieren fondos limpios, uniformes y de gran cobertura.",
    specs: [
      "3 telones de fondo fotográfico de tela de 1,7 m x 2,8 m",
      "Tipo: fondo sinfín de tela",
      "Dimensiones por telón: 3 x 6 metros",
      "Colores incluidos: negro, verde y blanco",
      "1 soporte de fondo de 2 m x 3 m",
      "2 bombillos de 65 W",
      "2 trípodes de luz de 2 metros",
      "2 softbox con socket",
    ],
    includes: ["1 tela", "1 soporte + tela", "1 soporte + 3 telas", "Bombillo + softbox"],
    pricing: [
      { label: "1 tela", value: "40.000 COP" },
      { label: "Soporte + tela", value: "80.000 COP" },
      { label: "Soporte + 3 telas", value: "150.000 COP" },
      { label: "Bombillo + softbox", value: "30.000 COP" },
      { label: "Bombillo + softbox x2", value: "60.000 COP" },
      { label: "Kit completo", value: "342.000 COP" },
    ],
  },
  35: {
    slug: "godox-sl-100bi-02",
    name: "Godox SL-100Bi",
    category: "Luces COB",
    shortDescription:
      "Luz LED continua bi-color de alto rendimiento para producciones audiovisuales que requieren control preciso de temperatura de color.",
    description:
      "La Godox SL-100Bi es una luz LED continua bi-color de alto rendimiento diseñada para producciones audiovisuales profesionales que requieren control preciso de temperatura de color y una iluminación potente y estable.",
    specs: [
      "Temperatura de color: 2.800 K - 6.500 K",
      "Graduación: 0% a 100%",
      "Efectos de iluminación integrados: 11",
    ],
    includes: ["1 Godox SL-100Bi", "1 reflector"],
    pricing: [
      { label: "Unitario + reflector", value: "150.000 COP" },
      { label: "Reflector + trípode", value: "165.000 COP" },
      { label: "Reflector + trípode + softbox", value: "220.000 COP" },
    ],
  },
  39: {
    slug: "zhiyun-molus-x60-rgb-panel-led",
    name: "Zhiyun Molus X60 RGB Panel LED",
    category: "Luces COB",
    shortDescription:
      "Luz LED COB RGB compacta y de alto rendimiento para creadores, cineastas y producciones audiovisuales.",
    description:
      "La Zhiyun Molus X60 RGB es una luz LED COB compacta y de alto rendimiento diseñada para creadores de contenido, cineastas y producciones audiovisuales que requieren máxima versatilidad en un formato portátil.",
    specs: [
      "Tipo: LED COB RGB",
      "Potencia: 60 W",
      "Modos de color: RGB (HSI) y CCT (blanco ajustable)",
      "Temperatura de color: 2.700 K - 6.500 K",
      "Control de intensidad: 0% - 100%",
    ],
    includes: ["1 Zhiyun Molus X60 RGB Panel LED"],
    pricing: [
      { label: "Unitario", value: "260.000 COP" },
      { label: "Combo x2", value: "494.000 COP" },
    ],
  },
  40: {
    slug: "reflector-plegable-ovalado",
    name: "Reflector Plegable Ovalado",
    category: "Fondos",
    shortDescription:
      "Reflector plegable de varias superficies para modular rebote, contraste y temperatura de la luz.",
    description:
      "El reflector plegable ovalado es un accesorio práctico para controlar rebotes y matices de luz en fotografía, video y estudio, con superficies pensadas para diferentes necesidades de iluminación.",
    specs: [
      "Tipo: reflector plegable ovalado",
      "Superficies para rebote y control de luz",
      "Uso recomendado: retrato, producto, video y estudio",
    ],
    includes: ["1 reflector plegable ovalado"],
    pricing: [{ label: "Unitario", value: "Según cotización" }],
  },
  38: {
    slug: "difusor-rectangular-de-tela",
    name: "Difusor Rectangular de Tela",
    category: "Fondos",
    shortDescription:
      "Superficie difusora ligera para suavizar la luz en fotografía, video y montajes de estudio.",
    description:
      "El difusor rectangular de tela es una superficie ligera pensada para suavizar fuentes de luz y controlar reflejos en setups de fotografía, video y estudio.",
    specs: [
      "Tipo: difusor textil rectangular",
      "Uso recomendado: suavizar luz y reducir contraste",
      "Ligero y fácil de integrar en montajes de estudio",
      "Ideal para retrato, producto y video",
    ],
    includes: ["1 difusor rectangular de tela"],
    pricing: [{ label: "Unitario", value: "Según cotización" }],
  },
  41: {
    slug: "reflector-5-en-1-110-cm-02",
    name: "Reflector 5 en 1 (110 cm)",
    category: "Accesorios",
    shortDescription:
      "Reflector 5 en 1 para fotografía y producción audiovisual, ideal para controlar, modelar y optimizar la iluminación.",
    description:
      "El Reflector 5 en 1 de 110 cm es una herramienta esencial en fotografía y producción audiovisual, diseñada para controlar, modelar y optimizar la iluminación de forma rápida y eficiente.",
    specs: [
      "Incluye 5 reflectores",
      "Dorado: ofrece calidez a la imagen",
      "Plateado: ilumina la imagen",
      "Blanco: rebota la luz hacia las sombras",
      "Negro: bloquea las luces no deseadas",
      "Transluciente: suaviza la luz",
    ],
    includes: ["1 reflector 5 en 1 de 110 cm"],
    pricing: [{ label: "Unitario", value: "35.000 COP" }],
  },
  42: {
    slug: "luz-led-rgb-ulanzi-vl120-con-clip-03",
    name: "Luz LED RGB Ulanzi VL120 con Clip para Celular",
    category: "Luz de acento",
    shortDescription:
      "Luz LED RGB compacta y portátil para creadores de contenido y producciones audiovisuales que necesitan máxima versatilidad.",
    description:
      "La Ulanzi VL120 RGB es una luz LED RGB compacta y portátil, diseñada para creadores de contenido y producciones audiovisuales que necesitan máxima versatilidad en un formato ligero.",
    specs: [
      "Tipo: luz LED RGB portátil",
      "Potencia: 7 W aprox.",
      "Modos de color: RGB (HSI) y CCT (blanco ajustable)",
      "Temperatura de color: 2.500 K - 9.000 K",
      "Control de intensidad: 0% - 100%",
    ],
    includes: ["1 luz VL120 RGB Ulanzi", "1 difusor", "1 cable USB-C", "1 soporte", "1 clip para celular"],
    pricing: [
      { label: "Unitario + reflector", value: "50.000 COP" },
      { label: "Reflector + trípode", value: "95.000 COP" },
      { label: "Reflector + trípode + softbox", value: "190.000 COP" },
    ],
  },
  43: {
    slug: "barra-led-rgb-50cm-ulanzi-vl119-02",
    name: "Barra LED RGB 50cm Ulanzi VL119",
    category: "Barras luminosas",
    shortDescription:
      "Barra LED RGB portátil para creadores de contenido, producciones audiovisuales y sets creativos con control total del color.",
    description:
      "La Ulanzi VL119 es una barra LED RGB de 50 cm diseñada para creadores de contenido, producciones audiovisuales y sets creativos que requieren iluminación flexible, portátil y con control total del color.",
    specs: [
      "Tipo: barra LED RGB",
      "Longitud: 50 cm",
      "Fuente de luz: LED de alta eficiencia",
      "Modos de color: RGB completo",
    ],
    includes: ["1 barra LED RGB 50 cm Ulanzi VL119"],
    pricing: [
      { label: "Unitario", value: "50.000 COP" },
      { label: "Combo x2", value: "95.000 COP" },
    ],
  },
  44: {
    slug: "softbox-godox-qr-p70-02",
    name: "Softbox Godox QR-P70",
    category: "Accesorios",
    shortDescription:
      "Modificador de luz profesional para producir una iluminación suave, uniforme y controlada en fotografía y producción audiovisual.",
    description:
      "El Softbox Godox QR-P70 es un modificador de luz profesional diseñado para producir una iluminación suave, uniforme y controlada en fotografía y producción audiovisual.",
    specs: [
      "Tipo: softbox parabólico",
      "Diámetro: 70 cm",
      "Sistema: Quick Release (plegable rápido)",
      "Montura: Bowens",
      "Difusión: difusor interno y difusor frontal",
      "Interior: plateado altamente reflectivo",
    ],
    includes: ["1 Softbox Godox QR-P70"],
    pricing: [{ label: "Unitario", value: "80.000 COP" }],
  },
  45: {
    slug: "ulanzi-l024-40w-rgb-05",
    name: "Ulanzi L024 40W RGB",
    category: "Luces COB",
    shortDescription:
      "Luz LED COB RGB compacta y potente para producciones audiovisuales que necesitan control total del color en un formato portátil.",
    description:
      "La Ulanzi L024 40W RGB es una luz LED COB compacta y potente diseñada para producciones audiovisuales que requieren control total del color en un formato portátil.",
    specs: [
      "Tipo: LED COB RGB",
      "Potencia: 40 W",
      "Modos de color: RGB (HSI) y CCT (blanco ajustable)",
      "Temperatura de color: 2.500 K - 9.000 K",
    ],
    includes: ["1 Ulanzi L024 40W RGB", "1 reflector", "1 softbox"],
    pricing: [
      { label: "Unitario", value: "80.000 COP" },
      { label: "Combo x2", value: "190.000 COP" },
      { label: "Unitario + trípode + softbox", value: "110.000 COP" },
      { label: "Combo x2 + trípode + softbox", value: "209.000 COP" },
    ],
  },
  46: {
    slug: "laser-pl27-rgb",
    name: "Láser PL27 RGB",
    category: "Eventos",
    shortDescription:
      "Equipo de efectos para crear proyecciones láser dinámicas y multicolor en eventos, fiestas y espectáculos.",
    description:
      "El Láser PL27 RGB es un equipo de efectos diseñado para crear proyecciones láser dinámicas y multicolor en eventos, fiestas y espectáculos.",
    specs: [
      "Colores: rojo, verde y azul (mezcla RGB)",
      "Modos de proyección: figuras, patrones y haces",
      "Velocidad de escaneo: ajustable",
      "Dimmer: control electrónico",
      "Modos de operación: automático / activación por sonido / DMX / master / slave",
    ],
    includes: ["1 Láser PL27 RGB"],
    pricing: [{ label: "Unitario", value: "40.000 COP" }],
  },
};

const serviceCatalog = [
  {
    slug: "kit-creador-start",
    eyebrow: "COMBO 1",
    title: "Creador Start",
    serviceImage: comboDetailOneImage,
    homeImage: comboCreatorStartImage,
    summary: "Un inicio versátil para reels, TikTok, YouTube y contenido para redes.",
    description:
      "Iluminación compacta para crear contenido con una luz principal potente, apoyos RGB y fondos intercambiables.",
    idealFor: "Ideal para creación de contenido, reels, TikTok, Instagram y YouTube.",
    includes: [
      "2 x Zhiyun Molus X60 RGB",
      "2 x Ulanzi VL120 RGB (luz de apoyo / clip de celular)",
      "1 x KIT KT272 (soporte + 3 telas)",
    ],
    price: "Precio base: 380.000 COP",
  },
  {
    slug: "kit-creador-pro",
    eyebrow: "COMBO 2",
    title: "Creador Pro",
    serviceImage: comboDetailTwoImage,
    homeImage: landingCreatorProImage,
    summary: "Un estudio completo para podcast, streaming y contenido digital.",
    description:
      "Configuración profesional con luces COB, paneles RGB, tubos, fondos y luces de apoyo para producciones de contenido con mayor cobertura.",
    idealFor: "Ideal para podcast, entrevistas, streams, reels, YouTube, TikTok e Instagram.",
    includes: [
      "2 x Ulanzi L024 40W RGB con trípode y softbox",
      "2 x Ulanzi VL120 RGB (luz de apoyo / clip de celular)",
      "3 x GVM 800D (combo x3)",
      "1 x Reflector 5 en 1 (110 cm)",
      "2 x Ulanzi UA12 Air Tube",
      "1 x KIT KT272 (soporte + 3 telas)",
      "4 x Par LED Big Dipper LC200",
    ],
    price: "Precio base: 550.000 COP",
  },
  {
    slug: "kit-podcast-premium",
    eyebrow: "COMBO 3",
    title: "Podcast Premium",
    serviceImage: comboDetailThreeImage,
    homeImage: comboOneHomeImage,
    summary: "Iluminación completa para podcast de dos a cuatro personas.",
    description:
      "Un setup amplio y equilibrado para iluminar conversaciones, entrevistas y transmisiones con una imagen consistente.",
    idealFor: "Ideal para podcast de 2 a 4 personas, streaming y entrevistas.",
    includes: [
      "2 x Ulanzi L024 40W RGB con trípode y softbox",
      "3 x GVM 800D (combo x3)",
      "2 x Ulanzi UA12 Air Tube",
      "4 x Par LED Big Dipper LC200",
      "1 x KIT KT272 (soporte + 3 telas)",
      "1 x Reflector 5 en 1 (110 cm)",
    ],
    price: "Precio base: 650.000 COP",
  },
  {
    slug: "kit-marca-profesional",
    eyebrow: "COMBO 4",
    title: "Marca Profesional",
    serviceImage: comboDetailFourImage,
    homeImage: landingProfessionalBrandImage,
    summary: "Una solución flexible para marca personal y contenido comercial.",
    description:
      "Iluminación RGB y continua para construir piezas audiovisuales con identidad y mayor control visual.",
    idealFor:
      "Ideal para producción audiovisual media, videoclips pequeños, entrevistas, marca personal, videos corporativos y redes sociales.",
    includes: [
      "1 x Zhiyun Molus X60 RGB",
      "2 x Ulanzi UA12 Air Tube",
      "2 x Ulanzi L024 40W RGB con trípode y softbox",
      "2 x Ulanzi VL119 barra LED",
      "2 x Ulanzi VL120 RGB (luz de apoyo / clip de celular)",
      "1 x Reflector 5 en 1 (110 cm)",
      "2 x Par LED Pro DJ PL006",
    ],
    price: "Precio base: 870.000 COP",
  },
  {
    slug: "kit-fotografia-profesional",
    eyebrow: "COMBO 5",
    title: "Fotografía Profesional",
    serviceImage: comboDetailFiveImage,
    homeImage: landingPhotographyProfessionalImage,
    summary: "Luz controlada para retrato, producto, moda y e-commerce.",
    description:
      "Configuración de estudio con iluminación continua, modificadores y fondos para producir fotografías limpias y consistentes.",
    idealFor: "Ideal para retratos, producto, moda básica y e-commerce.",
    includes: [
      "3 x GVM 800D (combo x3)",
      "1 x Godox SL-100Bi (reflector + trípode)",
      "1 x Softbox Godox QR-P70 con grid",
      "1 x Reflector 5 en 1 (110 cm)",
      "1 x KIT KT272 (soporte + 3 telas)",
      "2 x bombillos key light de 65 W",
      "2 x trípodes de luz de 2 m",
      "2 x softbox con sock",
    ],
    price: "Precio base: 580.000 COP",
  },
  {
    slug: "kit-produccion-audiovisual-comercial",
    eyebrow: "COMBO 6",
    title: "Producción Audiovisual Comercial",
    serviceImage: comboDetailSixImage,
    homeImage: comboFourHomeImage,
    summary: "Cobertura completa para comerciales, videoclips y sets complejos.",
    description:
      "El kit de mayor alcance para producciones que necesitan potencia, variedad de fuentes, fondos y control creativo de escena.",
    idealFor:
      "Ideal para producciones audiovisuales completas, comerciales, videoclips, fashion films y sets complejos.",
    includes: [
      "2 x Zhiyun Molus X60 RGB",
      "2 x Ulanzi VL119 barra LED",
      "3 x GVM 800D (combo x3)",
      "1 x Softbox Godox QR-P70 con grid",
      "1 x Godox SL-100Bi con softbox",
      "4 x Ulanzi VL120 RGB (luz de apoyo / clip de celular)",
      "2 x Ulanzi UA12 Air Tube",
      "1 x KIT KT272 completo",
      "4 x Par LED Big Dipper LC200",
      "2 x Par LED Pro DJ PL006",
    ],
    price: "Precio base: 1.200.000 COP",
  },
];

const homeServiceCards = serviceCatalog.map((service) => ({
  ...service,
  image: service.homeImage,
}));

const servicesPageCards = serviceCatalog.map((service) => ({
  ...service,
  image: service.serviceImage,
}));

const hiddenEquipmentOrders = new Set([9, 12, 13, 15, 22, 23, 27, 32, 33, 36]);

const allEquipmentImages = Object.entries(equipmentBannerModules)
  .map(([path, src]) => {
    const match = path.match(/\/(\d*)equiposceniza\.webp$/);
    const number = match?.[1] ? Number(match[1]) : 0;

    return {
      path,
      src,
      alt: number ? `Equipo Ceniza ${number}` : "Equipo Ceniza",
      order: number,
    };
  })
  .sort((a, b) => a.order - b.order);

const equipmentBannerImages = allEquipmentImages
  .filter((item) => item.order > 0 && !hiddenEquipmentOrders.has(item.order))
  .sort((a, b) => a.order - b.order);

const catalogGalleryOrderOverrides = {
  "luz-cuadrada-gvm-800d": [10, 18],
  "maquina-de-humo-f400": [12, 14],
  "maquina-de-humo-f400-02": [12, 14],
  "par-led-pro-dj-pl006": [31, 32],
  "softbox-godox-qr-p70": [20, 22, 44],
  "softbox-godox-qr-p70-03": [20, 22, 44],
  "softbox-cuadrado-estudio": [5, 9],
  "ulanzi-l024-40w-rgb": [45, 19, 23, 24],
  "ulanzi-l024-40w-rgb-02": [45, 19, 23, 24],
  "ulanzi-ua12-air-tube": [8, 33],
};

const catalogSpotlight = equipmentBannerImages
  .filter((item) => item.order > 0)
  .slice(0, 3)
  .map((item, index) => ({
    ...item,
    eyebrow: `PIEZA 0${index + 1}`,
    title:
      index === 0
        ? "Panel LED compacto"
        : index === 1
          ? "Barra de luz lineal"
          : "Luz de acento escénico",
    summary:
      index === 0
        ? "Luminaria pensada para setups de contenido, retrato y producciones que necesitan una fuente limpia, portable y fácil de montar."
        : index === 1
          ? "Solución versátil para sets donde se necesita cobertura lineal, lectura visual elegante y control de dirección en espacios interiores."
          : "Recurso premium para reforzar escenas, ambientación de venue y acentos visuales dentro de montajes escénicos o experiencias de marca.",
    specs:
      index === 0
        ? ["Formato compacto para espacios pequeños", "Lectura suave para rostro y producto", "Ideal para foto, video y streaming"]
        : index === 1
          ? ["Cobertura horizontal y look limpio", "Funciona como refuerzo o acento", "Escalable dentro de combos o riders"]
          : ["Apoyo puntual para ambientación", "Muy útil en eventos y montajes híbridos", "Se integra fácil a propuestas mayores"],
    pricing:
      index === 0
        ? [
            { label: "Unitario", value: "Desde 90.000 COP" },
            { label: "Combo", value: "Cotización según setup" },
          ]
        : index === 1
          ? [
              { label: "Unitario", value: "Desde 120.000 COP" },
              { label: "Combo", value: "Disponible para rider" },
            ]
          : [
              { label: "Unitario", value: "Desde 80.000 COP" },
              { label: "Combo", value: "Escalable por montaje" },
            ],
  }));

const catalogSidebarSections = [
  {
    title: "Luz continua",
    items: ["Luces COB", "Paneles LED", "Tubos", "Barras luminosas", "Luz de acento"],
  },
  {
    title: "Producción",
    items: [
      "Creador Start",
      "Creador Pro",
      "Podcast Premium",
      "Marca Profesional",
      "Fotografía Profesional",
      "Producción Audiovisual Comercial",
    ],
  },
  {
    title: "Montaje",
    items: ["Soportes", "Fondos", "Accesorios"],
  },
];

const catalogCategorySlugOverrides = {
  "Creador Start": new Set([
    "zhiyun-molus-x60-rgb-panel-led",
    "luz-led-rgb-ulanzi-vl120-con-clip",
    "kit-kt272-telones-y-luces-02",
  ]),
  "Creador Pro": new Set([
    "ulanzi-l024-40w-rgb-02",
    "luz-led-rgb-ulanzi-vl120-con-clip",
    "luz-cuadrada-gvm-800d",
    "reflector-5-en-1-110-cm",
    "ulanzi-ua12-air-tube",
    "kit-kt272-telones-y-luces-02",
    "par-led-big-dipper-lc200",
  ]),
  "Podcast Premium": new Set([
    "ulanzi-l024-40w-rgb-02",
    "luz-cuadrada-gvm-800d",
    "ulanzi-ua12-air-tube",
    "par-led-big-dipper-lc200",
    "kit-kt272-telones-y-luces-02",
    "reflector-5-en-1-110-cm",
  ]),
  "Marca Profesional": new Set([
    "zhiyun-molus-x60-rgb-panel-led",
    "ulanzi-ua12-air-tube",
    "ulanzi-l024-40w-rgb-02",
    "barra-led-rgb-50cm-ulanzi-vl119",
    "luz-led-rgb-ulanzi-vl120-con-clip",
    "reflector-5-en-1-110-cm",
    "par-led-pro-dj-pl006",
  ]),
  "Fotografía Profesional": new Set([
    "luz-cuadrada-gvm-800d",
    "godox-sl-100bi",
    "softbox-godox-qr-p70",
    "reflector-5-en-1-110-cm",
    "kit-kt272-telones-y-luces-02",
    "tripoide-de-iluminacion-reforzado",
    "softbox-cuadrado-estudio",
  ]),
  "Producción Audiovisual Comercial": new Set([
    "zhiyun-molus-x60-rgb-panel-led",
    "barra-led-rgb-50cm-ulanzi-vl119",
    "luz-cuadrada-gvm-800d",
    "softbox-godox-qr-p70",
    "godox-sl-100bi",
    "luz-led-rgb-ulanzi-vl120-con-clip",
    "ulanzi-ua12-air-tube",
    "kit-kt272-telones-y-luces-02",
    "par-led-big-dipper-lc200",
    "par-led-pro-dj-pl006",
  ]),
  "Fotografía": new Set([
    "godox-sl-100bi",
    "kit-kt272-telones-y-luces-02",
    "luz-cuadrada-gvm-800d",
    "reflector-5-en-1-110-cm",
    "softbox-godox-qr-p70",
    "softbox-godox-qr-p70-03",
  ]),
  "Podcast / streaming": new Set([
    "kit-kt272-telones-y-luces-02",
    "luz-cuadrada-gvm-800d",
    "luz-led-rgb-ulanzi-vl120-con-clip-02",
    "reflector-5-en-1-110-cm",
    "ulanzi-l024-40w-rgb-02",
    "ulanzi-ua12-air-tube",
  ]),
  "Video": new Set([
    "barra-led-rgb-50cm-ulanzi-vl119",
    "godox-sl-100bi",
    "kit-kt272-telones-y-luces-02",
    "luz-cuadrada-gvm-800d",
    "luz-led-rgb-ulanzi-vl120-con-clip-02",
    "reflector-5-en-1-110-cm",
    "softbox-godox-qr-p70",
    "softbox-godox-qr-p70-03",
    "ulanzi-l024-40w-rgb-02",
    "ulanzi-ua12-air-tube",
    "zhiyun-molus-x60-rgb-panel-led",
  ]),
  "Eventos": new Set([
    "barra-led-pl183-washer-pro-dj",
    "blinder-pl2200-pro-dj",
    "cabeza-movil-pl61-spot-pro-dj-lighting",
    "controlador-dmx-pro-dj-pc384",
    "equipo-29",
    "laser-pl27-rgb",
    "maquina-de-humo-f400",
    "maquina-de-humo-f400-02",
    "par-led-big-dipper-lc200",
    "par-led-pro-dj-pl006",
  ]),
  "Fondos": new Set([
    "difusor-rectangular-de-tela",
    "kit-kt272-telones-y-luces-02",
  ]),
  "Soportes": new Set([
    "cable-de-alimentacion-y-dmx",
    "tripoide-de-iluminacion-reforzado",
  ]),
  "Control": new Set([
    "consola-dmx-operator-384",
    "controlador-dmx-pro-dj-pc384",
  ]),
};

const catalogCategoryList = catalogSidebarSections.flatMap((section) =>
  section.items.map((item) => ({
    section: section.title,
    category: item,
  })),
);

const catalogBrowserRawItems = equipmentBannerImages.map((image, index, images) => {
  const categoryIndex = Math.min(
    catalogCategoryList.length - 1,
    Math.floor((index * catalogCategoryList.length) / images.length),
  );
  const categoryMeta = catalogCategoryList[categoryIndex];
  const pathMatch = image.path?.match(/\/(\d+)equiposceniza\.png$/);
  const explicitOrder = pathMatch?.[1] ? Number(pathMatch[1]) : image.order;
  const productDetail = explicitOrder ? catalogProductDetails[explicitOrder] : null;
  const slug = productDetail?.slug ?? `equipo-${String(explicitOrder ?? index + 1).padStart(2, "0")}`;
  const groupKey = productDetail?.groupKey ?? (productDetail?.name ?? (explicitOrder ? `Equipo ${String(explicitOrder).padStart(2, "0")}` : image.alt)).trim().toLowerCase();

  return {
    ...image,
    section: categoryMeta.section,
    category: productDetail?.category ?? categoryMeta.category,
    label: productDetail?.name ?? (explicitOrder ? `Equipo ${String(explicitOrder).padStart(2, "0")}` : image.alt),
    slug,
    href: `${PRODUCTS_PATH}/${slug}`,
    shortDescription:
      productDetail?.shortDescription ??
      "Equipo disponible para renta y cotización según montaje, rider y necesidad técnica.",
    description:
      productDetail?.description ??
      "Referencia del catálogo Ceniza disponible para alquiler en Bogotá y Colombia según disponibilidad y alcance técnico.",
    groupKey,
    specs:
      productDetail?.specs ?? [`Categoría: ${productDetail?.category ?? categoryMeta.category}`, "Disponibilidad: confirmar por cotización"],
    includes: productDetail?.includes ?? ["Equipo disponible según inventario Ceniza", "Cotización por unidad o por combo"],
    pricing: productDetail?.pricing ?? [{ label: "Cotización", value: "Según setup" }],
  };
});

const productsWithdrawnForSale = new Set([
  "barra-led-pl183-washer-pro-dj",
  "cabeza-movil-pl61-spot-pro-dj-lighting",
  "blinder-pl2200-pro-dj",
  "controlador-dmx-pro-dj-pc384",
  "consola-dmx-operator-384",
  "laser-pl27-rgb",
]);

const catalogBrowserItems = Array.from(
  catalogBrowserRawItems.reduce((groups, item) => {
    const existingGroup = groups.get(item.groupKey);
    const galleryImage = {
      src: item.src,
      alt: item.alt,
      order: item.order,
    };

    if (!existingGroup) {
      groups.set(item.groupKey, {
        ...item,
        aliases: [item.slug],
        galleryImages: [galleryImage],
      });
      return groups;
    }

    groups.set(item.groupKey, {
      ...existingGroup,
      aliases: [...new Set([...existingGroup.aliases, item.slug])],
      galleryImages: existingGroup.galleryImages.some((imageEntry) => imageEntry.src === item.src)
        ? existingGroup.galleryImages
        : [...existingGroup.galleryImages, galleryImage].sort((a, b) => a.order - b.order),
    });

    return groups;
  }, new Map()).values(),
).map((item) => {
  const overrideSourceKey =
    item.slug in catalogGalleryOrderOverrides
      ? item.slug
      : item.aliases?.find((alias) => alias in catalogGalleryOrderOverrides);
  const overrideOrders = overrideSourceKey ? catalogGalleryOrderOverrides[overrideSourceKey] : [];
  const overrideImages = overrideOrders
    .map((order) => allEquipmentImages.find((image) => image.order === order))
    .filter(Boolean)
    .map((image) => ({
      src: image.src,
      alt: image.alt,
      order: image.order,
    }));
  const galleryByOrder = new Map(item.galleryImages.map((image) => [image.order, image]));

  overrideImages.forEach((image) => {
    galleryByOrder.set(image.order, image);
  });

  const mergedGalleryImages = overrideOrders.length
    ? [
      ...overrideOrders.map((order) => galleryByOrder.get(order)).filter(Boolean),
      ...Array.from(galleryByOrder.values())
        .filter((image) => !overrideOrders.includes(image.order))
        .sort((a, b) => a.order - b.order),
    ]
    : Array.from(galleryByOrder.values()).sort((a, b) => a.order - b.order);
  const finalGalleryImages = item.slug === "ulanzi-ua12-air-tube"
    ? mergedGalleryImages.filter((image) => image.order === 8).slice(0, 1)
    : mergedGalleryImages;

  return {
    ...item,
    galleryImages: finalGalleryImages,
    src: finalGalleryImages[0]?.src ?? item.src,
    alt: finalGalleryImages[0]?.alt ?? item.alt,
    href: `${PRODUCTS_PATH}/${item.slug}`,
  };
}).filter((item) => !productsWithdrawnForSale.has(item.slug));

const catalogMosaicPool = catalogBrowserItems.map((item) => ({
  ...item,
  title: item.label,
  description:
    item.shortDescription
      .split(/[.,]/)
      .map((segment) => segment.trim())
      .find(Boolean) ?? item.shortDescription,
}));

const portfolioCards = [
  {
    image: eventTwoImage,
    className: "card-2",
    alt: "Producción visual de evento Ceniza",
  },
  {
    image: eventThreeImage,
    className: "card-3",
    alt: "Dirección técnica para montaje Ceniza",
  },
  {
    image: eventFourImage,
    className: "wide",
    alt: "Montaje de iluminación para evento Ceniza",
  },
  {
    image: eventFiveImage,
    className: "tall",
    alt: "Atmósfera de evento con iluminación Ceniza",
  },
  {
    image: eventSixImage,
    className: "small",
    alt: "Detalle técnico de montaje de evento Ceniza",
  },
];

const portfolioSlides = [...portfolioCards];

const contactFaq = [
  {
    question: "¿Qué información necesito para cotizar un proyecto de iluminación?",
    answer:
      "Comparte la fecha, ciudad, locación, tipo de producción o evento, duración, número de personas y referencias visuales. Con esos datos podemos definir equipos, montaje, transporte y soporte técnico.",
  },
  {
    question: "¿Me ayudan a elegir las luces si no sé qué equipo necesito?",
    answer:
      "Sí. Revisamos el espacio, los encuadres, el estilo visual y el presupuesto para recomendar una solución funcional para fotografía, video, streaming, podcast o eventos.",
  },
  {
    question: "¿Puedo alquilar equipos por unidad o necesito elegir un combo?",
    answer:
      "Puedes alquilar luces y accesorios por unidad o elegir un combo listo para producir. La opción adecuada depende del montaje, la duración y el nivel de acompañamiento que necesites.",
  },
  {
    question: "¿Ceniza trabaja en Bogotá y otras ciudades de Colombia?",
    answer:
      "Nuestra operación principal está en Bogotá. También evaluamos proyectos en otras ciudades de Colombia según fechas, transporte, montaje y disponibilidad del equipo técnico.",
  },
];

function SiteHeader({ isSubPage, searchValue, setSearchValue, handleSearch }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 720 : false,
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleResize = () => {
      const nextIsMobile = window.innerWidth <= 720;
      setIsMobileLayout(nextIsMobile);

      if (!nextIsMobile) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className={`topbar ${isSubPage ? "topbar-subpage" : "topbar-home"}`}>
      {isMobileLayout && (
        <button
          className={`mobile-menu-button ${isMobileMenuOpen ? "is-open" : ""}`}
          type="button"
          aria-label={isMobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav-panel"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
      )}
      <a className="brand" href={isSubPage ? "/" : "#inicio"}>
        <img className="brand-word-image" src={cenizaLogo} alt="Ceniza" width="880" height="141" />
        <img className="brand-word-image brand-word-image-accent" src={cenizaLogo} alt="" width="880" height="141" aria-hidden="true" />
      </a>
      {!isMobileLayout && (
        <nav className="nav-pill" aria-label="Principal">
          <a href="/">Studio</a>
          <a href={CATALOG_PATH}>Catálogo</a>
          <a href={SERVICES_PATH}>Combos</a>
          <a href={PORTFOLIO_PATH}>Portafolio</a>
          <a href={CONTACT_PATH}>Contacto</a>
        </nav>
      )}
      {isMobileLayout && (
        <div
          className={`mobile-nav-panel ${isMobileMenuOpen ? "is-open" : ""}`}
          id="mobile-nav-panel"
        >
          <nav className="mobile-nav-links" aria-label="Principal móvil">
            <a href="/" onClick={() => setIsMobileMenuOpen(false)}>Studio</a>
            <a href={CATALOG_PATH} onClick={() => setIsMobileMenuOpen(false)}>Catálogo</a>
            <a href={SERVICES_PATH} onClick={() => setIsMobileMenuOpen(false)}>Combos</a>
            <a href={PORTFOLIO_PATH} onClick={() => setIsMobileMenuOpen(false)}>Portafolio</a>
            <a href={CONTACT_PATH} onClick={() => setIsMobileMenuOpen(false)}>Contacto</a>
          </nav>
        </div>
      )}
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="footer footer-minimal" id="contacto">
      <div className="footer-minimal-lead">
        <a className="footer-brand" href="/">
          <img className="footer-brand-image" src={cenizaLogo} alt="Ceniza" width="880" height="141" loading="lazy" decoding="async" />
          <img className="footer-brand-image footer-brand-image-accent" src={cenizaLogo} alt="" width="880" height="141" loading="lazy" decoding="async" aria-hidden="true" />
        </a>
        <p>Estudio de iluminación para fotografía, video y eventos.</p>
        <a
          className="footer-minimal-contact"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Hablar con Ceniza por WhatsApp"
        >
          WhatsApp ↗
        </a>
      </div>

      <div className="footer-minimal-meta">
        <p>© 2026 CENIZA · BOGOTÁ, COLOMBIA</p>
        <div className="footer-minimal-socials" aria-label="Redes sociales y correo">
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram ↗</a>
          <a href={`mailto:${CONTACT_EMAIL}`}>Correo ↗</a>
        </div>
        <div className="footer-minimal-legal">
          <a href={DATA_POLICY_PATH}>Privacidad</a>
          <a href={TERMS_PATH}>Términos</a>
        </div>
      </div>
    </footer>
  );
}

function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted") {
      const loadId = "requestIdleCallback" in window
        ? window.requestIdleCallback(loadAnalytics, { timeout: 2500 })
        : window.setTimeout(loadAnalytics, 1500);

      return () => {
        if ("cancelIdleCallback" in window) {
          window.cancelIdleCallback(loadId);
        } else {
          window.clearTimeout(loadId);
        }
      };
    }

    const timerId = window.setTimeout(() => setIsVisible(true), 500);
    return () => window.clearTimeout(timerId);
  }, []);

  const handleAccept = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
      loadAnalytics();
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside className="cookie-banner" role="dialog" aria-live="polite" aria-label="Aviso de cookies">
      <div className="cookie-banner-copy">
        <span>COOKIES</span>
        <strong>Preferencias de navegación</strong>
        <p>
          Usamos cookies para recordar tus preferencias y mejorar el sitio.
        </p>
      </div>
      <div className="cookie-banner-actions">
        <a className="cookie-button cookie-button-secondary" href={DATA_POLICY_PATH}>
          Ver política
        </a>
        <button className="cookie-button cookie-button-primary" type="button" onClick={handleAccept}>
          Aceptar
        </button>
      </div>
    </aside>
  );
}

function FloatingActions() {
  return null;
}

function CartPage() {
  const formatCop = (value) => `${new Intl.NumberFormat("es-CO").format(value)} COP`;

  const initialCartDraft = [
    {
      id: "combo-podcast",
      title: "Combo Podcast / Streaming",
      note: "Setup para entrevistas, reels y contenido digital.",
      unitPriceLabel: "700.000 COP",
      unitAmount: 700000,
      quantity: 1,
      units: "8 piezas incluidas",
      image: serviceCatalog[0].homeImage,
      href: `${SERVICES_PATH}/${serviceCatalog[0].slug}`,
    },
    {
      id: "combo-fotografia",
      title: "Combo Fotografía Profesional",
      note: "Luz controlada para producto, catálogo y campañas.",
      unitPriceLabel: "580.000 COP",
      unitAmount: 580000,
      quantity: 1,
      units: "7 piezas incluidas",
      image: serviceCatalog[1].homeImage,
      href: `${SERVICES_PATH}/${serviceCatalog[1].slug}`,
    },
    {
      id: "ulanzi-vl120",
      title: "Ulanzi VL120 RGB",
      note: "Luz de apoyo portátil para planos cortos y contenido móvil.",
      unitPriceLabel: "50.000 COP",
      unitAmount: 50000,
      quantity: 2,
      units: "Unitario",
      image: catalogBrowserItems.find((item) => item.order === 1)?.src,
      href: catalogBrowserItems.find((item) => item.order === 1)?.href ?? PRODUCTS_PATH,
    },
  ];

  const [cartDraft, setCartDraft] = useState(() => readStoredCartDraft(initialCartDraft));

  const removeCartItem = (itemId) => {
    setCartDraft((currentItems) => currentItems.filter((item) => item.id !== itemId));
  };

  const updateCartItemQuantity = (itemId, nextQuantity) => {
    setCartDraft((currentItems) =>
      currentItems.flatMap((item) => {
        if (item.id !== itemId) return [item];
        if (nextQuantity <= 0) return [];
        return [{ ...item, quantity: nextQuantity }];
      }),
    );
  };

  const subtotalAmount = cartDraft.reduce((sum, item) => sum + item.unitAmount * item.quantity, 0);
  const subtotalLabel = formatCop(subtotalAmount);

  const comboRecommendationItems = serviceCatalog.slice(0, 3).map((service, index) => ({
    id: `combo-${service.slug}`,
    slug: `combo-${service.slug}`,
    label: `Combo ${service.title}`,
    src: service.homeImage,
    href: `${SERVICES_PATH}/${service.slug}`,
    shortDescription: service.summary,
    accent:
      index === 0
        ? "Combo para contenido"
        : index === 1
          ? "Combo para producto"
          : "Combo para rodajes",
    priceLabel: service.price.replace("Precio base: ", ""),
    note: service.summary,
    units: "Combo",
    unitAmount: Number(service.price.replace(/[^\d]/g, "")),
  }));

  const productRecommendationItems = [
    catalogBrowserItems.find((item) => item.order === 2),
    catalogBrowserItems.find((item) => item.order === 5),
    catalogBrowserItems.find((item) => item.order === 22),
  ]
    .filter(Boolean)
    .map((item, index) => ({
      id: item.slug,
      ...item,
      accent:
        index === 0
          ? "Suma color al montaje"
          : index === 1
            ? "Ideal para producto"
            : "Refuerzo para eventos",
      priceLabel: item.pricing?.[0]?.value ?? "Cotizar",
      note: item.shortDescription,
      units: item.pricing?.[0]?.label ?? "Unitario",
      unitAmount: Number((item.pricing?.[0]?.value ?? "0").replace(/[^\d]/g, "")),
    }));

  const recommendationItems = [
    comboRecommendationItems[0],
    productRecommendationItems[0],
    comboRecommendationItems[1],
    productRecommendationItems[1],
    comboRecommendationItems[2],
    productRecommendationItems[2],
  ].filter(Boolean);

  const [recommendationQuantities, setRecommendationQuantities] = useState(() =>
    Object.fromEntries(recommendationItems.map((item) => [item.id, 1])),
  );
  const [serviceModality, setServiceModality] = useState("");
  const [cartSubmissionState, setCartSubmissionState] = useState({
    status: "idle",
    message: "",
  });

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartDraft));
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }, [cartDraft]);

  const changeRecommendationQuantity = (itemId, delta) => {
    setRecommendationQuantities((current) => ({
      ...current,
      [itemId]: Math.max(1, (current[itemId] ?? 1) + delta),
    }));
  };

  const addRecommendationToCart = (item) => {
    const quantityToAdd = recommendationQuantities[item.id] ?? 1;

    setCartDraft((currentItems) => {
      const existingItem = currentItems.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantityToAdd }
            : cartItem,
        );
      }

      return [
        ...currentItems,
        {
          id: item.id,
          title: item.label,
          note: item.note,
          unitPriceLabel: item.priceLabel,
          unitAmount: item.unitAmount,
          quantity: quantityToAdd,
          units: item.units,
          image: item.src,
          href: item.href,
        },
      ];
    });
  };

  const handleCartSubmit = async (event) => {
    event.preventDefault();

    if (!cartDraft.length) {
      setCartSubmissionState({
        status: "error",
        message: "Agrega al menos un equipo o combo antes de enviar la solicitud.",
      });
      return;
    }

    const form = event.currentTarget;
    const formValues = formDataToObject(new FormData(form));
    const submitter = event.nativeEvent?.submitter;
    const checkoutIntent = submitter?.value === "rent_now" ? "renta_inmediata" : "solicitud";

    if (!serviceModality) {
      setCartSubmissionState({
        status: "error",
        message: "Selecciona la modalidad del servicio antes de continuar.",
      });
      return;
    }

    if (checkoutIntent === "renta_inmediata" && !normalizeWebhookUrl(CART_PAYMENT_URL)) {
      setCartSubmissionState({
        status: "error",
        message: "Configura el link de pago para activar la opción de rentar.",
      });
      return;
    }

    const payload = {
      source: "cart-checkout",
      checkoutIntent,
      submittedAt: new Date().toISOString(),
      currency: "COP",
      subtotalAmount,
      subtotalLabel,
      summary: {
        totalItems: cartDraft.reduce((accumulator, item) => accumulator + item.quantity, 0),
        estimatedDelivery: "Según proyecto",
        estimatedTotalAmount: subtotalAmount,
        estimatedTotalLabel: subtotalLabel,
      },
      cartItems: cartDraft.map((item) => ({
        id: item.id,
        title: item.title,
        note: item.note,
        quantity: item.quantity,
        units: item.units,
        unitAmount: item.unitAmount,
        unitPriceLabel: item.unitPriceLabel,
        totalAmount: item.unitAmount * item.quantity,
        href: item.href,
      })),
      customer: {
        email: formValues.correo ?? "",
        socials: formValues.redes_sociales ?? "",
        authorizedDataTreatment: Boolean(formValues.autorizacion_correo),
        acceptedTerms: Boolean(formValues.autorizacion_terminos),
        firstName: formValues.nombre ?? "",
        lastName: formValues.apellido ?? "",
        company: formValues.empresa ?? "",
        phone: formValues.telefono ?? "",
      },
      delivery: {
        country: formValues.pais ?? "",
        city: formValues.ciudad ?? "",
        department: formValues.departamento ?? "",
        address: formValues.direccion ?? "",
        installationDate: formValues.fecha ?? "",
        projectDetails: formValues.proyecto ?? "",
        internalNote: formValues.nota_adicional ?? "",
        modality: formValues.modalidad ?? serviceModality,
      },
    };

    setCartSubmissionState({
      status: "loading",
      message: checkoutIntent === "renta_inmediata" ? "Preparando renta..." : "Enviando solicitud...",
    });

    try {
      await postWebhookSubmission(CART_WEBHOOK_URL, payload);
      setCartSubmissionState({
        status: "success",
        message:
          checkoutIntent === "renta_inmediata"
            ? "Solicitud registrada. Continúa con la renta y pronto te compartiremos el resumen de lo que compraste."
            : "Solicitud enviada. Pronto te compartiremos el resumen de lo que solicitaste.",
      });

      if (checkoutIntent === "renta_inmediata") {
        window.open(normalizeWebhookUrl(CART_PAYMENT_URL), "_blank", "noopener,noreferrer");
      } else {
        form.reset();
        setServiceModality("");
        setCartDraft([]);
      }
    } catch (error) {
      setCartSubmissionState({
        status: "error",
        message: error.message || "No pudimos enviar la solicitud.",
      });
    }
  };

  return (
    <div className="page-shell services-page-shell cart-page-shell">
      <SiteHeader isSubPage hideCartBulb searchValue="" setSearchValue={() => {}} handleSearch={() => {}} />

      <main className="cart-page-main">
        <section className="cart-page-hero">
          <div className="cart-page-hero-copy">
            <p className="eyebrow">CARRITO</p>
            <h1>
              Tu selección de <span>equipos</span> y combos, lista para cotizar.
            </h1>
            <p className="cart-page-lead">
              Organiza aquí los combos, equipos y datos del proyecto para convertir tu selección en una cotización clara, premium y lista para producción.
            </p>
          </div>
          <div className="cart-page-hero-card">
            <span>Checkout Ceniza</span>
            <strong>Renta de luces con lectura <em>técnica</em> y visual.</strong>
            <p>Este espacio reúne la información del montaje, la entrega y la selección para que el cliente envíe una solicitud completa y fácil de revisar.</p>
          </div>
        </section>

        <form className="cart-page-grid" onSubmit={handleCartSubmit}>
          <section className="cart-checkout-form">
            <div className="cart-form-block">
              <div className="cart-page-list-head">
                <p className="eyebrow">ENTREGA</p>
                <h2>Modalidad del <span>servicio</span></h2>
                <p>Selecciona si necesitas solo envío o envío con montaje para orientar tiempos, logística y alcance del servicio.</p>
              </div>
              <input type="hidden" name="modalidad" value={serviceModality} />
              <div className="cart-delivery-toggle" role="group" aria-label="Modalidad de entrega">
                <button
                  className={`cart-delivery-option ${serviceModality === "Envío" ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setServiceModality("Envío")}
                  aria-pressed={serviceModality === "Envío"}
                >
                  Envío
                </button>
                <button
                  className={`cart-delivery-option ${serviceModality === "Envío y montaje" ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setServiceModality("Envío y montaje")}
                  aria-pressed={serviceModality === "Envío y montaje"}
                >
                  Envío y montaje
                </button>
              </div>
            </div>

            <div className="cart-form-block">
              <div className="cart-page-list-head">
                <p className="eyebrow">CONTACTO</p>
                <h2>Información del <span>cliente</span></h2>
                <p>Déjanos los datos base para preparar la propuesta, coordinar el montaje y responder la solicitud de forma clara y rápida.</p>
              </div>
              <div className="cart-form-grid">
                <label className="cart-form-field cart-form-field-wide">
                  País / Región
                  <input type="text" name="pais" defaultValue="Colombia" required />
                </label>
                <label className="cart-form-field">
                  Nombre
                  <input type="text" name="nombre" autoComplete="given-name" placeholder="Nombre" required />
                </label>
                <label className="cart-form-field">
                  Apellido
                  <input type="text" name="apellido" autoComplete="family-name" placeholder="Apellido" required />
                </label>
                <label className="cart-form-field cart-form-field-wide">
                  Empresa / marca
                  <input type="text" name="empresa" placeholder="Marca, agencia o productora" required />
                </label>
                <label className="cart-form-field cart-form-field-wide">
                  Dirección
                  <input type="text" name="direccion" autoComplete="street-address" placeholder="Dirección del montaje o punto de entrega" required />
                </label>
                <label className="cart-form-field">
                  Ciudad
                  <input type="text" name="ciudad" defaultValue="Bogotá" required />
                </label>
                <label className="cart-form-field">
                  Departamento
                  <input type="text" name="departamento" defaultValue="Bogotá D.C." required />
                </label>
                <label className="cart-form-field">
                  Teléfono
                  <input type="tel" name="telefono" autoComplete="tel" placeholder="+57 320 362 4348" required />
                </label>
                <label className="cart-form-field">
                  Correo electrónico
                  <input type="email" name="correo" autoComplete="email" placeholder="correo@ejemplo.com" required />
                </label>
                <label className="cart-form-field">
                  Redes sociales
                  <input type="text" name="redes_sociales" placeholder="@instagram / web / portafolio" />
                </label>
                <label className="cart-form-field">
                  Fecha del montaje
                  <input type="text" name="fecha" placeholder="DD / MM / AAAA" required />
                </label>
                <label className="cart-form-field cart-form-field-wide">
                  Detalles del proyecto
                  <textarea
                    name="proyecto"
                    rows="5"
                    placeholder="Tipo de evento o producción, locación, horario, número de personas, rider y referencias visuales."
                    required
                  />
                </label>
                <label className="cart-form-checkbox cart-form-field-wide">
                  <input type="checkbox" name="autorizacion_correo" required />
                  <span>
                    Autorizo el{" "}
                    <a href={DATA_POLICY_PATH} target="_blank" rel="noreferrer">
                      tratamiento de datos
                    </a>{" "}
                    para responder esta solicitud y enviar seguimiento comercial.
                  </span>
                </label>
                <label className="cart-form-checkbox cart-form-field-wide">
                  <input type="checkbox" name="autorizacion_terminos" required />
                  <span>
                    Autorizo y acepto los{" "}
                    <a href={TERMS_PATH} target="_blank" rel="noreferrer">
                      términos y condiciones
                    </a>
                    .
                  </span>
                </label>
              </div>
            </div>
          </section>

          <aside className="cart-page-summary">
            <div className="cart-summary-block">
              <p className="eyebrow">SELECCIÓN</p>
              <h2>Resumen de <span>renta</span></h2>
              <p>Combos y equipos listos para cotizar, con lectura visual, cantidades y precio base estimado.</p>
              <div className="cart-draft-list">
                {cartDraft.map((item) => (
                  <article className="cart-draft-card" key={item.id}>
                    <button
                      className="cart-draft-remove"
                      type="button"
                      aria-label={`Quitar ${item.title} del carrito`}
                      onClick={() => removeCartItem(item.id)}
                    >
                      ×
                    </button>
                    <div className="cart-draft-card-media">
                      <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                    </div>
                    <div className="cart-draft-card-copy">
                      <div className="cart-draft-card-top">
                        <span className="cart-draft-qty">{item.quantity}</span>
                        <span className="cart-draft-units">{item.units}</span>
                      </div>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.note}</p>
                      </div>
                    </div>
                    <div className="cart-draft-card-meta">
                      <div className="cart-draft-price-stack">
                        <span className="cart-draft-price">{formatCop(item.unitAmount * item.quantity)}</span>
                        {item.quantity > 1 ? <small>{item.unitPriceLabel} c/u</small> : null}
                      </div>
                      <div className="cart-draft-meta-actions">
                        <div className="cart-draft-stepper" aria-label={`Cantidad de ${item.title}`}>
                          <button type="button" onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}>
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}>
                            +
                          </button>
                        </div>
                        <a href={item.href}>Ver detalle</a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="cart-summary-block cart-summary-totals">
              <label className="cart-discount-field">
                Código o nota adicional
                <div className="cart-discount-row">
                  <input type="text" name="nota_adicional" placeholder="Cupón, observación o referencia del rider" />
                  <button type="button">Aplicar</button>
                </div>
              </label>
              <div className="cart-total-row">
                <span>Subtotal</span>
                <strong>{subtotalLabel}</strong>
              </div>
              <div className="cart-total-row">
                <span>Entrega y montaje</span>
                <strong>Según proyecto</strong>
              </div>
              <div className="cart-total-row is-total">
                <span>Total estimado</span>
                <strong>{subtotalLabel}</strong>
              </div>
              <p className="cart-summary-note">El valor final puede ajustarse según locación, tiempos, operación y requerimientos técnicos.</p>
              <p className={`form-status-message is-${cartSubmissionState.status}`} aria-live="polite">
                {cartSubmissionState.message}
              </p>
              <div className="cart-summary-actions">
                <button className="button primary" type="submit" value="quote" disabled={cartSubmissionState.status === "loading"}>
                  {cartSubmissionState.status === "loading" ? "Enviando..." : "Enviar solicitud"}
                </button>
                <button className="button secondary cart-pay-now" type="submit" value="rent_now" disabled={cartSubmissionState.status === "loading"}>
                  {cartSubmissionState.status === "loading" ? "Preparando..." : "Rentar"}
                </button>
                <a className="button tertiary" href={CATALOG_PATH}>
                  Seguir explorando catálogo
                </a>
              </div>
            </div>
          </aside>
        </form>

        <section className="cart-upsell-section" aria-labelledby="cart-upsell-title">
          <div className="cart-upsell-shell">
            <div className="cart-upsell-head">
              <p className="eyebrow">RECOMENDADOS</p>
              <h2 id="cart-upsell-title">Añade más al <span>carrito</span></h2>
              <p>Una selección de equipos unitarios y complementos que suelen acompañar este tipo de montaje.</p>
            </div>

            <div className="cart-upsell-marquee" aria-label="Productos recomendados">
              <div className="cart-upsell-track">
                {recommendationItems.map((item) => (
                  <article className="cart-recommendation-card" key={item.slug}>
                    <div className="cart-recommendation-media">
                      <img src={item.src} alt={item.label} loading="lazy" decoding="async" />
                    </div>
                    <div className="cart-recommendation-copy">
                      <span>{item.accent}</span>
                      <strong>{item.label}</strong>
                      <p>{item.shortDescription}</p>
                      <div className="cart-recommendation-footer">
                        <div className="cart-recommendation-qty">
                          <button type="button" onClick={() => changeRecommendationQuantity(item.id, -1)}>
                            −
                          </button>
                          <span>{recommendationQuantities[item.id] ?? 1}</span>
                          <button type="button" onClick={() => changeRecommendationQuantity(item.id, 1)}>
                            +
                          </button>
                        </div>
                        <div className="cart-recommendation-actions">
                          <em>{item.priceLabel}</em>
                          <button type="button" onClick={() => addRecommendationToCart(item)}>
                            Agregar
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
                {recommendationItems.map((item) => (
                  <article className="cart-recommendation-card" key={`${item.slug}-loop`} aria-hidden="true">
                    <div className="cart-recommendation-media">
                      <img src={item.src} alt="" loading="lazy" decoding="async" />
                    </div>
                    <div className="cart-recommendation-copy">
                      <span>{item.accent}</span>
                      <strong>{item.label}</strong>
                      <p>{item.shortDescription}</p>
                      <div className="cart-recommendation-footer">
                        <div className="cart-recommendation-qty" aria-hidden="true">
                          <button type="button">−</button>
                          <span>{recommendationQuantities[item.id] ?? 1}</span>
                          <button type="button">+</button>
                        </div>
                        <div className="cart-recommendation-actions">
                          <em>{item.priceLabel}</em>
                          <button type="button">Agregar</button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <CookieBanner />
      <FloatingActions />
    </div>
  );
}

function FaqAccordionSection({
  items,
  title = "Dudas antes de cotizar.",
  titleLines,
  subtitle,
  showSideLights = false,
  compactTitle = false,
}) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  return (
    <section
      className={`faq-section ${showSideLights ? "faq-section-with-lights" : ""} ${compactTitle ? "faq-section-compact-title" : ""}`}
      id="faq"
      aria-labelledby="faq-title"
    >
      <img
        className="faq-accent-light"
        src={catalogAccentLight}
        alt=""
        loading="lazy"
        decoding="async"
        aria-hidden="true"
      />
      <img
        className="faq-accent-star"
        src={aboutLight}
        alt=""
        loading="lazy"
        decoding="async"
        aria-hidden="true"
      />
      <div className="faq-shell">
        <div className="faq-head">
          <a className="section-chip-link" href="#faq">
            <p className="eyebrow center">FAQ</p>
          </a>
          <div className="faq-title-wrap">
            {showSideLights ? (
              <img className="faq-title-light faq-title-light-left" src={portfolioLight} alt="" loading="lazy" decoding="async" aria-hidden="true" />
            ) : null}
            <div className="faq-title-row">
              <h2 id="faq-title">
                {titleLines?.length
                  ? titleLines.map((line) => (
                      <span className="faq-title-line" key={line}>
                        {line}
                      </span>
                    ))
                  : title}
              </h2>
            </div>
            {showSideLights ? (
              <img className="faq-title-light faq-title-light-right" src={portfolioLight} alt="" loading="lazy" decoding="async" aria-hidden="true" />
            ) : null}
          </div>
          <p className="section-subtitle faq-subtitle">{subtitle}</p>
        </div>
        <div className="faq-grid">
          {items.map((item, index) => (
            <article className={`faq-card ${openFaqIndex === index ? "is-open" : ""}`} key={item.question}>
              <button
                className="faq-trigger"
                type="button"
                aria-expanded={openFaqIndex === index}
                aria-controls={`faq-panel-${index}`}
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? -1 : index)}
              >
                <h3>{item.question}</h3>
                <span className="faq-icon" aria-hidden="true">
                  {openFaqIndex === index ? "−" : "+"}
                </span>
              </button>
              <div className="faq-panel" id={`faq-panel-${index}`} hidden={openFaqIndex !== index}>
                <p>{item.answer}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function InlineCtaSection({ eyebrow = "CTA", title, copy, highlights = [], primaryHref, primaryLabel, secondaryHref, secondaryLabel, variant = "default" }) {
  return (
    <section className={`contact-cta inline-cta-section inline-cta-${variant}`} aria-label={title}>
      <div className="contact-cta-shell inline-cta-shell">
        <p className="eyebrow center">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{copy}</p>
        {highlights.length ? (
          <div className="contact-cta-highlights" aria-label="Beneficios de cotización">
            {highlights.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        ) : null}
        <div className="contact-cta-actions">
          <a className="button primary" href={primaryHref} target="_blank" rel="noreferrer">
            {primaryLabel}
          </a>
          {secondaryHref && secondaryLabel ? (
            <a className="button secondary" href={secondaryHref}>
              {secondaryLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ServicesPage() {
  const [activeComboIndex, setActiveComboIndex] = useState(0);
  const activeCombo = servicesPageCards[activeComboIndex];
  const combosLayoutOption = "selector"; // Cambiar a "editorial" restaura la opción A.
  const activeComboWhatsAppUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(
    [
      `Hola, quiero cotizar el ${activeCombo.eyebrow} ${activeCombo.title}.`,
      "",
      "El combo incluye:",
      ...activeCombo.includes.map((item) => `- ${item}`),
      "",
      "¿Me comparten una cotización y los detalles para reservar?",
    ].join("\n"),
  )}`;

  useEffect(() => {
    if (!window.location.hash) return;

    const targetId = window.location.hash.replace("#", "");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      requestAnimationFrame(() => {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  return (
    <div className="page-shell services-page-shell combos-page-shell">
      <SiteHeader isSubPage searchValue="" setSearchValue={() => {}} handleSearch={() => {}} />

      <main className={`services-page-main ${combosLayoutOption === "editorial" ? "combos-editorial-main" : "combos-selector-main"}`}>
        {combosLayoutOption === "editorial" ? (
          <>
        <section className="combos-editorial-hero" aria-labelledby="combos-page-title">
          <div className="combos-editorial-hero-copy">
            <p className="eyebrow">COMBOS DE ILUMINACIÓN</p>
            <h1 id="combos-page-title">Combos para cada producción.</h1>
            <p>
              Setups completos para contenido, podcast, fotografía y producción audiovisual en Bogotá.
            </p>
            <div className="combos-editorial-links" aria-label="Acciones principales">
              <a href="#combos">Explorar montajes</a>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">Ayúdame a elegir</a>
            </div>
          </div>

          <figure className="combos-editorial-hero-visual">
            <img
              src={serviceOneImage}
              alt="Set de iluminación profesional preparado para una producción audiovisual"
              fetchPriority="high"
              decoding="async"
            />
            <figcaption>
              <span>Rider flexible</span>
              <strong>El montaje correcto, listo para producir.</strong>
            </figcaption>
          </figure>
        </section>

        <section className="combos-editorial-catalog" id="combos" aria-labelledby="combos-catalog-title">
          <header className="combos-editorial-heading">
            <div>
              <p className="eyebrow">SEIS FORMAS DE EMPEZAR</p>
              <h2 id="combos-catalog-title">Elige según lo que vas a crear.</h2>
            </div>
            <p>Cada combo puede ajustarse a la locación, la duración y el resultado visual que necesitas.</p>
          </header>

          <div className="combos-editorial-grid">
            {servicesPageCards.map((service, index) => {
              const isWideCard = index === 0 || index === servicesPageCards.length - 1;
              const cardImage = isWideCard && service.homeImage ? service.homeImage : service.image;

              return (
                <article
                  className={`combos-editorial-card ${isWideCard ? "is-wide" : ""}`}
                  id={service.slug}
                  key={service.title}
                >
                  <a href={`${SERVICES_PATH}/${service.slug}`} aria-label={`Ver ${service.title}`}>
                    <img src={cardImage} alt={`Montaje ${service.title} de Ceniza`} loading="lazy" decoding="async" />
                    <span className="combos-editorial-card-shade" aria-hidden="true" />
                    <span className="combos-editorial-card-index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="combos-editorial-card-copy">
                      <span className="combos-editorial-card-type">{service.eyebrow}</span>
                      <strong>{service.title}</strong>
                      <span className="combos-editorial-card-summary">{service.summary}</span>
                      <span className="combos-editorial-card-meta">
                        <span className="combos-editorial-card-link">Ver combo</span>
                      </span>
                    </span>
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        <section className="combos-editorial-cta" aria-labelledby="combos-cta-title">
          <p className="eyebrow">MONTAJE A MEDIDA</p>
          <h2 id="combos-cta-title">¿No sabes qué combo elegir?</h2>
          <p>Cuéntanos tu proyecto y diseñamos una propuesta según tu espacio, fecha y producción.</p>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">Hablar por WhatsApp</a>
        </section>
          </>
        ) : (
          <>
            <section className="combos-selector-showcase" aria-labelledby="combos-selector-title">
              <div className="combos-selector-stage">
                <figure className="combos-selector-visual" key={`visual-${activeCombo.slug}`}>
                  <img
                    src={activeCombo.image}
                    alt={`Montaje ${activeCombo.title} de Ceniza`}
                    fetchPriority="high"
                    decoding="async"
                  />
                  <span className="combos-selector-visual-shade" aria-hidden="true" />
                  <figcaption>
                    <span>COMBO {String(activeComboIndex + 1).padStart(2, "0")}</span>
                    <strong>Equipos incluidos en este combo.</strong>
                  </figcaption>
                </figure>

                <article className="combos-selector-copy" key={`copy-${activeCombo.slug}`}>
                  <p className="eyebrow">{activeCombo.eyebrow} · ILUMINACIÓN</p>
                  <h1 id="combos-selector-title">{activeCombo.title}</h1>
                  <p className="combos-selector-summary">{activeCombo.summary}</p>
                  <p className="combos-selector-ideal">{activeCombo.idealFor}</p>
                  <div className="combos-selector-includes">
                    <p>Qué incluye</p>
                    <ul>
                      {activeCombo.includes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="combos-selector-actions">
                    <a href={activeComboWhatsAppUrl} target="_blank" rel="noreferrer">Cotizar combo</a>
                  </div>
                </article>
              </div>

              <div className="combos-selector-tray" aria-label="Seleccionar otro combo">
                <div className="combos-selector-tray-heading">
                  <p>Selecciona tu producción</p>
                  <span>{String(activeComboIndex + 1).padStart(2, "0")} / {String(servicesPageCards.length).padStart(2, "0")}</span>
                </div>
                <div className="combos-selector-options">
                  {servicesPageCards.map((service, index) => (
                    <button
                      className={`combos-selector-option ${service.title.length > 24 ? "has-long-title" : ""} ${index === activeComboIndex ? "is-active" : ""}`}
                      type="button"
                      aria-pressed={index === activeComboIndex}
                      onClick={() => setActiveComboIndex(index)}
                      key={service.slug}
                    >
                      <span className="combos-selector-option-image">
                        <img src={service.image} alt="" loading="lazy" decoding="async" aria-hidden="true" />
                      </span>
                      <span className="combos-selector-option-copy">
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <strong>{service.title}</strong>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="combos-selector-cta" aria-labelledby="combos-selector-cta-title">
              <div>
                <h2 id="combos-selector-cta-title">¿No sabes cuál elegir?</h2>
              </div>
              <p>Cuéntanos tu producción y te recomendamos el combo de iluminación adecuado.</p>
              <a href={COMBO_QUOTE_WHATSAPP_URL} target="_blank" rel="noreferrer">Te ayudamos por WhatsApp ↗</a>
            </section>
          </>
        )}
      </main>

      <SiteFooter />
      <CookieBanner />
      <FloatingActions />
    </div>
  );
}

function EquipmentPage({ initialProduct = null }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos los productos");
  const [hoveredCatalogCardSlug, setHoveredCatalogCardSlug] = useState("");
  const [catalogCardImageIndexes, setCatalogCardImageIndexes] = useState({});
  const [selectedCatalogProduct, setSelectedCatalogProduct] = useState(initialProduct);
  const [selectedCatalogImageIndex, setSelectedCatalogImageIndex] = useState(0);
  const catalogSheetCloseRef = useRef(null);
  const [openSections, setOpenSections] = useState(() =>
    Object.fromEntries(catalogSidebarSections.map((section) => [section.title, true])),
  );

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleCatalogItems = catalogBrowserItems.filter((item) => {
    const categoryOverride = activeCategory ? catalogCategorySlugOverrides[activeCategory] : null;
    const matchesCategory =
      activeCategory && activeCategory !== "Todos los productos"
        ? categoryOverride
          ? categoryOverride.has(item.slug) || item.aliases?.some((alias) => categoryOverride.has(alias))
          : item.category === activeCategory
        : true;
    const matchesSearch = normalizedSearch
      ? `${item.label} ${item.alt} ${item.category} ${item.section}`.toLowerCase().includes(normalizedSearch)
      : true;

    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    if (!hoveredCatalogCardSlug) return undefined;

    const hoveredItem = visibleCatalogItems.find((item) => item.slug === hoveredCatalogCardSlug);
    if (!hoveredItem?.galleryImages || hoveredItem.galleryImages.length <= 1) return undefined;

    const intervalId = window.setInterval(() => {
      setCatalogCardImageIndexes((current) => ({
        ...current,
        [hoveredCatalogCardSlug]: ((current[hoveredCatalogCardSlug] ?? 0) + 1) % hoveredItem.galleryImages.length,
      }));
    }, 700);

    return () => window.clearInterval(intervalId);
  }, [hoveredCatalogCardSlug, visibleCatalogItems]);

  useEffect(() => {
    if (!hoveredCatalogCardSlug) {
      setCatalogCardImageIndexes({});
    }
  }, [hoveredCatalogCardSlug]);

  useEffect(() => {
    if (!initialProduct) return;
    setSelectedCatalogProduct(initialProduct);
    setSelectedCatalogImageIndex(0);
  }, [initialProduct]);

  useEffect(() => {
    if (!selectedCatalogProduct) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedCatalogProduct(null);
        if (window.location.pathname.startsWith(`${PRODUCTS_PATH}/`)) {
          window.history.replaceState({}, "", CATALOG_PATH);
        }
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    window.requestAnimationFrame(() => catalogSheetCloseRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedCatalogProduct]);

  const openCatalogSheet = (product) => {
    setHoveredCatalogCardSlug("");
    setSelectedCatalogImageIndex(0);
    setSelectedCatalogProduct(product);
  };

  const closeCatalogSheet = () => {
    setSelectedCatalogProduct(null);
    setSelectedCatalogImageIndex(0);

    if (window.location.pathname.startsWith(`${PRODUCTS_PATH}/`)) {
      window.history.replaceState({}, "", CATALOG_PATH);
    }
  };

  const selectedCatalogGallery = selectedCatalogProduct?.galleryImages?.length
    ? selectedCatalogProduct.galleryImages
    : selectedCatalogProduct
      ? [{ src: selectedCatalogProduct.src, alt: selectedCatalogProduct.alt }]
      : [];
  const selectedCatalogImage = selectedCatalogGallery[selectedCatalogImageIndex] ?? selectedCatalogGallery[0];
  const selectedCatalogContentWeight = selectedCatalogProduct
    ? Math.ceil(selectedCatalogProduct.label.length / 28)
      + Math.ceil(selectedCatalogProduct.description.length / 96)
      + selectedCatalogProduct.specs.reduce((total, item) => total + Math.max(1, Math.ceil(item.length / 46)), 0)
      + selectedCatalogProduct.includes.reduce((total, item) => total + Math.max(1, Math.ceil(item.length / 46)), 0)
      + selectedCatalogProduct.pricing.reduce((total, price) => total + Math.max(1, Math.ceil(price.label.length / 38)), 0)
    : 0;
  const selectedCatalogDensityClass = selectedCatalogContentWeight > 18
    ? "is-dense"
    : selectedCatalogContentWeight <= 12
      ? "is-roomy"
      : "is-balanced";

  return (
    <div className="page-shell services-page-shell catalog-page-shell">
      <SiteHeader isSubPage searchValue="" setSearchValue={() => {}} handleSearch={() => {}} />

      <main className="services-page-main">
        <section className="services-page-hero services-page-hero-inverse">
          <div className="services-page-hero-copy services-page-hero-copy-inverse mobile-hide-page-intro">
            <p className="eyebrow">CATÁLOGO</p>
            <h1>Equipos para cada producción.</h1>
            <p className="services-page-lead">
              Luces y accesorios profesionales para fotografía, video, streaming y eventos.
            </p>
            <div className="services-page-actions">
              <a className="button primary" href="#catalogo-disponible">
                Ver catálogo
              </a>
              <a className="button secondary" href={SERVICES_PATH}>
                Explorar combos
              </a>
            </div>
          </div>
          <div className="services-page-highlight">
            <div className="services-page-highlight-card catalog-hero-image-only">
              <img
                className="services-page-highlight-image"
                src={catalogOneImage}
                alt="Equipo profesional de iluminación disponible en el catálogo de Ceniza"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>
        </section>

        <section className="services-equipment-section services-equipment-page-section" id="catalogo-disponible">
          <div className="services-equipment-header">
            <p className="eyebrow">CATÁLOGO</p>
            <h2>Catálogo disponible.</h2>
            <p>
              Encuentra el equipo ideal o pídenos una recomendación.
            </p>
          </div>
          <div className="catalog-browser">
            <aside className="catalog-browser-sidebar" aria-label="Categorías del catálogo">
              <label className="catalog-browser-search">
                <span className="catalog-browser-search-icon" aria-hidden="true">⌕</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                  }}
                  placeholder="Buscar equipo"
                  aria-label="Buscar equipo"
                />
              </label>
              <div className="catalog-browser-nav">
                <div className="catalog-browser-group">
                  <button
                    className="catalog-browser-group-title is-open"
                    type="button"
                    aria-expanded="true"
                  >
                    <span>Principal</span>
                    <span aria-hidden="true">−</span>
                  </button>
                  <div className="catalog-browser-links">
                    <button
                      className={activeCategory === "Todos los productos" ? "is-active" : ""}
                      type="button"
                      onClick={() => {
                        setActiveCategory("Todos los productos");
                      }}
                    >
                      Todos los productos
                    </button>
                  </div>
                </div>
                {catalogSidebarSections.map((section) => (
                  <div className="catalog-browser-group" key={section.title}>
                    <button
                      className={`catalog-browser-group-title ${openSections[section.title] ? "is-open" : ""}`}
                      type="button"
                      aria-expanded={openSections[section.title]}
                      onClick={() => {
                        setOpenSections((current) => ({
                          ...current,
                          [section.title]: !current[section.title],
                        }));
                      }}
                    >
                      <span>{section.title}</span>
                      <span aria-hidden="true">{openSections[section.title] ? "−" : "+"}</span>
                    </button>
                    {openSections[section.title] ? (
                      <div className="catalog-browser-links">
                        {section.items.map((item) => (
                          <button
                            className={activeCategory === item ? "is-active" : ""}
                            type="button"
                            onClick={() => {
                              setActiveCategory(item);
                            }}
                            key={item}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </aside>

            <div className="catalog-browser-grid">
              {visibleCatalogItems.map((image, index) => {
                const activeImageIndex = catalogCardImageIndexes[image.slug] ?? 0;
                const activeCardImage = image.galleryImages?.[activeImageIndex] ?? image.galleryImages?.[0];
                const cardImageSrc = activeCardImage?.src ?? image.src;
                const cardImageAlt = activeCardImage?.alt ?? image.alt;

                return (
                <button
                  className={`catalog-browser-card catalog-browser-card-trigger ${index === 0 ? "catalog-browser-card-featured" : ""}`}
                  type="button"
                  key={image.slug}
                  onClick={() => openCatalogSheet(image)}
                  onMouseEnter={() => {
                    if ((image.galleryImages?.length ?? 0) > 1) {
                      setHoveredCatalogCardSlug(image.slug);
                    }
                  }}
                  onMouseLeave={() => {
                    setHoveredCatalogCardSlug((current) => (current === image.slug ? "" : current));
                  }}
                >
                  <div className="catalog-browser-card-media">
                    <img src={cardImageSrc} alt={cardImageAlt} loading="lazy" decoding="async" />
                  </div>
                  <div className="catalog-browser-card-copy">
                    <strong>{image.label}</strong>
                    <p>{image.category}</p>
                    <span>Ver información</span>
                  </div>
                </button>
              )})}
              {visibleCatalogItems.length === 0 ? (
                <div className="catalog-browser-empty">
                  <strong>No encontramos equipos con ese filtro.</strong>
                  <p>Prueba otra categoría o cambia la búsqueda para ver más referencias.</p>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <InlineCtaSection
          eyebrow="ALQUILER DE EQUIPOS DE ILUMINACIÓN"
          title="La luz correcta para tu producción."
          copy="Cuéntanos qué vas a producir, cuándo lo necesitas y qué resultado visual buscas. Te recomendamos luces y accesorios para fotografía, video, contenido o eventos y preparamos una cotización clara."
          highlights={[
            "Alquila solo los equipos que necesitas",
            "Recibe una recomendación para tu tipo de producción",
            "Confirma disponibilidad para la fecha de tu proyecto",
          ]}
          primaryHref={CATALOG_QUOTE_WHATSAPP_URL}
          primaryLabel="Cotizar equipos"
          variant="catalog"
        />

      </main>

      {selectedCatalogProduct ? (
        <div
          className="catalog-sheet-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeCatalogSheet();
          }}
        >
          <section
            className={`catalog-sheet ${selectedCatalogDensityClass} product-${selectedCatalogProduct.slug}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="catalog-sheet-title"
          >
            <header className="catalog-sheet-header">
              <p>FICHA DE EQUIPO</p>
              <button ref={catalogSheetCloseRef} type="button" onClick={closeCatalogSheet}>
                Cerrar
              </button>
            </header>

            <div className="catalog-sheet-layout">
              <div className="catalog-sheet-visual">
                <div className="catalog-sheet-image-frame">
                  {selectedCatalogGallery.length > 1 ? (
                    <button
                      className="catalog-sheet-image-arrow is-previous"
                      type="button"
                      onClick={() => {
                        setSelectedCatalogImageIndex((current) =>
                          (current - 1 + selectedCatalogGallery.length) % selectedCatalogGallery.length,
                        );
                      }}
                      aria-label={`Ver imagen anterior de ${selectedCatalogProduct.label}`}
                    >
                      <span aria-hidden="true">‹</span>
                    </button>
                  ) : null}
                  <img
                    src={selectedCatalogImage?.src ?? selectedCatalogProduct.src}
                    alt={selectedCatalogImage?.alt ?? selectedCatalogProduct.label}
                    decoding="async"
                  />
                  {selectedCatalogGallery.length > 1 ? (
                    <button
                      className="catalog-sheet-image-arrow is-next"
                      type="button"
                      onClick={() => {
                        setSelectedCatalogImageIndex((current) =>
                          (current + 1) % selectedCatalogGallery.length,
                        );
                      }}
                      aria-label={`Ver imagen siguiente de ${selectedCatalogProduct.label}`}
                    >
                      <span aria-hidden="true">›</span>
                    </button>
                  ) : null}
                </div>

                {selectedCatalogGallery.length > 1 ? (
                  <div className="catalog-sheet-gallery" aria-label={`Imágenes de ${selectedCatalogProduct.label}`}>
                    {selectedCatalogGallery.map((image, index) => (
                      <button
                        className={index === selectedCatalogImageIndex ? "is-active" : ""}
                        type="button"
                        key={`${selectedCatalogProduct.slug}-sheet-${image.src}`}
                        onClick={() => setSelectedCatalogImageIndex(index)}
                        aria-label={`Ver imagen ${index + 1} de ${selectedCatalogProduct.label}`}
                      >
                        <img src={image.src} alt="" loading="lazy" decoding="async" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="catalog-sheet-copy">
                <div className="catalog-sheet-intro">
                  <p className="catalog-sheet-eyebrow">PRODUCTO · {selectedCatalogProduct.category}</p>
                  <h2 id="catalog-sheet-title">
                    {selectedCatalogProduct.slug === "reflector-5-en-1-110-cm" ? (
                      <>
                        Reflector 5 en 1
                        <span className="catalog-sheet-title-measure">110 cm</span>
                      </>
                    ) : selectedCatalogProduct.label}
                  </h2>
                  <p className="catalog-sheet-description">{selectedCatalogProduct.description}</p>
                </div>

                <div className="catalog-sheet-details">
                  <div>
                    <h3>Especificaciones</h3>
                    <ul>
                      {selectedCatalogProduct.specs.map((item) => (
                        <li key={item}>{formatCatalogTechnicalText(item)}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3>Incluye</h3>
                    <ul>
                      {selectedCatalogProduct.includes.map((item) => (
                        <li key={item}>{formatCatalogTechnicalText(item)}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="catalog-sheet-pricing" aria-label={`Opciones de renta de ${selectedCatalogProduct.label}`}>
                  {selectedCatalogProduct.pricing.map((price) => (
                    <div className="catalog-sheet-price-row" key={`${selectedCatalogProduct.slug}-sheet-${price.label}`}>
                      <span>{formatCatalogTechnicalText(price.label)}</span>
                      <strong>{formatCatalogTechnicalText(price.value)}</strong>
                      <a
                        href={`${WHATSAPP_URL}?text=${encodeURIComponent(
                          `Hola, quiero cotizar ${selectedCatalogProduct.label} en la opción "${price.label}" por ${price.value}. ¿Me confirman disponibilidad?`,
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Cotizar
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}

      <SiteFooter />
      <CookieBanner />
      <FloatingActions />
    </div>
  );
}

function ProductDetailPage({ product }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const galleryImages = product.galleryImages?.length ? product.galleryImages : [{ src: product.src, alt: product.alt }];
  const activeGalleryImage = galleryImages[activeImageIndex] ?? galleryImages[0];

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product.slug]);

  return (
    <div className="page-shell services-page-shell product-page-shell">
      <SiteHeader isSubPage searchValue="" setSearchValue={() => {}} handleSearch={() => {}} />

      <main className="services-page-main product-page-main">
        <section className="product-detail-card">
          <div className="product-detail-copy">
            <p className="service-detail-eyebrow">PRODUCTO</p>
            <h1>{product.label}</h1>
            <p className="product-detail-description">{product.description}</p>

            <div className="product-detail-block">
              <strong>Especificaciones técnicas</strong>
              <ul className="product-detail-list">
                {product.specs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="product-detail-block">
              <strong>Incluye</strong>
              <ul className="product-detail-list">
                {product.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="product-price-table" aria-label={`Precios de ${product.label}`}>
              {product.pricing.map((price) => (
                <div className="product-price-row" key={`${product.slug}-${price.label}`}>
                  <span>{price.label}</span>
                  <div className="product-price-actions">
                    <strong>{price.value}</strong>
                    <a
                      className="product-price-rent"
                      href={`${WHATSAPP_URL}?text=${encodeURIComponent(
                        `Hola, quiero rentar ${product.label} en la opción "${price.label}" por ${price.value}. ¿Me confirman disponibilidad?`,
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Rentar
                    </a>
                  </div>
                </div>
              ))}
            </div>

          </div>

          <div className="product-detail-visual">
            <div className="product-detail-visual-frame">
              <img src={activeGalleryImage.src} alt={activeGalleryImage.alt ?? product.label} fetchPriority="high" decoding="async" />
            </div>
            {galleryImages.length > 1 ? (
              <div className="product-detail-gallery" aria-label={`Galería de ${product.label}`}>
                {galleryImages.map((image, index) => (
                  <button
                    className={`product-detail-thumb ${index === activeImageIndex ? "is-active" : ""}`}
                    type="button"
                    key={`${product.slug}-image-${image.src}`}
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`Ver imagen ${index + 1} de ${product.label}`}
                  >
                    <img src={image.src} alt="" loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <section className="equipment-banner equipment-banner-large product-equipment-banner" aria-label="Más productos Ceniza">
          <div className="equipment-banner-marquee">
            <div className="equipment-banner-track">
              {[...catalogBrowserItems, ...catalogBrowserItems].map((item, index) => (
                <a
                  className="equipment-banner-item"
                  href={item.href}
                  key={`${item.slug}-product-${index}`}
                  aria-label={`Ver ${item.label}`}
                >
                  <img src={item.src} alt={item.label} loading="lazy" decoding="async" />
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <CookieBanner />
      <FloatingActions />
    </div>
  );
}

function ViewportVideo({ src, poster }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const playVideo = () => {
      if (video.readyState === 0) video.load();

      const attemptPlayback = () => {
        video.play().catch(() => undefined);
      };

      if (video.readyState >= 2) {
        attemptPlayback();
      } else {
        video.addEventListener("loadeddata", attemptPlayback, { once: true });
      }
    };

    if (!("IntersectionObserver" in window)) {
      playVideo();
      return () => video.pause();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          playVideo();
        } else {
          video.pause();
        }
      },
      { rootMargin: "0px", threshold: 0.35 },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className="portfolio-showcase-video"
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-hidden="true"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

function PortfolioPage() {
  const portfolioShowcaseItems = [
    {
      type: "video",
      eyebrow: "VISUAL REEL",
      title: "Proyectos con atmósfera y precisión.",
      copy: "Lectura visual de montaje, escala y escena en formato corto.",
      src: portfolioVideo,
      poster: portfolioVideoPoster,
    },
    {
      type: "video",
      eyebrow: "STUDIO",
      title: "Composición para espacios.",
      copy: "Referencias visuales para atmósfera, profundidad y look final.",
      src: portfolioSpaceVideo,
      poster: portfolioSpaceVideoPoster,
    },
    {
      type: "video",
      eyebrow: "ESCENA",
      title: "Ritmo visual de producción.",
      copy: "Piezas para leer luz, contraste y continuidad de montaje.",
      src: atmosphereVideo,
      poster: atmosphereVideoPoster,
    },
    {
      type: "video",
      eyebrow: "VIDEO",
      title: "Ambiente con carácter.",
      copy: "Composición escénica y acentos de luz para propuestas de eventos.",
      src: characterVideo,
      poster: characterVideoPoster,
    },
  ];

  return (
    <div className="page-shell services-page-shell portfolio-page-shell">
      <SiteHeader isSubPage searchValue="" setSearchValue={() => {}} handleSearch={() => {}} />

      <main className="services-page-main portfolio-page-main">
        <section className="services-page-hero portfolio-page-hero">
          <div className="services-page-hero-copy mobile-hide-page-intro">
            <p className="eyebrow">PORTAFOLIO</p>
            <h1>Luz que transforma cada escena.</h1>
            <p className="services-page-lead">
              Dirección de iluminación para producciones, espacios y eventos.
            </p>
            <div className="services-page-actions">
              <a className="button primary" href={PORTFOLIO_QUOTE_WHATSAPP_URL} target="_blank" rel="noreferrer">
                Cotizar proyecto
              </a>
              <a className="button secondary" href={SERVICES_PATH}>
                Explorar combos
              </a>
            </div>
          </div>
          <div className="services-page-highlight portfolio-page-highlight">
            <div className="services-page-highlight-card portfolio-page-highlight-card">
              <img src={portfolioCasesImage} alt="Cases de producción Ceniza" fetchPriority="high" decoding="async" />
              <div className="services-page-highlight-overlay" />
            </div>
          </div>
        </section>

        <section className="portfolio-showcase" aria-label="Portafolio Ceniza">
          {portfolioShowcaseItems.map((item, index) => (
            <article className={`portfolio-showcase-card portfolio-showcase-square is-${item.type}`} key={`${item.eyebrow}-${index}`}>
              <div className="portfolio-showcase-media">
                {item.type === "video" ? (
                  <ViewportVideo src={item.src} poster={item.poster} />
                ) : (
                  <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
                )}
                <div className="portfolio-showcase-copy portfolio-showcase-copy-overlay">
                  <p className="service-detail-eyebrow">{item.eyebrow}</p>
                  <h2>{item.title}</h2>
                  <p>{item.copy}</p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <InlineCtaSection
          eyebrow="DIRECCIÓN DE ILUMINACIÓN"
          title="Hagamos visible tu idea."
          copy="Diseñamos iluminación para fotografía, video, contenido y eventos. Definimos contigo la atmósfera y el montaje adecuados para cada producción."
          primaryHref={PORTFOLIO_QUOTE_WHATSAPP_URL}
          primaryLabel="Cuéntanos tu proyecto ↗"
          variant="portfolio"
        />

      </main>

      <SiteFooter />
      <CookieBanner />
      <FloatingActions />
    </div>
  );
}

function ContactFaqSection() {
  return (
    <section className="contact-faq-section" aria-labelledby="contact-faq-title">
      <div className="contact-faq-intro">
        <p className="eyebrow">FAQ</p>
        <h2 id="contact-faq-title">Antes de cotizar.</h2>
      </div>

      <div className="contact-faq-list">
        {contactFaq.map((item, index) => (
          <details className="contact-faq-item" key={item.question}>
            <summary>
              <span className="contact-faq-number" aria-hidden="true">0{index + 1}</span>
              <h3>{item.question}</h3>
              <span className="contact-faq-toggle" aria-hidden="true">+</span>
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function ContactPage() {
  const [contactSubmissionState, setContactSubmissionState] = useState({
    status: "idle",
    message: "",
  });

  const handleContactSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formValues = formDataToObject(new FormData(form));
    const payload = {
      source: "ceniza-contact-form",
      submittedAt: new Date().toISOString(),
      firstName: formValues.nombre ?? "",
      lastName: formValues.apellido ?? "",
      email: formValues.correo ?? "",
      phone: formValues.telefono ?? "",
      address: formValues.direccion ?? "",
      projectDetails: formValues.proyecto ?? "",
      pageUrl: window.location.href,
    };

    setContactSubmissionState({
      status: "loading",
      message: "Enviando información...",
    });

    try {
      await postWebhookSubmission(CONTACT_WEBHOOK_URL, payload);
      setContactSubmissionState({
        status: "success",
        message: "Proyecto enviado. Te responderemos lo antes posible.",
      });
      form.reset();
    } catch (error) {
      setContactSubmissionState({
        status: "error",
        message: error.message || "No pudimos enviar la información.",
      });
    }
  };

  return (
    <div className="page-shell services-page-shell contact-page-shell">
      <SiteHeader isSubPage searchValue="" setSearchValue={() => {}} handleSearch={() => {}} />

      <main className="services-page-main contact-page-main">
        <section className="contact-hero">
          <div className="contact-copy">
            <p className="eyebrow">CONTACTO</p>
            <h1>
              Hablemos de tu <span>proyecto.</span>
            </h1>
            <p className="services-page-lead">
              Cuéntanos la fecha, locación y tipo de producción. Te proponemos el setup adecuado.
            </p>
            <div className="services-page-actions">
              <a className="button secondary contact-whatsapp-button" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                Hablar por WhatsApp ↗
              </a>
            </div>
          </div>

          <form
            className="contact-form"
            onSubmit={handleContactSubmit}
          >
            <div className="contact-form-grid">
              <label>
                Nombre
                <input name="nombre" type="text" autoComplete="given-name" required />
              </label>
              <label>
                Apellido
                <input name="apellido" type="text" autoComplete="family-name" required />
              </label>
              <label>
                Correo
                <input name="correo" type="email" autoComplete="email" required />
              </label>
              <label>
                Teléfono
                <input name="telefono" type="tel" autoComplete="tel" required />
              </label>
              <label className="contact-form-wide">
                Dirección
                <input name="direccion" type="text" autoComplete="street-address" />
              </label>
              <label className="contact-form-wide">
                Cuéntanos del proyecto
                <textarea
                  name="proyecto"
                  rows="6"
                  placeholder="Tipo de evento o producción, ciudad, fecha, locación, número de personas y referencias visuales."
                  required
                />
              </label>
            </div>
            <p className={`form-status-message is-${contactSubmissionState.status}`} aria-live="polite">
              {contactSubmissionState.message}
            </p>
            <button className="button primary contact-submit" type="submit" disabled={contactSubmissionState.status === "loading"}>
              {contactSubmissionState.status === "loading" ? "Enviando..." : "Enviar proyecto ↗"}
            </button>
          </form>
        </section>

        <ContactFaqSection />

      </main>

      <SiteFooter />
      <CookieBanner />
      <FloatingActions />
    </div>
  );
}

function LegalPage({ eyebrow, title, lead, sections, titleClassName = "" }) {
  const renderStyledText = (value) => {
    if (Array.isArray(value)) {
      return value.map((part, index) =>
        part.accent ? (
          <span className="legal-accent" key={`${part.text}-${index}`}>
            {part.text}
          </span>
        ) : (
          <span key={`${part.text}-${index}`}>{part.text}</span>
        ),
      );
    }

    return value;
  };

  return (
    <div className="page-shell services-page-shell legal-page-shell">
      <SiteHeader isSubPage searchValue="" setSearchValue={() => {}} handleSearch={() => {}} />

      <main className="services-page-main legal-page-main">
        <section className="legal-hero">
          <p className="eyebrow">{renderStyledText(eyebrow)}</p>
          <h1 className={titleClassName}>{renderStyledText(title)}</h1>
          <p className="services-page-lead legal-page-lead">{renderStyledText(lead)}</p>
        </section>

        <section className="legal-content">
          {sections.map((section, index) => (
            <article className="legal-card" key={section.title}>
              <span className="legal-section-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2>{section.title.replace(/^\d+\.\s*/, "")}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.items ? (
                <ul className="legal-list">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </section>
      </main>

      <SiteFooter />
      <CookieBanner />
      <FloatingActions />
    </div>
  );
}

function DataPolicyPage() {
  return (
    <LegalPage
      eyebrow={[{ text: "LEGAL", accent: true }]}
      title={[{ text: "Tratamiento de " }, { text: "datos", accent: true }]}
      lead={[
        { text: "Esta página resume cómo Ceniza recopila, usa y protege " },
        { text: "la información", accent: true },
        { text: " que una persona comparte al cotizar, contactar o navegar en el sitio." },
      ]}
      sections={[
        {
          title: "1. Responsable del tratamiento",
          paragraphs: [
            "Ceniza es responsable del tratamiento de los datos personales recolectados a través de formularios, WhatsApp, correo electrónico y navegación dentro del sitio web.",
            "La información de contacto principal para solicitudes relacionadas con datos personales es gerencia@cenizaproducciones.com.",
          ],
        },
        {
          title: "2. Datos que podemos recopilar",
          paragraphs: ["Podemos recopilar información necesaria para atender solicitudes comerciales, técnicas y logísticas."],
          items: [
            "Nombre, apellido y datos de contacto.",
            "Empresa, marca o productora.",
            "Ciudad, dirección, fecha de montaje y detalles del proyecto.",
            "Información relacionada con preferencias de navegación y solicitudes de contacto.",
          ],
        },
        {
          title: "3. Finalidades de uso",
          paragraphs: ["La información se utiliza únicamente para fines coherentes con la operación comercial y técnica de Ceniza."],
          items: [
            "Responder solicitudes de contacto, cotización o soporte.",
            "Preparar propuestas comerciales, riders y montajes.",
            "Hacer seguimiento a proyectos, disponibilidad y logística.",
            "Mejorar la experiencia de navegación y recordar preferencias dentro del sitio.",
          ],
        },
        {
          title: "4. Almacenamiento y protección",
          paragraphs: [
            "Ceniza adopta medidas razonables para proteger la información personal frente a pérdida, acceso no autorizado, uso indebido o divulgación no autorizada.",
            "Solo se conserva la información durante el tiempo necesario para atender la solicitud, mantener la relación comercial o cumplir obligaciones legales aplicables.",
          ],
        },
        {
          title: "5. Derechos del titular",
          paragraphs: [
            "La persona titular de los datos puede solicitar actualización, corrección o supresión de su información, así como revocar autorizaciones cuando sea aplicable.",
            "Para ello puede escribir a gerencia@cenizaproducciones.com indicando su solicitud y un medio de contacto para respuesta.",
          ],
        },
        {
          title: "6. Cookies y navegación",
          paragraphs: [
            "Este sitio puede usar cookies o almacenamiento local para recordar preferencias, mejorar la navegación y medir el funcionamiento básico de la experiencia digital.",
            "Al continuar navegando o aceptar el banner de cookies, el usuario autoriza este uso funcional dentro del sitio.",
          ],
        },
      ]}
    />
  );
}

function TermsPage() {
  return (
    <LegalPage
      eyebrow={[{ text: "LEGAL", accent: true }]}
      title={[{ text: "Términos y " }, { text: "condiciones", accent: true }]}
      titleClassName="legal-title-single-line"
      lead={[
        { text: "Estos términos describen " },
        { text: "condiciones generales", accent: true },
        { text: " de uso del sitio web de Ceniza y de las solicitudes de cotización, renta y servicios que se gestionan a través de la plataforma." },
      ]}
      sections={[
        {
          title: "1. Uso del sitio",
          paragraphs: [
            "El sitio de Ceniza tiene un propósito informativo y comercial. Su contenido presenta servicios, equipos, referencias visuales y mecanismos para solicitar cotización.",
            "El uso del sitio implica aceptar estas condiciones generales mientras no exista un acuerdo particular distinto por escrito para un proyecto específico.",
          ],
        },
        {
          title: "2. Cotizaciones y disponibilidad",
          paragraphs: [
            "Los precios, combos, equipos y referencias visuales publicados son orientativos y pueden cambiar según disponibilidad, fechas, alcance técnico, transporte, montaje y condiciones del proyecto.",
            "Enviar formularios de contacto o cotización no constituye una reserva automática ni una confirmación contractual.",
          ],
        },
        {
          title: "3. Alcance del servicio",
          paragraphs: [
            "Ceniza opera desde Bogotá y puede atender proyectos en Colombia según alcance técnico, disponibilidad operativa y viabilidad logística.",
            "Cada servicio se confirma de acuerdo con necesidades reales de montaje, rider, locación, horarios y requerimientos de producción.",
          ],
        },
        {
          title: "4. Material visual y catálogo",
          paragraphs: [
            "Las imágenes del catálogo, portafolio y combos se usan como referencia visual. En algunos casos muestran distintas tomas de un mismo producto o escenas ilustrativas de uso.",
            "La configuración final de equipos puede variar sin alterar la intención técnica o visual de la propuesta cotizada.",
          ],
        },
        {
          title: "5. Responsabilidades del usuario",
          paragraphs: ["Quien usa el sitio o solicita información se compromete a suministrar datos veraces y suficientes para elaborar una propuesta adecuada."],
          items: [
            "Compartir datos reales de contacto.",
            "Indicar correctamente fecha, ciudad, dirección y tipo de proyecto.",
            "Revisar la información enviada antes de solicitar cotización o contacto.",
          ],
        },
        {
          title: "6. Propiedad y contacto",
          paragraphs: [
            "Los textos, composiciones visuales, marcas y contenidos del sitio hacen parte de la identidad comercial de Ceniza y no deben reutilizarse sin autorización.",
            "Para dudas sobre estos términos o sobre una propuesta concreta, el canal oficial es gerencia@cenizaproducciones.com o WhatsApp +57 320 362 4348.",
          ],
        },
      ]}
    />
  );
}

function RotatingPortfolioBackground({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef([]);

  useEffect(() => {
    if (images[activeIndex]?.video) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % images.length);
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, images]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === activeIndex) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeIndex]);

  return (
    <div className="portfolio-bg-slideshow" aria-hidden="true">
      {images.map((image, index) => (
        image.video ? (
          <video
            className={`portfolio-bg-slide ${index === activeIndex ? "is-active" : ""}`}
            muted
            playsInline
            preload="auto"
            ref={(node) => {
              videoRefs.current[index] = node;
            }}
            onEnded={() => {
              setActiveIndex((currentIndex) => (currentIndex === index ? (currentIndex + 1) % images.length : currentIndex));
            }}
            key={image.alt}
          >
            <source src={image.video} type="video/mp4" />
          </video>
        ) : (
          <img
            className={`portfolio-bg-slide ${index === activeIndex ? "is-active" : ""}`}
            src={image.image}
            alt=""
            loading="lazy"
            decoding="async"
            key={image.alt}
          />
        )
      ))}
    </div>
  );
}

export default function App() {
  const [searchValue, setSearchValue] = useState("");
  const [catalogMosaicOffset, setCatalogMosaicOffset] = useState(0);
  const studioVideoRef = useRef(null);
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname.replace(/\/+$/, "") || "/" : "/";
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const isProductPage = currentPath.startsWith(`${PRODUCTS_PATH}/`);
  const currentProductSlug = isProductPage ? currentPath.slice(`${PRODUCTS_PATH}/`.length) : "";
  const activeProduct = isProductPage
    ? catalogBrowserItems.find((item) => item.slug === currentProductSlug || item.aliases?.includes(currentProductSlug))
    : null;
  const isServicesPage = currentPath === SERVICES_PATH;
  const isEquipmentPage = currentPath === CATALOG_PATH;
  const isPortfolioPage = currentPath === PORTFOLIO_PATH;
  const isContactPage = currentPath === CONTACT_PATH;
  const isCartPage = currentPath === CART_PATH;
  const isDataPolicyPage = currentPath === DATA_POLICY_PATH;
  const isTermsPage = currentPath === TERMS_PATH;
  const visibleCatalogMosaic = Array.from({ length: Math.min(5, catalogMosaicPool.length) }, (_, index) => {
    const item = catalogMosaicPool[(catalogMosaicOffset + index) % catalogMosaicPool.length];
    return {
      ...item,
      cta: "Ver ficha",
    };
  });

  useEffect(() => {
    if (currentPath !== "/") return undefined;

    const video = studioVideoRef.current;
    if (!video) return undefined;

    video.defaultMuted = true;
    video.muted = true;
    video.volume = 0.55;
    if (video.readyState === 0) video.load();
    video.play().catch(() => undefined);

    return () => {
      video.pause();
    };
  }, [currentPath]);

  useEffect(() => {
    if (currentPath !== "/" || catalogMosaicPool.length <= 1) return undefined;

    const intervalId = window.setInterval(() => {
      setCatalogMosaicOffset((current) => (current + 1) % catalogMosaicPool.length);
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, [currentPath]);

  useEffect(() => {
    const metaDescription = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    const schemaId = "ceniza-dynamic-schema";
    const canonicalHref = currentUrl || window.location.origin + currentPath;

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }

    if (canonicalHref) {
      canonicalLink.setAttribute("href", canonicalHref);
    }

    if (!ogUrl) {
      const ogUrlTag = document.createElement("meta");
      ogUrlTag.setAttribute("property", "og:url");
      document.head.appendChild(ogUrlTag);
    }

    const seoConfig = activeProduct
      ? {
          title: `${activeProduct.label} | Ceniza`,
          description: activeProduct.shortDescription,
          schema: {
            "@context": "https://schema.org",
            "@type": "Product",
            name: activeProduct.label,
            description: activeProduct.description,
            category: activeProduct.category,
            url: canonicalHref,
            offers: activeProduct.pricing.map((price) => ({
              "@type": "Offer",
              priceCurrency: "COP",
              description: `${price.label}: ${price.value}`,
            })),
          },
        }
      : isServicesPage
      ? {
          title: "Combos de Iluminación para Contenido y Producción | Ceniza",
          description:
            "Combos de iluminación para podcast, streaming, fotografía y producción audiovisual en Bogotá. Cotiza setups completos con Ceniza.",
          schema: {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "CollectionPage",
                name: "Servicios de iluminación Ceniza",
                url: canonicalHref,
                description:
                  "Página de combos de iluminación para fotografía, contenido y producción audiovisual.",
                about: serviceCatalog.map((item) => item.title),
              },
              {
                "@type": "ItemList",
                name: "Combos de iluminación Ceniza",
                itemListElement: serviceCatalog.map((item, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  item: {
                    "@type": "Service",
                    name: `${item.eyebrow} ${item.title}`,
                    description: `${item.description} ${item.idealFor}`,
                    areaServed: "Bogotá y Colombia",
                  },
                })),
              },
            ],
          },
        }
      : isEquipmentPage
        ? {
            title: "Catálogo de Equipos de Iluminación | Ceniza",
            description:
              "Catálogo de equipos de iluminación, luminarias y accesorios disponibles para renta en Bogotá y Colombia con Ceniza.",
            schema: {
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "CollectionPage",
                  name: "Catálogo de iluminación Ceniza",
                  url: canonicalHref,
                  description:
                    "Catálogo de equipos de iluminación y accesorios disponibles para alquiler y producción.",
                  about: equipmentBannerImages.map((item) => item.alt),
                },
                {
                  "@type": "ItemList",
                  name: "Equipos destacados Ceniza",
                  itemListElement: catalogSpotlight.map((item, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    item: {
                      "@type": "Product",
                      name: item.title,
                      description: item.summary,
                      category: "Iluminación y producción audiovisual",
                    },
                  })),
                },
              ],
            },
          }
        : isPortfolioPage
          ? {
              title: "Portafolio de Iluminación y Dirección Visual | Ceniza",
              description:
                "Portafolio de iluminación, video, imagen y dirección visual para eventos, montajes y producciones de Ceniza.",
              schema: {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                name: "Portafolio Ceniza",
                url: canonicalHref,
                description:
                  "Portafolio visual de montajes, atmósferas, video e imagen de proyectos de iluminación Ceniza.",
                about: ["Video de montaje", "Imagen de proyecto", "Dirección visual", "Iluminación premium"],
              },
            }
          : isContactPage
            ? {
                title: "Cotiza Iluminación y Alquiler de Luces en Bogotá | Ceniza",
                description:
                  "Cotiza alquiler de luces, dirección de iluminación y montaje técnico para fotografía, video, streaming y eventos en Bogotá con Ceniza.",
                schema: {
                  "@context": "https://schema.org",
                  "@graph": [
                    {
                      "@type": "ContactPage",
                      name: "Contacto y cotización Ceniza",
                      url: canonicalHref,
                      description:
                        "Formulario y canales de contacto para cotizar alquiler de luces, dirección de iluminación y producción audiovisual en Bogotá.",
                      about: {
                        "@type": "ProfessionalService",
                        name: "Ceniza",
                        areaServed: ["Bogotá", "Colombia"],
                        telephone: "+57 320 362 4348",
                      },
                    },
                    {
                      "@type": "FAQPage",
                      mainEntity: contactFaq.map((item) => ({
                        "@type": "Question",
                        name: item.question,
                        acceptedAnswer: {
                          "@type": "Answer",
                          text: item.answer,
                        },
                      })),
                    },
                  ],
                },
              }
              : isCartPage
                ? {
                    title: "Solicitud de Cotización | Ceniza",
                    description:
                      "Revisa los equipos y combos seleccionados para solicitar una cotización de iluminación con Ceniza.",
                    schema: {
                      "@context": "https://schema.org",
                      "@type": "WebPage",
                      name: "Solicitud de cotización Ceniza",
                      url: canonicalHref,
                      description:
                        "Página para revisar equipos y solicitar una cotización de iluminación Ceniza.",
                    },
                  }
              : isDataPolicyPage
                ? {
                    title: "Tratamiento de Datos | Ceniza",
                    description:
                      "Consulta la política general de tratamiento de datos personales y uso de cookies de Ceniza.",
                    schema: {
                      "@context": "https://schema.org",
                      "@type": "WebPage",
                      name: "Tratamiento de datos Ceniza",
                      url: canonicalHref,
                      description:
                        "Página legal con lineamientos de tratamiento de datos personales y cookies de Ceniza.",
                    },
                  }
              : isTermsPage
                ? {
                    title: "Términos y Condiciones | Ceniza",
                    description:
                      "Consulta las condiciones generales de uso del sitio, cotizaciones, catálogo y servicios de Ceniza.",
                    schema: {
                      "@context": "https://schema.org",
                      "@type": "WebPage",
                      name: "Términos y condiciones Ceniza",
                      url: canonicalHref,
                      description:
                        "Página legal con términos y condiciones generales del sitio web y servicios de Ceniza.",
                    },
                  }
          : {
            title: "Ceniza | Estudio de Iluminación en Bogotá",
            description:
              "Iluminación profesional, alquiler de luces y combos para podcasts, fotografía, video, contenido de marca y producción audiovisual en Bogotá.",
            schema: {
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "ProfessionalService",
                  name: "Ceniza",
                  url: canonicalHref,
                  description:
                    "Estudio de iluminación en Bogotá especializado en dirección visual, alquiler de luces, combos y montajes para contenido y producción audiovisual.",
                  serviceType: [
                    "Dirección de iluminación",
                    "Alquiler de luces y equipos",
                    "Combos de iluminación",
                    "Iluminación para fotografía, video, podcast y contenido de marca",
                  ],
                  areaServed: ["Bogotá", "Colombia"],
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Bogotá",
                    addressCountry: "CO",
                  },
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "sales",
                    email: CONTACT_EMAIL,
                    telephone: "+57 320 362 4348",
                    areaServed: "CO",
                    availableLanguage: ["es"],
                  },
                },
              ],
            },
          };

    document.title = seoConfig.title;
    if (metaDescription) metaDescription.setAttribute("content", seoConfig.description);
    if (ogTitle) ogTitle.setAttribute("content", seoConfig.title);
    if (ogDescription) ogDescription.setAttribute("content", seoConfig.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", canonicalHref);
    if (twitterTitle) twitterTitle.setAttribute("content", seoConfig.title);
    if (twitterDescription) twitterDescription.setAttribute("content", seoConfig.description);

    let schemaScript = document.getElementById(schemaId);
    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.type = "application/ld+json";
      schemaScript.id = schemaId;
      document.head.appendChild(schemaScript);
    }

    schemaScript.textContent = JSON.stringify(seoConfig.schema);
  }, [activeProduct, currentPath, currentUrl, isCartPage, isContactPage, isDataPolicyPage, isEquipmentPage, isPortfolioPage, isServicesPage, isTermsPage]);

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchValue.trim().toLowerCase();
    if (!query) return;

    const routes = [
      {
        id: "inicio",
        terms: ["home", "inicio", "hero", "ceniza", "estudio", "studio", "iluminacion"],
        href: "/",
      },
      {
        id: "about",
        terms: ["about", "project", "nosotros", "what we do", "luz", "atmosfera"],
      },
      {
        id: "servicios",
        terms: ["services", "servicios", "arquitectural", "interior", "design"],
        href: SERVICES_PATH,
      },
      {
        id: "equipos",
        terms: ["equipos", "equipment", "rider", "catalogo", "catálogo", "inventario", "catalog"],
        href: CATALOG_PATH,
      },
      {
        id: "portafolio",
        terms: ["project", "portfolio", "portafolio", "trabajos", "galeria"],
        href: PORTFOLIO_PATH,
      },
      {
        id: "contacto",
        terms: ["contact", "contacto", "cotizar", "whatsapp"],
        href: CONTACT_PATH,
      },
    ];

    const match =
      routes.find((route) =>
        route.terms.some((term) => term.includes(query) || query.includes(term))
      ) || routes[0];

    if (match.href) {
      window.location.href = match.href;
      return;
    }

    document.getElementById(match.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (isServicesPage) {
    return <ServicesPage />;
  }

  if (isEquipmentPage) {
    return <EquipmentPage />;
  }

  if (activeProduct) {
    return <EquipmentPage initialProduct={activeProduct} />;
  }

  if (isPortfolioPage) {
    return <PortfolioPage />;
  }

  if (isCartPage) {
    return <CartPage />;
  }

  if (isContactPage) {
    return <ContactPage />;
  }

  if (isDataPolicyPage) {
    return <DataPolicyPage />;
  }

  if (isTermsPage) {
    return <TermsPage />;
  }

  return (
    <div className="page-shell home-page-shell">
      <SiteHeader
        isSubPage={false}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        handleSearch={handleSearch}
      />

      <main>
        <section className="hero hero-campaign" id="inicio">
          <div className="hero-campaign-frame">
            <img
              className="hero-campaign-image hero-campaign-image-off"
              src={heroSoftboxOff}
              alt="Modificador parabólico Godox QR-P70 en una composición de estudio Ceniza"
              fetchPriority="high"
              decoding="async"
            />
            <span className="hero-light-trigger" aria-hidden="true" />
            <img
              className="hero-campaign-image hero-campaign-image-on"
              src={heroSoftboxOn}
              alt=""
              fetchPriority="high"
              decoding="async"
              aria-hidden="true"
            />
            <div className="hero-campaign-shade" aria-hidden="true" />

            <div className="hero-campaign-copy">
              <h1>
                <span>La luz</span>
                <strong>cambia todo.</strong>
              </h1>
              <p className="hero-campaign-lead">
                Atmósferas para fotografía, video y marcas.
              </p>
              <div className="hero-campaign-actions">
                <a className="hero-campaign-link" href={CATALOG_PATH}>
                  Crear una atmósfera <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="home-editorial" id="about" aria-labelledby="home-editorial-title">
          <div className="home-editorial-grid">
            <article className="home-story-card home-story-feature" aria-label="Ceniza en acción">
              <div className="home-story-feature-copy">
                <p>ESTUDIO · EQUIPO · PRODUCCIÓN</p>
                <h2 id="home-editorial-title">
                  La luz cuenta<br />
                  <span>historias.</span>
                </h2>
                <small>
                  Diseñamos iluminación profesional para podcasts, fotografía de marca, contenido para redes y
                  producciones audiovisuales. Combinamos dirección visual, técnica y equipos para crear atmósferas
                  con intención.
                </small>
              </div>
              <img
                className="home-story-video-backdrop"
                src={studioVideoPoster}
                alt=""
                aria-hidden="true"
              />
              <video
                ref={studioVideoRef}
                autoPlay
                loop
                muted
                controls
                playsInline
                preload="auto"
                poster={studioVideoPoster}
              >
                <source src={studioVideo} type="video/mp4" />
              </video>
            </article>

            <a
              className="home-story-card home-story-destination home-story-catalog"
              id="catalogo"
              href={CATALOG_PATH}
              aria-label="Abrir el catálogo de equipos"
            >
              <img src={catalogOneImage} alt="Equipo profesional de iluminación disponible en Ceniza" loading="lazy" decoding="async" />
              <span className="home-story-overlay" aria-hidden="true" />
              <span className="home-story-index">01 / CATÁLOGO</span>
              <span className="home-story-copy">
                <strong>La luz correcta para cada escena.</strong>
                <small>Ver catálogo ↗</small>
              </span>
            </a>

            <a
              className="home-story-card home-story-destination home-story-combos home-story-warm"
              id="servicios"
              href={SERVICES_PATH}
              aria-label="Explorar los combos de producción"
            >
              <img src={comboOneHomeImage} alt="Combo de producción de Ceniza" loading="lazy" decoding="async" />
              <span className="home-story-overlay" aria-hidden="true" />
              <span className="home-story-index">02 / COMBOS</span>
              <span className="home-story-copy">
                <strong>Setups listos para producir.</strong>
                <small>Elegir combo ↗</small>
              </span>
            </a>

            <a
              className="home-story-card home-story-destination home-story-portfolio"
              id="portafolio"
              href={PORTFOLIO_PATH}
              aria-label="Ver el portafolio de Ceniza"
            >
              <img src={portfolioCardImage} alt="Luz compacta Zhiyun Molus X60 presentada como producto" loading="lazy" decoding="async" />
              <span className="home-story-overlay" aria-hidden="true" />
              <span className="home-story-index">03 / PORTAFOLIO</span>
              <span className="home-story-copy">
                <strong>Atmósferas con intención.</strong>
                <small>Explorar proyectos ↗</small>
              </span>
            </a>

            <a
              className="home-story-card home-story-destination home-story-process"
              href={CONTACT_PATH}
              aria-label="Conocer el proceso y contactar a Ceniza"
            >
              <img src={processCardImage} alt="Equipo audiovisual preparado para iniciar una producción" loading="lazy" decoding="async" />
              <span className="home-story-overlay" aria-hidden="true" />
              <span className="home-story-index">04 / PROCESO</span>
              <div className="home-process-copy">
                <strong>De la idea a una escena resuelta.</strong>
                <ol>
                  <li><span>01</span> Cuéntanos el formato y la fecha</li>
                  <li><span>02</span> Diseñamos la luz y el equipo</li>
                  <li><span>03</span> Montamos la atmósfera</li>
                </ol>
                <small>Cotizar proyecto ↗</small>
              </div>
            </a>
          </div>
        </section>

        <section className="home-contact-minimal" aria-labelledby="home-contact-title">
          <p>ILUMINACIÓN PARA TU PRÓXIMA PRODUCCIÓN</p>
          <h2 id="home-contact-title">Cuéntanos qué vas a crear.</h2>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            Hablemos por WhatsApp <span aria-hidden="true">↗</span>
          </a>
        </section>

      </main>

      <SiteFooter />
      <CookieBanner />
      <FloatingActions />
    </div>
  );
}
