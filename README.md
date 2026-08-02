*This project has been created as part of the 42 curriculum by loruzqui, cgil, gmaccha-, sreffers and dacastil*

# DeployHub

## Description

**DeployHub** is a mini PaaS (Platform-as-a-Service) web application: users connect
a Git repository, trigger a deployment, and watch it being built and run in real
time — repo clone → Docker image build → container start → live logs streamed to
the browser.

Core flow:

1. User creates a project and connects a repository.
2. User triggers a deploy.
3. Backend clones the repo, builds a Docker image and starts a container.
4. Build/runtime logs and status are streamed to the frontend over WebSockets.
5. Deployment health and infrastructure metrics are visible on Prometheus/Grafana
   dashboards.

Key features:

- Email/password authentication with hashed passwords, plus OAuth login (Google,
  GitHub, 42).
- Project/deployment creation and lifecycle tracking (`PENDING → BUILDING → RUNNING
  / FAILED`).
- Real-time build logs and deployment status via WebSockets, with support for
  multiple simultaneous viewers per deployment.
- Infrastructure and application monitoring dashboards (Prometheus + Grafana +
  cAdvisor).
- Analytics/KPI dashboard with charts over deployment activity.

## Instructions

### Prerequisites

- Docker and Docker Compose (or Podman equivalent)
- Node.js 20+ and npm (only needed for local frontend/backend development outside
  Docker)
- OAuth applications registered on Google Cloud Console, GitHub Developer
  Settings, and the 42 Intranet (to obtain client IDs/secrets)

### Environment setup

1. Copy the example environment files:
   ```bash

   ```

### Running the project

```bash
docker compose up -d --build
```

Services and default ports:

| Service | Port | Description |
|---|---|---|
| Frontend (Next.js) | 3000 | Web UI |
| Backend (NestJS) | 3001 / 8000 <!-- TODO: confirm exact port --> | Deployment engine + WebSocket gateway |
| Auth service (Express) | 3001 | Authentication & OAuth |
| PostgreSQL | 5432 | Database |
| Prometheus | 9090 | Metrics collection |
| Grafana | 3000 <!-- TODO: confirm, avoid port clash with frontend --> | Monitoring dashboards |
| Traefik | 80 | Reverse proxy / routing |

## Resources

- NestJS documentation — https://docs.nestjs.com
- Next.js documentation — https://nextjs.org/docs
- Prisma documentation — https://www.prisma.io/docs
- Traefik documentation — https://doc.traefik.io/traefik/
- Socket.IO documentation — https://socket.io/docs/v4/
- Prometheus / Grafana documentation

### AI usage disclosure



## Team Information

The subject requires four role types (Product Owner, Project Manager/Scrum
Master, Technical Lead/Architect, Developers). Our team additionally split
implementation work into five functional areas ("Polos"). Both mappings are
listed below.

| Member | 42 login | Subject role(s) | Functional area ("Polo") | Responsibilities |
|---|---|---|---|---|
| Loreto | loruzqui | <!-- TODO --> | Polo D — Real-time | WebSocket gateway, live log/status streaming, multi-client synchronization |
| Claudia | cgil | <!-- TODO --> | Polo B — Deployment engine | `/deploy` endpoint, git clone + Docker build/run pipeline, deployment state machine |
| Daniel | dacastil | <!-- TODO --> | Polo C — Security & data | PostgreSQL schema, Prisma, authentication, OAuth, roles |
| Giselle | gmaccha- | <!-- TODO --> | Polo E — Frontend & dashboard | Dashboard UI, deploy view, auth UI, WebSocket client integration |
| Sam | sreffers | <!-- TODO --> | Polo A — Infrastructure | Docker Compose, Traefik reverse proxy, Prometheus/Grafana monitoring |

## Project Management

