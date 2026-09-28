<p align="center"><img src="docs/ceniza-brand-header.svg" alt="CENIZA" width="460"></p>

<h1 align="center">CENIZA — Lighting & Production Studio</h1>
<p align="center"><strong>Visual portfolio · equipment rental · service discovery · secure lead capture</strong></p>
<p align="center"><a href="https://www.cenizaproducciones.com/"><strong>Live website</strong></a> · <a href="https://www.diegofrancoe.com/proyectos/ceniza"><strong>Case study</strong></a></p>

CENIZA is a responsive digital platform for a lighting studio and equipment-rental business. It brings the brand, services, equipment catalog, lighting packages, visual portfolio and commercial lead capture into one customer-facing experience while keeping private CRM operations separate.

| Project showcase | Service catalog | Lead capture | Optimized experience |
|---|---|---|---|
| Photography + video | Equipment + lighting combos | Secure forms + WhatsApp | Responsive media + SEO |

### Tech stack
![React](https://img.shields.io/badge/React-20232A?logo=react) ![Vite](https://img.shields.io/badge/Vite-20232A?logo=vite) ![Make](https://img.shields.io/badge/Make-20232A?logo=make) ![Cloudflare](https://img.shields.io/badge/Turnstile-20232A?logo=cloudflare) ![Vercel](https://img.shields.io/badge/Vercel-20232A?logo=vercel)

### Architecture
~~~mermaid
flowchart LR
 U[Visitor] --> W[React + Vite]
 W --> C[Catalog + services]
 W --> P[Visual portfolio]
 W --> F[Contact / quote]
 F --> API[Vercel Function]
 API --> T[Turnstile]
 T --> M[Make]
 M --> L[Lead + email follow-up]
 CRM[Private CRM] -. separate .-> W
~~~

<details><summary><strong>Run locally & repository structure</strong></summary>

~~~bash
npm install
cp .env.example .env.local
npm run dev
~~~

~~~text
src/        UI, catalog, services and portfolio
api/        Secure contact endpoint
server/     Turnstile verification
public/     Public discovery assets
docs/       Project notes
~~~
</details>

<p align="center"><strong>Production:</strong> https://www.cenizaproducciones.com/</p>
