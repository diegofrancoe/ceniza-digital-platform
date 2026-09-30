<p align="center"><a href="https://www.cenizaproducciones.com/"><img src="docs/readme-hero.svg" alt="CENIZA digital platform overview" width="100%"></a></p>

CENIZA is a responsive digital platform for a lighting and production studio. The website combines brand presentation, project storytelling, service discovery and commercial intake in a single customer-facing experience.

The technical goal was to keep the public website visually rich while maintaining a clear security boundary between visitors and the company's private operational systems. Contact and quote requests therefore move through a protected server-side path before reaching automation, while the CRM remains a separate application.

### Core stack
![React](https://img.shields.io/badge/React-252824?style=flat-square&logo=react&logoColor=74CDA7) ![Vite](https://img.shields.io/badge/Vite-252824?style=flat-square&logo=vite&logoColor=74CDA7) ![Make](https://img.shields.io/badge/Make-252824?style=flat-square&logo=make&logoColor=74CDA7) ![Cloudflare Turnstile](https://img.shields.io/badge/Cloudflare%20Turnstile-252824?style=flat-square&logo=cloudflare&logoColor=74CDA7) ![Vercel](https://img.shields.io/badge/Vercel-252824?style=flat-square&logo=vercel&logoColor=74CDA7)

### What this project demonstrates

- Responsive product and brand UI in React
- Portfolio-driven content architecture
- Equipment and service discovery
- Secure lead and quote intake
- Serverless boundary between the public site and automation
- Separation of public web traffic from private CRM data
- Static route generation for better discoverability and deployment behavior

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

The website acts as the public discovery and acquisition layer. Visitors can browse the studio's work, understand its services and submit commercial requests, but private operational data never needs to be exposed to the browser.

A serverless endpoint sits between the public form and the automation layer. Cloudflare Turnstile adds abuse protection before validated requests move into Make for internal follow-up.

### Technical highlights

**Frontend architecture.** React components organize the visual experience into reusable sections for projects, services and catalog content. Vite provides the development and production build pipeline.

**Public/private separation.** The website and CRM are intentionally separate systems. The public application captures intent; the private application manages operational records. This reduces coupling and creates a clearer security model.

**Serverless intake.** Contact and quote traffic is routed through a server-side function rather than connecting browser code directly to automation credentials.

**Deployment and discoverability.** The build process includes static route generation so project and service content can be exposed cleanly in production while preserving the React application experience.

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
scripts/    Static route generation
docs/       Project notes and architecture
~~~
</details>

<p align="center"><strong>Production:</strong> https://www.cenizaproducciones.com/</p>