- Task tracking tool used: Trello, Notion
- Communication channel:
- Meeting cadence: weekly sync
- How work was divided: the project was split into five functional areas
  ("Polos") described above, each owned by one team member, with explicit
  dependencies between them (e.g. Polo B depends on Polo A's Docker setup;
  Polo D depends on Polo B's log output; Polo E depends on Polo B/C/D).

## Technical Stack

**Frontend**
- Next.js 16 (React 19), used as the frontend framework
- Tailwind CSS v4 for styling
- `socket.io-client` for real-time updates
- `recharts` for analytics charts
- `next-auth` / `next-themes` / `react-hot-toast`

**Backend**
- NestJS 11 (deployment engine + WebSocket gateway), TypeScript
- Express-based standalone **auth-service** (separate microservice) for
  authentication and OAuth
- `socket.io` (via `@nestjs/websockets` + `@nestjs/platform-socket.io`) for
  real-time communication
- `prom-client` for exposing Prometheus metrics
- `class-validator` / `class-transformer` for DTO validation <!-- TODO: currently
  not enforced globally, see Known Limitations -->

**Database**
- PostgreSQL, accessed through **Prisma ORM**
- Chosen for relational integrity between users and deployments, and native
  Docker image availability

**Infrastructure**
- Docker / Docker Compose for containerization
- Traefik as reverse proxy / router
- Prometheus + cAdvisor for metrics collection, Grafana for dashboards

**Justification for major technical choices**

## Database Schema

Defined in `services/auth-service/prisma/schema.prisma` (PostgreSQL).

**`users`**

| Field | Type | Notes |
|---|---|---|
| `user_id` | UUID (PK) | |
| `username` | varchar(50), unique | |
| `email` | varchar(100), unique | |
| `password_hash` | varchar, nullable | null for OAuth-only accounts |
| `provider` | varchar(20), nullable | `local` \| `google` \| `github` \| `42` |
| `provider_id` | varchar(255), nullable | unique per provider (`@@unique([provider, provider_id])`) |
| `role` | varchar(20), nullable | <!-- TODO: not currently enforced by any guard, see Known Limitations --> |
| `created_at` | timestamp | |

**`deploy`**

| Field | Type | Notes |
|---|---|---|
| `deployment_id` | UUID (PK) | |
| `user_id` | UUID (FK → `users.user_id`, `onDelete: Cascade`) | |
| `status` | enum: `PENDING`, `QUEUED`, `BUILDING`, `SUCCESS`, `FAILED` | |
| `repoUrl` | varchar(255) | |
| `commitHash` | varchar(255), nullable | |
| `envVariables` | JSON, nullable | |
| `port` | int, nullable | |
| `created_at` / `updated_at` | timestamp | |

**Relations**: one `user` has many `deploy` rows (1‑to‑many).

<!-- TODO (team): confirm whether services/backend reads/writes the `deploy`
table via this same Prisma schema or through its own copy, and whether it goes
through auth-service's API for user data or queries the DB directly — this
affects whether the "Microservices" module counts as properly decoupled. -->

## Features List

| Feature | Status | Owner |
|---|---|---|
| Email/password signup & login (bcrypt-hashed) | ✅ Done | Daniel |
| OAuth login (Google, GitHub, 42) | ✅ Done | Daniel |
| Roles column on users | ⚠️ Schema only, not enforced | Daniel |
| Deploy pipeline (clone → build → run) | ✅ Done | Claudia |
| Deployment state tracking | ✅ Done | Claudia |
| Real-time build logs (WebSocket) | ✅ Done | Loreto |
| Real-time deployment status | ✅ Done | Loreto |
| Reconnection / multi-client sync | ⚠️ In progress | Loreto |
| Dashboard UI (projects, deploy status) | ✅ Done | Giselle |
| Live log terminal view | ✅ Done | Giselle |
| Analytics/KPI charts | ⚠️ Partial (no export/date filters yet) | Giselle |
| Notification system | ❌ Not started | Claudia / Loreto / Giselle |
| Search functionality | ❌ Not started | Claudia / Giselle |
| Multi-language (i18n) | ❌ Not started | Giselle |
| Reverse proxy + routing | ✅ Done | Sam |
| HTTPS | ❌ Not started | Sam |
| Prometheus + Grafana monitoring | ⚠️ Partial (no alerting rules, Grafana access not secured) | Sam |
| WAF / ModSecurity | ❌ Not started | Sam |
| HashiCorp Vault | ❌ Not started | Daniel |
| Privacy Policy / Terms of Service pages | ❌ Not started | Giselle |

## Modules

Target: **18 points** (14 required + 4 buffer), recalculated per the subject's
actual point values (WAF + Vault count as **one** 2-point Major module, not
two separate ones).

| Category | Module | Type | Points | Status | Owner(s) |
|---|---|---|---|---|---|
| Web | Frontend framework (Next.js) + Backend framework (NestJS) | Major | 2 | ✅ Done | Claudia / Giselle |
| Web | Real-time features (WebSockets) | Major | 2 | ⚠️ Needs reconnection/multi-user hardening | Loreto |
| Web | ORM (Prisma) | Minor | 1 | ✅ Done | Daniel |
| Web | Custom design system (10+ reusable components) | Minor | 1 | ⚠️ Components exist, not fully consistent/documented | Giselle |
| Web | Advanced search (filters/sort/pagination) | Minor | 1 | ❌ Not started | Claudia / Giselle |
| Web | Notification system | Minor | 1 | ❌ Not started | Claudia / Loreto / Giselle |
| Accessibility & i18n | Multiple languages (i18n, 3+) | Minor | 1 | ❌ Not started | Giselle |
| Accessibility & i18n | Additional browser support | Minor | 1 | ❌ Not verified | Giselle |
| User Management | OAuth 2.0 (Google/GitHub/42) | Minor | 1 | ✅ Done | Daniel |
| Cybersecurity | WAF/ModSecurity + HashiCorp Vault | Major | 2 | ❌ Not started | Sam / Daniel |
| DevOps | Monitoring (Prometheus + Grafana) | Major | 2 | ⚠️ Needs alerting rules + secured access | Sam |
| DevOps | Microservices | Major | 2 | ⚠️ Needs clearer service boundary (see Database Schema note) | Daniel / Claudia |
| Data & Analytics | Analytics dashboard | Major | 2 | ⚠️ Needs export (PDF/CSV) + date filters | Giselle / Claudia |

**Justification** <!-- TODO (team): 1-2 sentences per module explaining why it
was chosen and how it adds value, required by the subject for every module and
mandatory for the two custom/complex ones. -->

## Individual Contributions

<!-- TODO (team): each member should write 2-4 sentences here on what they
built, in their own words, plus any challenge they hit and how they solved it.
Git commit counts (from `git shortlog -sn --all`) as a starting reference:
loreeue/Loreto Uzquiano Esteban: 27, Giselle Maccha: 19, DanielCasti11o: 16,
Claudia/Claudia Gil: 17, samael_maza: 8. -->

- **Loreto (Polo D — Real-time)**:
- **Claudia (Polo B — Deployment engine)**:
- **Daniel (Polo C — Security & data)**:
- **Giselle (Polo E — Frontend & dashboard)**:
- **Sam (Polo A — Infrastructure)**:

## Known Limitations


