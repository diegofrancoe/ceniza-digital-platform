import { useEffect, useRef, useState } from "react";
import heroChairBlack from "./assets/chair-big.png";
import cenizaLogo from "./assets/ceniza-logo-cropped.png";
import aboutLight from "./assets/luz.png";
import catalogAccentLight from "./assets/lumina2.png";
import portfolioLight from "./assets/lumina1.png";
import servicesVideo from "./assets/video luces1.mp4";
import studioVideo from "./assets/video studio.mp4";
import portfolioVideo from "./assets/video.mp4";
import eventVideo from "./assets/video evento.mp4";
import portfolioImage from "./assets/estudio 2.png";
import studioImage from "./assets/estudio.png";
import eventTwoImage from "./assets/evento 2.png";
import eventThreeImage from "./assets/evento 3.png";
import eventFourImage from "./assets/evento 4.png";
import eventFiveImage from "./assets/evento 5 .png";
import eventSixImage from "./assets/evento 6.png";
import eventEightImage from "./assets/evento 8.png";
import serviceOneImage from "./assets/servicios 1.png";
import catalogOneImage from "./assets/catalogo 1.png";
import comboOneHomeImage from "./assets/combo 1.1.png";
import comboTwoHomeImage from "./assets/combo 2.2.png";
import comboThreeHomeImage from "./assets/combo 3.3.png";
import comboFourHomeImage from "./assets/combo 4.4.png";
import comboCreatorStartImage from "./assets/combo-creador-start.png";
import comboCreatorProImage from "./assets/combo-creador-pro.png";
import comboDetailOneImage from "./assets/combo-detail-1.png";
import comboDetailTwoImage from "./assets/combo-detail-2.png";
import comboDetailThreeImage from "./assets/combo-detail-3.png";
import comboDetailFourImage from "./assets/combo-detail-4.png";
import comboDetailFiveImage from "./assets/combo-detail-5.png";
import comboDetailSixImage from "./assets/combo-detail-6.png";
import landingCreatorProImage from "./assets/landing-creador-pro.png";
import landingProfessionalBrandImage from "./assets/landing-marca-profesional.png";
import landingPhotographyProfessionalImage from "./assets/landing-fotografia-profesional.png";

const equipmentBannerModules = import.meta.glob("./assets/*equiposceniza.png", {
  eager: true,
  import: "default",
});

