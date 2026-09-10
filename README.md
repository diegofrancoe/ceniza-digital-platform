# Ceniza Digital Platform

Plataforma web de Ceniza para presentar servicios de iluminación, consultar el catálogo de equipos y combos, explorar trabajos visuales y enviar solicitudes de contacto.

## Objetivo

Centralizar la presencia digital de Ceniza en una aplicación web orientada a clientes. La experiencia reúne información comercial, catálogo, portafolio y formularios de solicitud sin incluir un backend propio ni almacenar credenciales en el repositorio.

## Funcionalidades implementadas

- Página principal con presentación de marca, servicios, catálogo y portafolio.
- Catálogo navegable de equipos con categorías, búsqueda, precios de referencia y páginas de detalle.
- Catálogo de combos de iluminación y páginas individuales por servicio.
- Formulario de contacto conectado directamente con la bandeja segura del CRM mediante una función de servidor.
- Portafolio con imágenes y videos.
- Páginas de tratamiento de datos y términos y condiciones.
- Aviso de cookies, enlaces de contacto y metadatos SEO.
- Medición web cargada únicamente después de que el visitante acepta el aviso de cookies.
- Imágenes optimizadas en WebP y carga diferida de contenido fuera de pantalla.
- Reproducción de videos del portafolio limitada al contenido visible, con portadas livianas para evitar cuadros vacíos durante la carga.
- Archivos públicos para buscadores: `robots.txt`, `sitemap.xml` y `llms.txt`.

La operación comercial permanece en el CRM independiente; este sitio únicamente entrega solicitudes de contacto validadas a su bandeja segura.

## Stack

- React 19
- React DOM 19
- Vite 7
- JavaScript y JSX
- CSS
- Integración directa con la función segura de entrada del CRM
- Configuración de rutas SPA compatible con Vercel

## Arquitectura

La aplicación es una SPA ejecutada completamente en el navegador:

- `src/main.jsx` monta la aplicación React.
- `src/App.jsx` contiene las vistas, navegación, catálogo y formulario de contacto.
- `src/styles.css` contiene los estilos globales y responsivos.
- `src/assets/` contiene únicamente las imágenes y videos utilizados por la aplicación.
- `public/` contiene el icono y los archivos públicos de descubrimiento para buscadores.
- `vercel.json` define el fallback de rutas hacia `index.html` y la caché de recursos versionados.

Las solicitudes se envían directamente a la función segura del CRM; el navegador nunca recibe una llave privada ni escribe directamente en las tablas internas.

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
| `VITE_CRM_INTAKE_URL` | Función pública y validada que entrega solicitudes a la bandeja del CRM. | Para conectar el CRM |

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

## Estado actual

La interfaz, navegación, catálogo y formulario de contacto están implementados. La versión publicada está preparada para Vercel y cuenta con optimización de recursos, diseño responsivo, caché y archivos básicos de descubrimiento. Para operar el formulario en un entorno real se debe mantener configurada la función segura del CRM y aplicar la política de tratamiento de datos personales.

El CRM, su autenticación y la base de datos viven en el repositorio `ceniza.crm`. Para activar la conexión publicada todavía se deben desplegar la migración y la función `website-lead`, configurar `VITE_CRM_INTAKE_URL` y verificar un envío real de extremo a extremo.
