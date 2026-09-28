<p align="center"><img src="docs/ceniza-brand-header.svg" alt="CENIZA" width="100%"></p>

# CENIZA — Digital Platform

**Lighting studio · equipment rental · visual portfolio · commercial automation**

[Live website](https://www.cenizaproducciones.com/) · [Case study](https://www.diegofrancoe.com/proyectos/ceniza)

CENIZA is a responsive digital platform for a lighting studio and equipment-rental business. It brings the brand, services, equipment catalog, lighting packages, visual portfolio and commercial lead capture into one customer-facing experience, while keeping private CRM operations separate.

## Highlights

- Responsive website with strong visual direction and optimized media.
- Equipment and lighting-combo catalog with detail views.
- Portfolio built around photography and video.
- Rental and quote journeys through WhatsApp and contact forms.
- Secure contact intake with server validation and Cloudflare Turnstile.
- Vercel Function boundary that keeps Make credentials outside the browser.
- Make automation for lead registration and email follow-up.
- SEO, sitemap, consent-aware analytics and production deployment.

## Architecture

~~~mermaid
flowchart LR
 U[Visitor] --> W[React + Vite]
 W --> C[Catalog + services]
 W --> P[Visual portfolio]
 W --> F[Contact / quote]
 F --> API[Vercel Function]
 API --> T[Turnstile]
 T --> M[Make]
 M --> L[Lead registration]
 M --> E[Email follow-up]
 CRM[Private CENIZA CRM] -. separate system .-> W
~~~

## Stack

React 19 · Vite 7 · JavaScript / JSX · CSS · Vercel Functions · Cloudflare Turnstile · Make · Google Sheets · Vercel

## Run locally

~~~bash
npm install
cp .env.example .env.local
npm run dev
~~~

Server-only credentials are configured in the deployment environment and are not stored in the repository.

## Project structure

~~~text
src/        UI, catalog, services and portfolio
api/        Secure contact endpoint
server/     Turnstile verification
public/     Public discovery assets
docs/       Project notes and verification
~~~

**Production:** https://www.cenizaproducciones.com/

Built by **Diego Franco**.
