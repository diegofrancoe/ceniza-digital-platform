# Ceniza Digital Platform

Plataforma web de Ceniza para presentar servicios de iluminación, consultar el catálogo de equipos y combos, explorar trabajos visuales y convertir solicitudes de contacto en un flujo comercial automatizado.

[Sitio web](https://ceniza-web.vercel.app/) · [Caso de estudio](https://www.diegofrancoe.com/proyectos/ceniza)

## Objetivo

Centralizar la presencia digital de Ceniza en una aplicación web orientada a clientes. La experiencia reúne información comercial, catálogo, portafolio y formularios de solicitud, con una función serverless mínima que protege la automatización y mantiene secretos fuera del navegador.

## Funcionalidades implementadas

- Página principal con presentación de marca, servicios, catálogo y portafolio.
- Catálogo navegable de equipos con categorías, búsqueda, precios de referencia y páginas de detalle.
- Catálogo de combos de iluminación y páginas individuales por servicio.
- Formulario de contacto protegido con honeypot, tiempo mínimo, límites de tamaño, validación del servidor y Cloudflare Turnstile.
- Función serverless que entrega a Make únicamente solicitudes validadas; el webhook y su token nunca llegan al navegador.
- Automatización en Make para registrar la solicitud en Google Sheets y enviar los correos de seguimiento.
- Solicitudes de renta y cotización dirigidas a WhatsApp o al formulario de contacto.
- Portafolio con imágenes y videos.
- Política de tratamiento de datos y términos y condiciones.
- Autorización obligatoria y sin selección previa en el formulario de contacto, con versión de política incluida en el envío.
- Aviso de cookies con opciones para aceptar, rechazar o configurar preferencias.
- Medición web cargada únicamente después de que el visitante autoriza las cookies de analítica.
- Imágenes optimizadas en WebP y carga diferida de contenido fuera de pantalla.
- Reproducción de videos del portafolio limitada al contenido visible, con portadas livianas para evitar cuadros vacíos durante la carga.
- Archivos públicos para buscadores: `robots.txt`, `sitemap.xml` y `llms.txt`.

El proyecto no procesa pagos directamente ni incluye el CRM privado. Make coordina el correo y el registro operativo del lead; una futura conexión con el CRM debe conservar el mismo límite seguro y usar exclusivamente su interfaz de entrada autorizada.

## Stack

- React 19
- React DOM 19
- Vite 7
- JavaScript y JSX
- CSS
- Vercel Function como frontera segura del formulario
- Cloudflare Turnstile
- Make, Google Sheets y correo como servicios externos de automatización
- Configuración de rutas SPA compatible con Vercel

## Arquitectura

La interfaz es una SPA y el formulario cruza una frontera serverless:

- `src/main.jsx` monta la aplicación React.
- `src/App.jsx` contiene las vistas, navegación, catálogo y formularios.
- `src/styles.css` contiene los estilos globales y responsivos.
- `src/components/TurnstileWidget.jsx` integra la verificación anti-bot en el formulario.
- `api/contact.js` valida, limita y normaliza cada solicitud antes de enviarla a Make.
- `server/turnstile.js` verifica el token de Turnstile exclusivamente en el servidor.
- `src/assets/` contiene únicamente las imágenes y videos utilizados por la aplicación.
- `public/` contiene el icono y los archivos públicos de descubrimiento para buscadores.
- `vercel.json` configura las rutas públicas y la caché de recursos versionados.

El navegador solo llama a `/api/contact`. La función verifica método, tipo y tamaño del cuerpo, honeypot, tiempo mínimo, token Turnstile, consentimiento, campos y longitudes antes de construir un payload nuevo. La URL y el token opcional de Make son variables exclusivas del servidor.

## Requisitos

- Node.js 20.19 o superior, o Node.js 22.12 o superior
- npm 10 o superior

## Instalación y ejecución

```bash
npm install
cp .env.example .env.local
npm run dev
```

La dirección local se mostrará en la salida de Vite.

## Variables de entorno

| Variable | Entorno | Uso |
| --- | --- | --- |
| `VITE_TURNSTILE_SITE_KEY` | Navegador | Clave pública del widget Cloudflare Turnstile. |
| `TURNSTILE_SECRET_KEY` | Servidor | Verifica los tokens del formulario. |
| `TURNSTILE_EXPECTED_ACTION` | Servidor | Debe permanecer como `contact_form`. |
| `TURNSTILE_ALLOWED_HOSTNAMES` | Servidor | Lista de dominios autorizados por comas. |
| `MAKE_CONTACT_WEBHOOK_URL` | Servidor | Webhook privado que recibe solicitudes validadas. |
| `MAKE_CONTACT_WEBHOOK_TOKEN` | Servidor, opcional | Encabezado privado compartido con Make. |

Las variables `VITE_*` forman parte del bundle público. Las demás se configuran en Vercel y nunca deben copiarse al frontend ni versionarse con valores reales.

## Scripts

- `npm run dev`: inicia el servidor local de desarrollo.
- `npm run build`: genera la versión de producción en `dist/`.
- `npm run preview`: sirve localmente el build generado.
- `npm test`: valida los controles básicos de la función del formulario.

`npm run dev` valida la interfaz. Para probar también `/api/contact`, usa un entorno local de Vercel con las variables privadas configuradas y evita conectar pruebas a destinatarios reales.

## Build de producción

```bash
npm run build
```

El resultado se genera en `dist/`, carpeta excluida del control de versiones.

## Rendimiento

La versión actual prioriza una buena experiencia en computadores, tablets y celulares:

- Las imágenes fotográficas se sirven en WebP con dimensiones ajustadas a su uso real.
- Los recursos inferiores a la pantalla usan carga diferida.
- Los videos del portafolio no se descargan hasta que entran de forma suficiente en el área visible.
- Cada video del portafolio incluye una portada comprimida que se muestra antes de iniciar la descarga.
- Los recursos versionados de Vite reciben caché inmutable en Vercel.
- El video principal se descarga únicamente al acercarse a su sección y permanece fuera de la carga inicial en celulares.

Antes de publicar se debe ejecutar `npm run build` y comprobar las rutas `/`, `/catalogo`, `/servicios`, `/portafolio` y `/contacto` en anchos móvil, tablet y escritorio.

## Trazabilidad del rediseño

El [cierre de sesión del 2 de septiembre de 2026](docs/sesiones/2026-09-02.md) registra los cambios de diseño, las verificaciones y los pendientes para continuar en la rama `codex/redesign-integral-ceniza-2026-09-01`.

## Estado actual

La interfaz, navegación, catálogo, formulario y frontera segura para Make están implementados. La versión está preparada para Vercel y cuenta con optimización de recursos, diseño responsivo, caché, archivos de descubrimiento, controles de cookies, consentimiento y protección anti-bot.

Antes de activar el formulario en producción se deben configurar las variables de Turnstile y Make, añadir un límite durable en la capa de plataforma, comprobar que Make registra el lead y verificar los dos correos con datos sintéticos. El CRM, su autenticación y la base de datos permanecen en un repositorio privado independiente.