const contactFrameModules = import.meta.glob("./assets/cuadro *.{png,jpg,jpeg,JPG,JPEG,PNG}", {
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
const FACEBOOK_URL = "https://facebook.com";
const CART_STORAGE_KEY = "ceniza-cart-draft";
const CART_UPDATED_EVENT = "ceniza-cart-updated";
const COOKIE_CONSENT_KEY = "ceniza-cookie-consent";
const CART_WEBHOOK_URL = import.meta.env.VITE_N8N_CART_WEBHOOK_URL ?? "";
const CONTACT_WEBHOOK_URL = import.meta.env.VITE_N8N_CONTACT_WEBHOOK_URL ?? "";
const CART_PAYMENT_URL = import.meta.env.VITE_CENIZA_PAYMENT_URL ?? "";

function formDataToObject(formData) {
  return Object.fromEntries(formData.entries());
}

function normalizeWebhookUrl(url) {
  return String(url ?? "").trim();
}

async function postWebhookSubmission(url, payload) {
  const normalizedUrl = normalizeWebhookUrl(url);

  if (!normalizedUrl) {
    throw new Error("Configura el webhook de n8n en las variables de entorno.");
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
    const match = path.match(/\/(\d*)equiposceniza\.png$/);
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

const contactFrameImages = Object.entries(contactFrameModules)
  .map(([path, src]) => {
    const match = path.match(/cuadro\s+(\d+)\.(png|jpg|jpeg)$/i);
    const number = match?.[1] ? Number(match[1]) : 0;

    return {
      src,
      alt: number ? `Cuadro visual Ceniza ${number}` : "Cuadro visual Ceniza",
      order: number,
    };
  })
  .sort((a, b) => a.order - b.order);

const contactFrameRows = [
  contactFrameImages.slice(0, Math.ceil(contactFrameImages.length / 2)),
  contactFrameImages.slice(Math.ceil(contactFrameImages.length / 2)),
];

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

  return {
    ...item,
    galleryImages: mergedGalleryImages,
    src: mergedGalleryImages[0]?.src ?? item.src,
    alt: mergedGalleryImages[0]?.alt ?? item.alt,
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

const homeFaq = [
  {
    question: "¿Ceniza alquila luces para video, fotografía y creación de contenido?",
    answer:
      "Sí. Puedes alquilar un combo listo para producción o cotizar luces y accesorios individuales según el formato, la locación y el resultado visual que necesitas.",
  },
  {
    question: "¿Qué tipo de proyectos atiende Ceniza?",
    answer:
      "Trabajamos en podcast, streaming, fotografía profesional, videos, reels, entrevistas y contenido para redes sociales con soporte visual y técnico.",
  },
  {
    question: "¿Me ayudan a elegir las luces adecuadas para mi producción?",
    answer:
      "Sí. Definimos una propuesta funcional según el número de personas, el encuadre, el estilo visual, el espacio disponible y el presupuesto.",
  },
  {
    question: "¿Puedo alquilar equipos para grabar reels o contenido de redes sociales?",
    answer:
      "Sí. Tenemos soluciones compactas para reels, contenido de marca, tutoriales, entrevistas y grabaciones verticales u horizontales.",
  },
  {
    question: "¿Puedo alquilar solo por un día o por pocas horas?",
    answer:
      "Sí. Podemos cotizar por jornada o según el tiempo real de grabación y montaje que necesite tu producción audiovisual.",
  },
  {
    question: "¿Cómo es la entrega y recogida de los equipos?",
    answer:
      "La entrega y recogida puede asumirla el cliente o incluirse en la cotización. El transporte depende de la ubicación, los horarios y el volumen del equipo solicitado.",
  },
  {
    question: "¿Ceniza también apoya la instalación para fotografía, video o podcast?",
    answer:
      "Sí. Además del alquiler, podemos acompañar la instalación y orientación técnica para que el setup de iluminación quede correctamente preparado.",
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
    <header className="topbar">
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
        <img className="brand-word-image" src={cenizaLogo} alt="Ceniza" />
        <img className="brand-word-image brand-word-image-accent" src={cenizaLogo} alt="" aria-hidden="true" />
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
      <a
        className="social-icon floating-instagram-link"
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram de Ceniza Producciones"
      >
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
          <path
            fill="currentColor"
            d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm0 2.2A1.8 1.8 0 0 0 5.2 7v10c0 1 .8 1.8 1.8 1.8h10c1 0 1.8-.8 1.8-1.8V7c0-1-.8-1.8-1.8-1.8H7Zm10.4 1.7a1 1 0 1 1 0 2.1 1 1 0 0 1 0-2.1ZM12 7.7A4.3 4.3 0 1 1 7.7 12 4.3 4.3 0 0 1 12 7.7Zm0 2.2A2.1 2.1 0 1 0 14.1 12 2.1 2.1 0 0 0 12 9.9Z"
          />
        </svg>
      </a>
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
    <footer className="footer" id="contacto">
      <div className="footer-brand-block">
        <a className="footer-brand" href="/">
          <img className="footer-brand-image" src={cenizaLogo} alt="Ceniza" />
          <img className="footer-brand-image footer-brand-image-accent" src={cenizaLogo} alt="" aria-hidden="true" />
        </a>
        <div className="footer-socials" aria-label="Redes sociales">
          <a className="footer-social-link" href={FACEBOOK_URL} target="_blank" rel="noreferrer" aria-label="Facebook">
            <svg viewBox="0 0 24 24" role="img">
              <path
                fill="currentColor"
                d="M13.5 21v-7h2.3l.4-2.7h-2.7V9.6c0-.8.2-1.3 1.4-1.3H16V5.9c-.5-.1-1.4-.1-2.2-.1-2.2 0-3.8 1.3-3.8 3.8v1.7H7.7V14H10v7h3.5Z"
              />
            </svg>
          </a>
          <a className="footer-social-link" href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" role="img">
              <path
                fill="currentColor"
                d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm0 2.2A1.8 1.8 0 0 0 5.2 7v10c0 1 .8 1.8 1.8 1.8h10c1 0 1.8-.8 1.8-1.8V7c0-1-.8-1.8-1.8-1.8H7Zm10.4 1.7a1 1 0 1 1 0 2.1 1 1 0 0 1 0-2.1ZM12 7.7A4.3 4.3 0 1 1 7.7 12 4.3 4.3 0 0 1 12 7.7Zm0 2.2A2.1 2.1 0 1 0 14.1 12 2.1 2.1 0 0 0 12 9.9Z"
              />
            </svg>
          </a>
        </div>
      </div>

      <div className="footer-column">
        <strong>Studio</strong>
        <a href="/">Studio</a>
        <a href={CATALOG_PATH}>Catálogo</a>
        <a href={SERVICES_PATH}>Combos</a>
        <a href={PORTFOLIO_PATH}>Portafolio</a>
      </div>

      <div className="footer-column">
        <strong>Combos</strong>
        <p>Podcast y streaming</p>
        <p>Fotografía de producto</p>
        <p>Producción audiovisual</p>
        <p>Montajes y eventos</p>
      </div>

      <div className="footer-column footer-column-contact">
        <strong>Contacto</strong>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp</a>
        <a href={CONTACT_PATH}>Enviar formulario</a>
        <p>Bogotá, Colombia</p>
      </div>
    </footer>
  );
}

function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted") return;

    const timerId = window.setTimeout(() => setIsVisible(true), 500);
    return () => window.clearTimeout(timerId);
  }, []);

  const handleAccept = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside className="cookie-banner" role="dialog" aria-live="polite" aria-label="Aviso de cookies">
      <div className="cookie-banner-copy">
        <span>COOKIES</span>
        <strong>Usamos cookies para mejorar tu experiencia en Ceniza.</strong>
        <p>
          Utilizamos cookies y almacenamiento local para recordar preferencias y optimizar la navegación.
          Al continuar, aceptas este uso.
        </p>
      </div>
      <div className="cookie-banner-actions">
        <a className="cookie-button cookie-button-secondary" href={DATA_POLICY_PATH}>
          Tratamiento de datos
        </a>
        <button className="cookie-button cookie-button-primary" type="button" onClick={handleAccept}>
          Aceptar
        </button>
      </div>
    </aside>
  );
}

function FloatingActions() {
  return (
    <a
      className="social-icon whatsapp-float"
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Escribir por WhatsApp"
    >
        <svg viewBox="0 0 24 24" role="img">
          <path
            fill="currentColor"
            d="M19.05 4.94A9.77 9.77 0 0 0 12.09 2C6.7 2 2.32 6.38 2.32 11.78c0 1.73.45 3.42 1.31 4.91L2.25 22l5.46-1.43a9.7 9.7 0 0 0 4.38 1.04h.01c5.39 0 9.78-4.38 9.78-9.78 0-2.61-1.02-5.06-2.83-6.89Zm-6.95 14.99h-.01a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.24.85.87-3.16-.2-.32a8.1 8.1 0 0 1-1.24-4.21c0-4.49 3.65-8.14 8.15-8.14 2.17 0 4.21.84 5.74 2.38a8.08 8.08 0 0 1 2.39 5.76c0 4.49-3.66 8.15-8.13 8.15Zm4.47-6.11c-.24-.12-1.4-.69-1.62-.77-.22-.08-.38-.12-.55.12-.16.24-.63.77-.78.93-.14.16-.29.18-.53.06-.24-.12-1-.37-1.91-1.18-.7-.62-1.17-1.39-1.31-1.62-.14-.24-.01-.36.1-.48.11-.11.24-.29.37-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.43-.06-.12-.55-1.33-.75-1.82-.2-.48-.4-.42-.55-.43h-.47c-.16 0-.43.06-.65.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.68 2.57 4.08 3.6.57.25 1.02.39 1.37.5.57.18 1.09.15 1.5.09.46-.07 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.11-.22-.17-.46-.29Z"
          />
        </svg>
    </a>
  );
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
                      <img src={item.image} alt={item.title} />
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
                      <img src={item.src} alt={item.label} />
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
                      <img src={item.src} alt="" />
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
        aria-hidden="true"
      />
      <img
        className="faq-accent-star"
        src={aboutLight}
        alt=""
        aria-hidden="true"
      />
      <div className="faq-shell">
        <div className="faq-head">
          <a className="section-chip-link" href="#faq">
            <p className="eyebrow center">FAQ</p>
          </a>
          <div className="faq-title-wrap">
            {showSideLights ? (
              <img className="faq-title-light faq-title-light-left" src={portfolioLight} alt="" aria-hidden="true" />
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
              <img className="faq-title-light faq-title-light-right" src={portfolioLight} alt="" aria-hidden="true" />
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

function InlineCtaSection({ eyebrow = "CTA", title, copy, highlights = [], primaryHref, primaryLabel, secondaryHref, secondaryLabel }) {
  return (
    <section className="contact-cta inline-cta-section" aria-label={title}>
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
          <a className="button secondary" href={secondaryHref}>
            {secondaryLabel}
          </a>
        </div>
      </div>
    </section>
  );
}

function ServicesPage() {
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
    <div className="page-shell services-page-shell">
      <SiteHeader isSubPage searchValue="" setSearchValue={() => {}} handleSearch={() => {}} />

      <main className="services-page-main">
        <section className="services-page-hero">
          <div className="services-page-hero-copy mobile-hide-page-intro">
            <p className="eyebrow">COMBOS</p>
            <h1>Combos de iluminación para contenido, fotografía y producción audiovisual.</h1>
            <p className="services-page-lead">
              Organizamos nuestros servicios por setup para que sea más fácil cotizar según el tipo de
              proyecto: creación de contenido, fotografía o producción audiovisual.
            </p>
            <div className="services-page-actions">
              <a className="button primary" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                Cotizar
              </a>
              <a className="button secondary" href={CATALOG_PATH}>
                Ver catálogo técnico
              </a>
            </div>
          </div>
          <div className="services-page-highlight">
            <div className="services-page-highlight-card">
              <img className="services-page-highlight-image" src={serviceOneImage} alt="" aria-hidden="true" />
              <div className="services-page-highlight-overlay" />
              <div className="services-page-highlight-copy">
                <span>Rider flexible</span>
                <strong>Combos listos para producción</strong>
                <p>Podemos escalar cada kit según número de personas, tipo de locación y look deseado.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="services-page-list">
          {servicesPageCards.map((service, index) => (
            <article
              className={`service-detail-card ${service.slug} ${index % 2 === 1 ? "is-reverse" : ""}`}
              id={service.slug}
              key={service.title}
            >
              <div className={`service-detail-visual ${service.image ? "" : "is-placeholder"}`}>
                {service.image ? (
                  <img src={service.image} alt={service.title} />
                ) : (
                  <div className="service-detail-placeholder">
                    <span className="service-detail-placeholder-chip">{service.eyebrow}</span>
                    <strong>{service.title}</strong>
                    <p>Imagen pendiente por cargar para la página de servicios.</p>
                  </div>
                )}
              </div>
              <div className="service-detail-copy">
                <p className="service-detail-eyebrow">{service.eyebrow}</p>
                <h2>
                  {service.slug === "combo-produccion-audiovisual-media" ? (
                    <>
                      Producción
                      <br />
                      Audiovisual Media
                    </>
                  ) : service.slug === "combo-produccion-audiovisual-completa" ? (
                    <>
                      Producción
                      <br />
                      Audiovisual Completa
                    </>
                  ) : (
                    service.title
                  )}
                </h2>
                <p className="service-detail-description">
                  {service.description}
                </p>
                <p className="service-detail-ideal">{service.idealFor}</p>
                <ul className="service-detail-list">
                  {service.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {service.price ? (
                  <div className="service-detail-price-actions">
                    <div className="service-detail-price-stack">
                      <p className="service-detail-price">
                        <span className="service-detail-price-label">Precio base:</span>{" "}
                        <span className="service-detail-price-value">
                          {service.price.replace("Precio base: ", "")}
                        </span>
                      </p>
                      <a
                        className="service-detail-rent"
                        href={`${WHATSAPP_URL}?text=${encodeURIComponent(
                          `Hola, quiero rentar el ${service.eyebrow} ${service.title}, con precio base de ${service.price.replace("Precio base: ", "")}. ¿Me confirman disponibilidad?`,
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Rentar
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </section>

        <section className="equipment-banner equipment-banner-large equipment-banner-internal-dark" aria-label="Catálogo Ceniza">
          <div className="equipment-banner-marquee">
            <div className="equipment-banner-track">
              {[...catalogBrowserItems, ...catalogBrowserItems].map((item, index) => (
                <a
                  className="equipment-banner-item"
                  href={item.href}
                  key={`${item.slug}-services-${index}`}
                  aria-label={`Ver ${item.label}`}
                >
                  <img src={item.src} alt={item.label} />
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

function EquipmentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos los productos");
  const [hoveredCatalogCardSlug, setHoveredCatalogCardSlug] = useState("");
  const [catalogCardImageIndexes, setCatalogCardImageIndexes] = useState({});
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

  return (
    <div className="page-shell services-page-shell catalog-page-shell">
      <SiteHeader isSubPage searchValue="" setSearchValue={() => {}} handleSearch={() => {}} />

      <main className="services-page-main">
        <section className="services-page-hero services-page-hero-inverse">
          <div className="services-page-hero-copy services-page-hero-copy-inverse mobile-hide-page-intro">
            <p className="eyebrow">CATÁLOGO</p>
            <h1>Catálogo visual para armar riders flexibles según cada producción.</h1>
            <p className="services-page-lead">
              Aquí reunimos las luminarias, accesorios y piezas de apoyo que usamos para construir
              setups de fotografía, video, streaming y montajes escénicos.
            </p>
            <div className="services-page-actions">
              <a className="button primary" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                Cotizar
              </a>
              <a className="button secondary" href={SERVICES_PATH}>
                Ver combos
              </a>
            </div>
          </div>
          <div className="services-page-highlight">
            <div className="services-page-highlight-card">
              <img className="services-page-highlight-image" src={catalogOneImage} alt="" aria-hidden="true" />
              <div className="services-page-highlight-overlay" />
              <div className="services-page-highlight-copy">
                <span>CATÁLOGO</span>
                <strong>Equipos listos para combinar.</strong>
                <p>Podemos alquilar piezas individuales o integrarlas dentro de un combo completo.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="services-equipment-section services-equipment-page-section">
          <div className="services-equipment-header">
            <p className="eyebrow">CATÁLOGO</p>
            <h2>Todo el catálogo disponible.</h2>
            <p>
              Si ya sabes qué necesitas, podemos cotizar por unidad. Si todavía estás definiendo el
              montaje, te ayudamos a convertir estas piezas en una solución funcional.
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
                <a
                  className={`catalog-browser-card ${index === 0 ? "catalog-browser-card-featured" : ""}`}
                  href={image.href}
                  key={image.slug}
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
                    <img src={cardImageSrc} alt={cardImageAlt} />
                  </div>
                  <div className="catalog-browser-card-copy">
                    <strong>{image.label}</strong>
                    <p>{image.category}</p>
                    <span>Ver información</span>
                  </div>
                </a>
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
          eyebrow="COTIZACIÓN"
          title="¿Ya sabes qué equipo necesitas?"
          copy="Cuéntanos qué referencias te interesan y armamos una cotización clara para tu montaje."
          highlights={["Por unidad o combo", "Con lectura técnica", "Según fecha y montaje"]}
          primaryHref={WHATSAPP_URL}
          primaryLabel="Pedir cotización"
          secondaryHref={SERVICES_PATH}
          secondaryLabel="Ver combos"
        />

      </main>

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
              <img src={activeGalleryImage.src} alt={activeGalleryImage.alt ?? product.label} />
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
                    <img src={image.src} alt="" />
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
                  <img src={item.src} alt={item.label} />
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

function PortfolioPage() {
  const portfolioShowcaseItems = [
    {
      type: "video",
      eyebrow: "VISUAL REEL",
      title: "Proyectos con atmosfera y precision.",
      copy: "Lectura visual de montaje, escala y escena en formato corto.",
      src: portfolioVideo,
    },
    {
      type: "image",
      eyebrow: "IMAGEN",
      title: "Composicion para espacios.",
      copy: "Referencias visuales para atmósfera, profundidad y look final.",
      src: portfolioImage,
      alt: "Montaje de iluminación Ceniza",
    },
    {
      type: "image",
      eyebrow: "ESCENA",
      title: "Ambientes con carácter.",
      copy: "Composición escénica y acentos de luz para propuestas premium.",
      src: studioImage,
      alt: "Proyecto de iluminación Ceniza",
    },
    {
      type: "video",
      eyebrow: "STUDIO",
      title: "Ritmo visual de produccion.",
      copy: "Piezas para leer luz, contraste y continuidad de montaje.",
      src: eventVideo,
    },
  ];

  return (
    <div className="page-shell services-page-shell portfolio-page-shell">
      <SiteHeader isSubPage searchValue="" setSearchValue={() => {}} handleSearch={() => {}} />

      <main className="services-page-main portfolio-page-main">
        <section className="services-page-hero portfolio-page-hero">
          <div className="services-page-hero-copy mobile-hide-page-intro">
            <p className="eyebrow">PORTAFOLIO</p>
            <h1>Atmósferas, montajes y dirección visual con lectura premium.</h1>
            <p className="services-page-lead">
              Reunimos video, imagen y criterio técnico para mostrar cómo la luz transforma espacios,
              producciones y experiencias con una intención visual clara.
            </p>
            <div className="services-page-actions">
              <a className="button primary" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                Cotizar proyecto
              </a>
              <a className="button secondary" href={SERVICES_PATH}>
                Ver combos
              </a>
            </div>
          </div>
          <div className="services-page-highlight portfolio-page-highlight">
            <div className="services-page-highlight-card portfolio-page-highlight-card">
              <img src={eventEightImage} alt="Proyecto de iluminación Ceniza" />
              <div className="services-page-highlight-overlay" />
              <div className="services-page-highlight-copy">
                <span>VISUAL REEL</span>
                <strong>Proyectos con atmósfera y precisión.</strong>
                <p>Una lectura rápida del lenguaje visual que buscamos en cada montaje.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="portfolio-showcase" aria-label="Portafolio Ceniza">
          {portfolioShowcaseItems.map((item, index) => (
            <article className={`portfolio-showcase-card portfolio-showcase-square is-${item.type}`} key={`${item.eyebrow}-${index}`}>
              <div className="portfolio-showcase-media">
                {item.type === "video" ? (
                  <video
                    key={`${item.eyebrow}-${index}`}
                    className="portfolio-showcase-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  >
                    <source src={item.src} type="video/mp4" />
                  </video>
                ) : (
                  <img src={item.src} alt={item.alt} />
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
          eyebrow="COTIZACIÓN"
          title="¿Quieres llevar esta idea a tu proyecto?"
          copy="Cuéntanos la locación y el tipo de montaje para armar una propuesta de iluminación clara, visual y funcional."
          highlights={["Propuesta visual y técnica", "Según locación y montaje", "Eventos, foto y video"]}
          primaryHref={WHATSAPP_URL}
          primaryLabel="Cotizar proyecto"
          secondaryHref={SERVICES_PATH}
          secondaryLabel="Ver combos"
        />

      </main>

      <SiteFooter />
      <CookieBanner />
      <FloatingActions />
    </div>
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
      source: "contact-form",
      submittedAt: new Date().toISOString(),
      contact: {
        firstName: formValues.nombre ?? "",
        lastName: formValues.apellido ?? "",
        email: formValues.correo ?? "",
        phone: formValues.telefono ?? "",
        address: formValues.direccion ?? "",
        projectDetails: formValues.proyecto ?? "",
      },
    };

    setContactSubmissionState({
      status: "loading",
      message: "Enviando información...",
    });

    try {
      await postWebhookSubmission(CONTACT_WEBHOOK_URL, payload);
      setContactSubmissionState({
        status: "success",
        message: "Proyecto enviado. Espere repuesta lo mas pronto posible.",
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
              Cuéntanos qué vas a <span>montar.</span>
            </h1>
            <p className="services-page-lead">
              Revisamos el tipo de proyecto, locación, fecha, escala y resultado visual para proponer un setup de luz claro, funcional y listo para producción.
            </p>
            <div className="services-page-actions">
              <a className="button secondary contact-whatsapp-button" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                Contactarnos por WhatsApp
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
              {contactSubmissionState.status === "loading" ? "Enviando..." : "Enviar información"}
            </button>
          </form>
        </section>

        <section className="contact-inspiration-section" aria-labelledby="contact-inspiration-title">
          <div className="contact-inspiration-head">
            <h2 id="contact-inspiration-title">
              Referencias <span>visuales</span>
            </h2>
            <p>
              Una selección de cuadros y <span>atmósferas</span> para leer el <span>lenguaje</span> visual de Ceniza.
            </p>
          </div>
          <div className="contact-inspiration-marquee" aria-label="Galería visual Ceniza">
            {contactFrameRows.map((row, rowIndex) => (
              <div className="contact-inspiration-row" key={`row-${rowIndex}`}>
                <div className="contact-inspiration-track">
                  {row.map((image) => (
                    <figure className="contact-inspiration-card" key={image.alt}>
                      <img src={image.src} alt={image.alt} />
                    </figure>
                  ))}
                  {row.map((image) => (
                    <figure className="contact-inspiration-card" key={`${image.alt}-loop`} aria-hidden="true">
                      <img src={image.src} alt="" />
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="contact-inspiration-closing">
            No iluminamos sets. Construimos <span>atmósferas.</span>
          </p>
        </section>
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
          {sections.map((section) => (
            <article className="legal-card" key={section.title}>
              <h2>{section.title}</h2>
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
            key={image.alt}
          />
        )
      ))}
    </div>
  );
}

function SeamlessServicesVideo({ src }) {
  const videoARef = useRef(null);
  const videoBRef = useRef(null);
  const activeRef = useRef("a");
  const transitionLockRef = useRef(false);
  const frameRef = useRef(0);
  const [activeVideo, setActiveVideo] = useState("a");

  useEffect(() => {
    const fadeLeadTime = 3.4;
    const fadeDuration = 2600;
    const loopStartTime = 0.12;

    const ensurePlayback = async (video) => {
      if (!video) return;

      try {
        await video.play();
      } catch {
        // Ignore autoplay interruptions; user interaction can resume playback.
      }
    };

    const waitForMediaEvent = (video, eventName) =>
      new Promise((resolve) => {
        const timeout = window.setTimeout(resolve, 600);
        video.addEventListener(
          eventName,
          () => {
            window.clearTimeout(timeout);
            resolve();
          },
          { once: true },
        );
      });

    const prepareNextVideo = async (video) => {
      if (!video) return;

      if (video.readyState === 0) {
        await waitForMediaEvent(video, "loadedmetadata");
      }

      if (Math.abs(video.currentTime - loopStartTime) > 0.05) {
        video.currentTime = loopStartTime;
        await waitForMediaEvent(video, "seeked");
      }

      if (video.readyState < 2) {
        await waitForMediaEvent(video, "canplay");
      }

      await ensurePlayback(video);
    };

    ensurePlayback(videoARef.current);

    const tick = () => {
      const currentVideo = activeRef.current === "a" ? videoARef.current : videoBRef.current;
      const nextVideo = activeRef.current === "a" ? videoBRef.current : videoARef.current;

      if (
        currentVideo &&
        nextVideo &&
        currentVideo.duration &&
        Number.isFinite(currentVideo.duration) &&
        !transitionLockRef.current &&
        currentVideo.duration - currentVideo.currentTime <= fadeLeadTime
      ) {
        transitionLockRef.current = true;
        prepareNextVideo(nextVideo).then(() => {
          const nextActive = activeRef.current === "a" ? "b" : "a";
          setActiveVideo(nextActive);

          window.setTimeout(() => {
            currentVideo.pause();
            currentVideo.currentTime = loopStartTime;
            activeRef.current = nextActive;
            transitionLockRef.current = false;
          }, fadeDuration);
        });
      }

      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      videoARef.current?.pause();
      videoBRef.current?.pause();
    };
  }, []);

  return (
    <div className="services-video-wrap" aria-hidden="true">
      <video
        ref={videoARef}
        className={`services-video ${activeVideo === "a" ? "is-active" : ""}`}
        autoPlay
        muted
        playsInline
        preload="auto"
        loop
      >
        <source src={src} type="video/mp4" />
      </video>
      <video
        ref={videoBRef}
        className={`services-video ${activeVideo === "b" ? "is-active" : ""}`}
        muted
        playsInline
        preload="auto"
        loop
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}

export default function App() {
  const [searchValue, setSearchValue] = useState("");
  const [catalogMosaicOffset, setCatalogMosaicOffset] = useState(0);
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
  const isContactPage = currentPath === CONTACT_PATH || currentPath === CART_PATH;
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
    if (catalogMosaicPool.length <= 1) return undefined;

    const intervalId = window.setInterval(() => {
      setCatalogMosaicOffset((current) => (current + 1) % catalogMosaicPool.length);
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (currentPath !== "/") return undefined;

    const heroCard = document.querySelector(".hero-card");
    const heroArt = document.querySelector(".hero-art");
    const heroImage = document.querySelector(".hero-combined-image");
    const heroActions = document.querySelector(".hero-actions");
    const contactNavLink = document.querySelector('.nav-pill a[href="/contacto"]');

    if (!heroCard || !heroArt || !heroImage || !heroActions || !contactNavLink) return undefined;

    const alignHeroArt = () => {
      if (window.innerWidth <= 720) {
        heroArt.style.removeProperty("--hero-aligned-top");
        return;
      }

      const cardRect = heroCard.getBoundingClientRect();
      const actionsRect = heroActions.getBoundingClientRect();
      const contactRect = contactNavLink.getBoundingClientRect();
      const top = contactRect.bottom - cardRect.top + 8;
      const minimumImageHeight = window.innerWidth <= 820 ? 220 : 320;
      const availableHeight = Math.max(
        minimumImageHeight,
        actionsRect.bottom - cardRect.top - top,
      );
      const imageRatio =
        heroImage.naturalWidth && heroImage.naturalHeight
          ? heroImage.naturalWidth / heroImage.naturalHeight
          : 2901 / 4198;
      const width = availableHeight * imageRatio;
      const contactCenter = contactRect.left + contactRect.width / 2;
      const horizontalNudge = window.innerWidth <= 820 ? 24 : 48;
      const right = Math.max(
        12,
        cardRect.right - contactCenter - width * 0.12 + horizontalNudge,
      );

      heroArt.style.setProperty("--hero-aligned-top", `${Math.round(top)}px`);
      heroArt.style.setProperty("--hero-aligned-width", `${Math.round(width)}px`);
      heroArt.style.setProperty("--hero-aligned-right", `${Math.round(right)}px`);
    };

    const resizeObserver = new ResizeObserver(alignHeroArt);
    resizeObserver.observe(heroCard);
    resizeObserver.observe(heroActions);
    resizeObserver.observe(heroImage);
    resizeObserver.observe(contactNavLink);
    heroImage.addEventListener("load", alignHeroArt);
    window.addEventListener("resize", alignHeroArt);
    alignHeroArt();

    return () => {
      resizeObserver.disconnect();
      heroImage.removeEventListener("load", alignHeroArt);
      window.removeEventListener("resize", alignHeroArt);
    };
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
                title: "Contacto para Cotizar Iluminación | Ceniza",
                description:
                  "Contacta a Ceniza para cotizar iluminación, renta de luces, dirección visual y montaje técnico para eventos y producciones.",
                schema: {
                  "@context": "https://schema.org",
                  "@type": "ContactPage",
                  name: "Contacto Ceniza",
                  url: canonicalHref,
                  description:
                    "Formulario y canales de contacto para cotizar proyectos de iluminación, eventos y producción audiovisual.",
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
              "Renta de luces, combos y dirección visual para eventos, fotografía, streaming y producción audiovisual en Bogotá y Colombia.",
            schema: {
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "ProfessionalService",
                  name: "Ceniza",
                  url: canonicalHref,
                  description:
                    "Estudio de iluminación especializado en renta de luces, dirección visual y montajes para eventos y producciones.",
                  areaServed: "Colombia",
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
                {
                  "@type": "FAQPage",
                  mainEntity: homeFaq.slice(0, 5).map((item) => ({
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
  }, [activeProduct, currentPath, currentUrl, isContactPage, isDataPolicyPage, isEquipmentPage, isPortfolioPage, isServicesPage, isTermsPage]);

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
    return <ProductDetailPage product={activeProduct} />;
  }

  if (isPortfolioPage) {
    return <PortfolioPage />;
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
    <div className="page-shell">
      <SiteHeader
        isSubPage={false}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        handleSearch={handleSearch}
      />

      <main>
        <section className="hero" id="inicio">
          <div className="hero-card">
            <div className="hero-copy">
              <h1>
                <span className="hero-title-light hero-title-solo">Estudio de iluminación</span>
              </h1>
              <div className="hero-divider" aria-hidden="true" />
              <p className="lead">
                Diseñamos atmósferas de luz para eventos, montajes y espacios
                que necesitan presencia visual, precisión técnica y carácter.
              </p>
              <div className="hero-actions">
                <a className="button primary" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                  Cotizar
                </a>
                <a className="button secondary" href={CATALOG_PATH}>
                  Ver catalogo
                </a>
              </div>
            </div>
            <div className="hero-art">
              <img className="hero-combined-image" src={heroChairBlack} alt="" />
            </div>
          </div>
        </section>

        <section className="trust-bar">
          <p>
            <span>TRUSTED BY MORE THAN</span>
            <strong className="trust-number">+1,000</strong>
            <span className="trust-clients">CLIENTS</span>
          </p>
        </section>

        <section className="about-grid" id="about">
          <article className="about-panel intro">
            <div className="intro-pill" aria-hidden="true" />
            <div className="intro-frame">
              <img className="intro-star" src={portfolioLight} alt="" aria-hidden="true" />
              <h2>Sobre Ceniza</h2>
              <p className="section-subtitle about-subtitle">
                Creamos soluciones visuales para eventos y montajes donde la luz
                no solo ilumina: define la atmósfera y la narrativa del espacio.
              </p>
              <h3>Nuestro enfoque</h3>
              <ul>
                <li>Iluminación para eventos, sets y montajes</li>
                <li>Dirección visual y atmósfera de escena</li>
                <li>Soluciones técnicas para producción audiovisual</li>
              </ul>
            </div>
          </article>
          <article className="about-panel about-video-panel" aria-label="Espacio para video de presentación">
            <div className="about-video-slot">
              <video className="about-video-media" autoPlay loop playsInline controls preload="auto">
                <source src={studioVideo} type="video/mp4" />
              </video>
              <span className="about-video-eyebrow">STUDIO REEL</span>
              <h3>Studio reel de Ceniza.</h3>
              <p>Un vistazo al lenguaje visual, montaje y atmósfera que construimos en cada producción.</p>
            </div>
          </article>
        </section>

        <section className="catalog-preview" id="catalogo">
          <div className="catalog-preview-shell">
            <div className="catalog-preview-head">
              <a className="catalog-preview-chip" href={CATALOG_PATH}>
                <p className="eyebrow center">CATÁLOGO</p>
              </a>
              <h2>Equipos de iluminación</h2>
              <p className="section-subtitle catalog-preview-lead">
                Una muestra de equipos disponibles para renta. Cada referencia puede integrarse en
                combo o cotizarse según tu montaje.
              </p>
            </div>
            <div className="catalog-preview-grid">
              {visibleCatalogMosaic.map((item, index) => (
                <a
                  className={`catalog-mosaic-card ${index === 0 ? "is-featured" : ""} catalog-card-${index + 1}`}
                  href={item.href}
                  key={item.alt}
                >
                  <div className="catalog-mosaic-visual">
                    <img src={item.src} alt={item.alt} />
                  </div>
                  <div className="catalog-mosaic-overlay" />
                  <div className="catalog-mosaic-copy">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span className="catalog-mosaic-cta">{item.cta}</span>
                  </div>
                </a>
              ))}
            </div>
            <div className="catalog-preview-actions">
              <a className="catalog-preview-button" href={CATALOG_PATH}>
                Ver catálogo completo
              </a>
            </div>
          </div>
        </section>

        <section className="services" id="servicios">
          <img className="services-accent services-accent-top" src={aboutLight} alt="" aria-hidden="true" />
          <img className="services-accent services-accent-bottom" src={aboutLight} alt="" aria-hidden="true" />
          <a className="section-chip-link" href={SERVICES_PATH}>
            <p className="eyebrow center">COMBOS</p>
          </a>
          <div className="services-heading">
            <h2>Combos para contenido, fotografía y producción</h2>
          </div>
          <p className="section-subtitle services-subtitle">
            Seis setups listos para resolver producciones de distinta escala con una lectura clara y profesional.
          </p>
          <div className="services-centered-grid">
            {homeServiceCards.map((service, index) => (
              <a
                className={`services-centered-card service-card-${index + 1} ${service.image ? "" : "is-placeholder"}`}
                href={`${SERVICES_PATH}#${service.slug}`}
                key={`${service.title}-${index}`}
              >
                <div className="services-centered-visual">
                  {service.image ? (
                    <img src={service.image} alt={`Combo ${service.title} de Ceniza`} />
                  ) : null}
                </div>
                <div className="services-centered-overlay" />
                <div className="services-centered-copy">
                  <h3>{service.title}</h3>
                  <p>{service.summary}</p>
                  <span className="services-centered-cta">VER {service.eyebrow}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="home-impact-statement" aria-label="Mensaje destacado Ceniza">
          <div className="home-impact-shell">
            <p className="home-impact-text">
              LIGHTING THAT <span>SHAPES</span> EVERY SCENE
            </p>
          </div>
        </section>

        <section className="portfolio portfolio-rotating" id="portafolio">
          <RotatingPortfolioBackground images={portfolioSlides} />
          <a className="section-chip-link" href={PORTFOLIO_PATH}>
            <p className="eyebrow center">PORTFOLIO</p>
          </a>
          <div className="portfolio-heading">
            <h2>Visión, craft y dirección técnica</h2>
          </div>
          <p className="section-subtitle portfolio-subtitle">
            Una muestra del criterio visual, la precisión técnica y la atmósfera que construimos en cada montaje.
          </p>
          <a className="portfolio-rotating-cta" href={PORTFOLIO_PATH}>
            Explorar proyectos completos
          </a>
        </section>

        <FaqAccordionSection
          items={homeFaq.slice(0, 6)}
          title="Dudas antes de cotizar."
          subtitle="Lo esencial para entender cómo trabajamos, cómo se cotiza y cómo elegir el setup correcto."
        />

      </main>

      <SiteFooter />
      <CookieBanner />
      <FloatingActions />
    </div>
  );
}
