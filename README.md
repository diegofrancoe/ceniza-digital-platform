# Ceniza Digital Platform

Plataforma web de Ceniza para presentar servicios de iluminación, consultar el catálogo de equipos y combos, explorar trabajos visuales y enviar solicitudes de contacto o renta.

## Objetivo

Centralizar la presencia digital de Ceniza en una aplicación web orientada a clientes. La experiencia reúne información comercial, catálogo, portafolio y formularios de solicitud sin incluir un backend propio ni almacenar credenciales en el repositorio.

## Funcionalidades implementadas

- Página principal con presentación de marca, servicios, catálogo y portafolio.
- Catálogo navegable de equipos con categorías, búsqueda, precios de referencia y páginas de detalle.
- Catálogo de combos de iluminación y páginas individuales por servicio.
- Carrito guardado localmente en el navegador para preparar una solicitud de renta o cotización.
- Formulario de carrito que envía la solicitud a un webhook de n8n configurado externamente.
- Formulario de contacto conectado a un segundo webhook de n8n.
- Apertura opcional de un enlace externo de pago después de registrar una solicitud de renta.
- Portafolio con imágenes y videos.
- Páginas de tratamiento de datos y términos y condiciones.
- Aviso de cookies, enlaces de contacto y metadatos SEO.
- Integración de medición web incluida en `index.html`.

El proyecto no procesa pagos directamente: solo puede abrir una URL externa configurada. Tampoco contiene un CRM. La conexión con un CRM, automatizaciones adicionales o persistencia de clientes debe considerarse una extensión demo o trabajo futuro.

## Stack

- React 19
- React DOM 19
- Vite 7
- JavaScript y JSX
- CSS
- Webhooks HTTP de n8n configurados mediante variables de entorno
- Configuración de rutas SPA compatible con Vercel

## Arquitectura

La aplicación es una SPA ejecutada completamente en el navegador:

- `src/main.jsx` monta la aplicación React.
- `src/App.jsx` contiene las vistas, navegación, catálogo, carrito y formularios.
- `src/styles.css` contiene los estilos globales y responsivos.
- `src/assets/` contiene imágenes y videos importados por Vite, incluidos catálogos cargados dinámicamente.
- `public/` contiene el icono público del sitio.
- `vercel.json` define el fallback de rutas hacia `index.html`.

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
| `VITE_N8N_CART_WEBHOOK_URL` | Recibe solicitudes del carrito y datos de cotización o renta. | Para enviar el carrito |
| `VITE_N8N_CONTACT_WEBHOOK_URL` | Recibe los formularios de contacto. | Para enviar contactos |
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

## Estado actual

La interfaz, navegación, catálogo, carrito, formularios e integración configurable con n8n están implementados. Para operar en un entorno real todavía se requiere configurar y asegurar los endpoints externos, validar el flujo de pago, revisar el contenido comercial y definir una estrategia de manejo de datos personales.

No se incluye CRM. Cualquier automatización de CRM, panel administrativo, autenticación, base de datos o gestión interna debe tratarse como una extensión demo o trabajo futuro hasta que exista código verificable para esas capacidades.
