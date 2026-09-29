<p align="center"><a href="https://www.cenizaproducciones.com/"><img src="docs/readme-hero.svg" alt="Project overview" width="100%"></a></p>

CENIZA combines a visual brand experience, equipment and lighting-service discovery, portfolio content and secure commercial intake. Contact and quote requests cross a protected server-side boundary before reaching automation, while the private CRM remains separated from the public website and its customer-facing data flows.

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
