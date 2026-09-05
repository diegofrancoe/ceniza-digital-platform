# Ceniza Digital Platform

Plataforma web de Ceniza para presentar servicios de iluminación, consultar el catálogo de equipos y combos, explorar trabajos visuales y enviar solicitudes de contacto o renta.

## Objetivo

Centralizar la presencia digital de Ceniza en una aplicación web orientada a clientes. La experiencia reúne información comercial, catálogo, portafolio y formularios de solicitud sin incluir un backend propio ni almacenar credenciales en el repositorio.

## Funcionalidades implementadas

- Página principal con presentación de marca, servicios, catálogo y portafolio.
- Catálogo navegable de equipos con categorías, búsqueda, precios de referencia y páginas de detalle.
- Catálogo de combos de iluminación y páginas individuales por servicio.
- Carrito guardado localmente en el navegador para preparar una solicitud de renta o cotización.
- Formulario de carrito preparado para enviar solicitudes a un webhook de Make configurado externamente.
- Formulario de contacto conectado a Make para registrar la solicitud en Google Sheets y enviar los correos de seguimiento.
- Apertura opcional de un enlace externo de pago después de registrar una solicitud de renta.
- Portafolio con imágenes y videos.
- Política de tratamiento de datos y términos y condiciones.
- Autorización obligatoria y sin selección previa en el formulario de contacto, con versión de política incluida en el envío.
- Aviso de cookies con opciones para aceptar, rechazar o configurar preferencias.
- Medición web cargada únicamente después de que el visitante autoriza las cookies de analítica.
- Imágenes optimizadas en WebP y carga diferida de contenido fuera de pantalla.
- Reproducción de videos del portafolio limitada al contenido visible, con portadas livianas para evitar cuadros vacíos durante la carga.
- Archivos públicos para buscadores: `robots.txt`, `sitemap.xml` y `llms.txt`.

El proyecto no procesa pagos directamente: solo puede abrir una URL externa configurada. Tampoco contiene un CRM. La conexión con un CRM, automatizaciones adicionales o persistencia de clientes debe considerarse una extensión demo o trabajo futuro.

## Stack

- React 19
- React DOM 19
- Vite 7
- JavaScript y JSX
- CSS
- Webhooks HTTP de Make configurados mediante variables de entorno
- Configuración de rutas SPA compatible con Vercel

## Arquitectura

La aplicación es una SPA ejecutada completamente en el navegador:

- `src/main.jsx` monta la aplicación React.
- `src/App.jsx` contiene las vistas, navegación, catálogo, carrito y formularios.
- `src/styles.css` contiene los estilos globales y responsivos.
- `src/assets/` contiene únicamente las imágenes y videos utilizados por la aplicación.
- `public/` contiene el icono y los archivos públicos de descubrimiento para buscadores.
- `vercel.json` define el fallback de rutas hacia `index.html` y la caché de recursos versionados.

El carrito usa `localStorage`. Las solicitudes se envían directamente desde el navegador a endpoints externos; este repositorio no incluye base de datos, API propia ni almacenamiento persistente de clientes.

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

| Variable | Uso | Obligatoria |
| --- | --- | --- |
| `VITE_MAKE_CART_WEBHOOK_URL` | Recibe solicitudes del carrito y datos de cotización o renta. | Para enviar el carrito |
| `VITE_MAKE_CONTACT_WEBHOOK_URL` | Recibe los formularios de contacto y activa el flujo de seguimiento. | Para enviar contactos |
| `VITE_CENIZA_PAYMENT_URL` | Enlace externo que se abre al continuar con una renta inmediata. | Solo para esa opción |

Todas las variables con prefijo `VITE_` se incorporan al código del navegador y son públicas. No deben contener tokens privados, secretos ni credenciales con privilegios. Si un webhook necesita autenticación secreta, debe protegerse mediante un backend o proxy seguro que no está implementado en este proyecto.

## Scripts

- `npm run dev`: inicia el servidor local de desarrollo.
- `npm run build`: genera la versión de producción en `dist/`.
- `npm run preview`: sirve localmente el build generado.

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

La interfaz, navegación, catálogo, carrito, formularios e integración configurable con Make están implementados. La versión publicada está preparada para Vercel y cuenta con optimización de recursos, diseño responsivo, caché, archivos básicos de descubrimiento, controles de cookies y autorización para el tratamiento de datos en el formulario de contacto. Para operar todos los formularios en un entorno real se deben mantener configurados y protegidos los endpoints externos, conservar la prueba de la autorización y validar el flujo de pago.

No se incluye CRM. Cualquier automatización de CRM, panel administrativo, autenticación, base de datos o gestión interna debe tratarse como una extensión demo o trabajo futuro hasta que exista código verificable para esas capacidades.
