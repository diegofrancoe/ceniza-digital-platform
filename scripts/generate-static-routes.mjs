import { copyFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDirectory = path.join(projectRoot, "dist");
const sourceIndex = path.join(distDirectory, "index.html");
const appSource = await readFile(path.join(projectRoot, "src", "App.jsx"), "utf8");

const productDetailsStart = appSource.indexOf("const catalogProductDetails = {");
const productDetailsEnd = appSource.indexOf("\n};", productDetailsStart);

if (productDetailsStart < 0 || productDetailsEnd < 0) {
  throw new Error("No se pudo encontrar el catálogo para generar sus rutas estáticas.");
}

const productDetailsSource = appSource.slice(productDetailsStart, productDetailsEnd);
const productSlugs = [...productDetailsSource.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
const routes = [
  "catalogo",
  "servicios",
  "portafolio",
  "contacto",
  "tratamiento-de-datos",
  "terminos-y-condiciones",
  ...productSlugs.map((slug) => `catalogo/productos/${slug}`),
];

for (const route of new Set(routes)) {
  const destination = path.join(distDirectory, `${route}.html`);
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(sourceIndex, destination);
}

console.log(`Generated ${new Set(routes).size} static routes with a custom 404 fallback.`);
