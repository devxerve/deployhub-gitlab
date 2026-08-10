*This project has been created as part of the 42 curriculum by loruzqui, cgil, gmaccha-, sreffers, dacastil*

# Description

## DeployHub

DeployHub is a mini **PaaS (Platform-as-a-Service)** that allows users to connect Git repositories, deploy Dockerized applications and monitor their deployments in real time.

The main workflow is:

```text
Git Repository
     ↓
Create Project
     ↓
Deploy
     ↓
Clone Repository
     ↓
Build Docker Image
     ↓
Run Container
     ↓
Live Logs & Status
```

## Features List

* **User authentication** — User registration, login, JWT authentication and secure password hashing with bcrypt.
  **Contributors:** Daniel

* **OAuth authentication** — Authentication through Google, GitHub and 42 Intra.
  **Contributors:** Daniel

* **Git repository integration** — Connect projects to Git repositories and deploy from a selected commit.
  **Contributors:** Claudia

* **Docker deployments** — Clone repositories, build Docker images and run application containers.
  **Contributors:** Claudia

* **Environment configuration** — Configure environment variables for deployments.
  **Contributors:** Claudia

* **Automatic port allocation** — Assign an available port when launching a deployment.
  **Contributors:** Claudia

* **Deployment status tracking** — Track deployment progress and final status.
  **Contributors:** Claudia / Loreto

* **Real-time deployment logs** — Display deployment output and status updates through WebSockets without refreshing the page.
  **Contributors:** Loreto / Claudia / Giselle

* **Deployment history** — Access previous deployments and their information.
  **Contributors:** Claudia / Giselle

* **Advanced log search and filtering** — Search and filter deployment logs, with pagination and CSV export.
  **Contributors:** Giselle / Claudia

* **Dashboard and analytics** — Visualize projects, deployments and relevant application data.
  **Contributors:** Giselle

* **Infrastructure monitoring** — Monitor application and container metrics using Prometheus, Grafana and cAdvisor.
  **Contributors:** Sam

* **HTTPS and reverse proxy** — Secure application traffic and route requests through Traefik.
  **Contributors:** Sam

* **Web Application Firewall** — Protect the application using ModSecurity and OWASP CRS.
  **Contributors:** Sam

* **Responsive interface and themes** — Responsive UI with dark/light theme support and reusable components.
  **Contributors:** Giselle

* **Privacy Policy and Terms of Service** — Accessible pages containing the application's privacy and service information.
  **Contributors:** Giselle / team

## Instructions

### Requirements

* Docker
* Docker Compose
* Git
* Node.js 20+ for local development

### Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Configure the required database, authentication, OAuth and service variables.

**Never commit real credentials or secrets to the repository.**

### Run

Start the complete application with:

```bash
docker compose up -d
```

Stop the application with:

```bash
docker compose down -v --rmi local --remove-orphans
docker network rm paas_network
```

### Repository Requirements for Deployment

To deploy a project through DeployHub, the connected Git repository must meet the following requirements:

* **A `Dockerfile` at the root of the repository is mandatory.** If no `Dockerfile` is found, the deployment fails immediately with `Cannot process request: Dockerfile missing.` There is no default/fallback Dockerfile — the platform does not build or run a project that doesn't provide one.

## Resources

* [Next.js](https://nextjs.org/docs)
* [NestJS](https://docs.nestjs.com)
* [Prisma](https://www.prisma.io/docs)
* [PostgreSQL](https://www.postgresql.org/docs/)
* [Docker](https://docs.docker.com/)
* [Traefik](https://doc.traefik.io/traefik/)
* [Socket.IO](https://socket.io/docs/)
* [Prometheus](https://prometheus.io/docs/)
* [Grafana](https://grafana.com/docs/)
* [ModSecurity](https://github.com/owasp-modsecurity/ModSecurity)

### AI Usage

AI tools were used as a development support throughout the project.

The team used AI mainly for:

* Understanding and researching technical concepts.
* Getting help with debugging and resolving development errors.
* Exploring possible implementations and approaches.
* Reviewing and improving code.
* Generating ideas for UI components and project organization.
* Helping with documentation and project explanations.

AI-generated suggestions were reviewed and adapted by the team before being integrated into the project. The final implementation, architecture and technical decisions were made and validated by the team.

## Team Information

| Member                   | Role                           | Area                 | Responsibilities |
| ------------------------ | ------------------------------ | --------------------- | ----------------- |
| **Loreto** (`loruzqui`)  | Product Owner + Developer                  | Real-Time             | Defined product requirements and priorities; implemented real-time functionality, including the WebSocket gateway, deployment rooms, and live deployment logs and status updates. |
| **Claudia** (`cgil`)     | Developer                      | Deployment Engine     | Built the Deployment Engine: Git repository integration, Docker build/run pipeline, deployment state management, port allocation, environment variable configuration, and deployment error handling. |
| **Daniel** (`dacastil`)  | Developer                      | Security & Data       | Implemented the authentication service, including PostgreSQL/Prisma integration, password hashing, JWT authentication, and OAuth 2.0 with Google, GitHub, and 42 Intra. |
| **Giselle** (`gmaccha-`) | Project Manager / Scrum Master + Developer | Frontend & Dashboard  | Coordinated team tasks and communication; developed the frontend, project and deployment interfaces, logs interface, and analytics dashboard with reusable UI components. |
| **Sam** (`sreffers`)     | Technical Lead + Developer                 | Infrastructure        | Defined the technical architecture; set up Docker Compose infrastructure, Traefik with HTTPS, ModSecurity, and the monitoring stack (Prometheus, Grafana, cAdvisor, Alertmanager). |

The project was divided into five functional areas:

* **Polo A — Infrastructure**
* **Polo B — Deployment Engine**
* **Polo C — Security & Data**
* **Polo D — Real-Time**
* **Polo E — Frontend & Dashboard**

## Project Management

The team organized the project by dividing responsibilities between the five Polos and coordinating their dependencies.

* **Task management:** Trello and Notion
* **Meetings:** Weekly team synchronization
* **Communication:** Google Team calls and WhatsApp group

All team members contributed to the project and worked on their assigned areas.

## Technical Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Socket.IO Client
* Recharts
* Framer Motion

### Backend

* NestJS
* TypeScript
* Socket.IO
* Prisma
* Axios
* Prometheus client

### Authentication

* Express
* JWT
* bcrypt
* OAuth 2.0
* Google
* GitHub
* 42 Intra

### Infrastructure

* Docker
* Docker Compose
* Traefik
* ModSecurity / OWASP CRS
* Prometheus
* Grafana
* cAdvisor
* Alertmanager

### Main Technical Choices

**Next.js + NestJS:** provide a structured frontend/backend architecture.

**PostgreSQL + Prisma:** provide relational data storage and type-safe database access.

**Docker:** provides isolated and reproducible application environments.

**Socket.IO:** enables real-time deployment updates and live logs.

**Traefik:** provides reverse proxying and HTTPS routing.

**Prometheus + Grafana:** provide infrastructure and application monitoring.

## Database Schema

The database is implemented with **PostgreSQL and Prisma**, using the PostgreSQL `backend` schema.

The Prisma schema is located at:

```text
services/auth-service/prisma/schema.prisma
```

The current database contains three main models:

* **Project** — Stores the projects created by users, including the repository URL, project name, default branch and description.
* **Deploy** — Stores deployment information, including the associated user, project, repository, status, port, commit, branch and environment variables.
* **DeployLog** — Stores the logs generated by each deployment, including the deployment reference, message and creation timestamp.

### Project

| Field         | Type                          |
| ------------- | ------------------------------ |
| id            | String (PK, cuid, no default)  |
| userId        | String                         |
| name          | String                         |
| repoUrl       | String                         |
| defaultBranch | String (default: `"main"`)     |
| description   | String? (optional)             |
| createdAt     | DateTime (default: `now()`)    |

### Deploy

| Field        | Type                          |
| ------------ | ------------------------------ |
| id           | String (PK, default: `cuid()`) |
| userId       | String                         |
| repoUrl      | String                         |
| projectId    | String                         |
| status       | String                         |
| port         | Int? (optional)                |
| commitHash   | String? (optional)             |
| branch       | String? (optional)             |
| envVariables | String? (optional)             |
| createdAt    | DateTime (default: `now()`)    |

### DeployLog

| Field     | Type                            |
| --------- | -------------------------------- |
| id        | String (PK, default: `cuid()`)   |
| deployId  | String (indexed)                 |
| message   | String                           |
| createdAt | DateTime (default: `now()`)      |

An index on `deployId` is used to efficiently retrieve logs belonging to a deployment.

### Persistence Model

Projects and deployments are persisted in **PostgreSQL** through Prisma, using the `backend` schema with `multiSchema` support.

The current Prisma schema does **not** define a `Team` model. Project ownership and deployment ownership are represented through `userId` fields.

The `Project` and `Deploy` models use plain string identifiers (`userId`, `projectId`) to associate deployments with projects and users. The current Prisma schema does not explicitly define Prisma relation fields (`@relation`) between these models — associations are maintained at the application level rather than enforced by foreign key constraints in the schema.


## Modules

The project reaches **19 points** through the following modules:

| Module                            | Type  | Points |
| --------------------------------- | ----- | -----: |
| Frontend + Backend Frameworks     | Major |      2 |
| Real-Time Features                | Major |      2 |
| ORM — Prisma                      | Minor |      1 |
| OAuth 2.0                         | Minor |      1 |
| Advanced Permissions System       | Major |      2 |
| Monitoring — Prometheus + Grafana | Major |      2 |
| Notifications                     | Minor |      1 |
| Advanced Search                   | Minor |      1 |
| Multiple Languages                | Minor |      1 |
| Backend as Microservices          | Major |      2 |
| Support for additional browsers   | Minor |      1 |
| Advanced analytics dashboard      | Major |      2 |
| User activity Analytics           | Minor |      1 |
| **Total**                         |       | **19** |

### Frontend + Backend Frameworks — Major — 2 pts

**Who:** Giselle + Sam / team

**How it was implemented:** The frontend was built with Next.js/React and the backend with NestJS. Responsibilities are separated between the user interface, API and backend services.

### Real-Time Features — Major — 2 pts

**Who:** Loreto + Claudia + Giselle

**How it was implemented:** The Deployment Engine generates deployment state changes and process logs. The backend converts this information into Socket.IO events, which are received by subscribed clients without requiring a page refresh. Rooms are used to separate events by deployment.

### ORM — Prisma — Minor — 1 pt

**Who:** Daniel

**How it was implemented:** Prisma is used as the ORM between the backend and PostgreSQL. The Prisma schema defines the database models and relationships, while Prisma Client provides type-safe database access from TypeScript.

### OAuth 2.0 — Minor — 1 pt

**Who:** Daniel

**How it was implemented:** OAuth providers are integrated to allow external authentication through Google, GitHub and 42 Intra, in addition to the application's local authentication.

### Advanced Permissions System — Major — 2 pts

**Who:** Daniel + team

**How it was implemented:** The application implements different access levels according to the user's role and permissions. These permissions determine which resources and actions each user can access or manage.

The implementation provides different views and available actions depending on the user's permissions.

### Monitoring — Major — 2 pts

**Who:** Sam + team

**How it was implemented:** The infrastructure is monitored using Prometheus, Grafana and cAdvisor. Prometheus collects metrics, cAdvisor provides container-level metrics and Grafana visualizes the collected information. Alertmanager handles monitoring alerts.

### Notifications — Minor — 1 pt

**Who:** Loreto + Giselle

**How it was implemented:** DeployHub incorporates a notification system to inform users about relevant application events, particularly events related to the status and progress of their deployments. Notifications are integrated with the application's event system so users receive updates without having to refresh the page.

### Advanced Search — Minor — 1 pt

**Who:** Giselle + Claudia

**How it was implemented:** Deployment logs can be searched and filtered using different criteria. Results support pagination, allowing users to navigate through large amounts of log information efficiently.

### Multiple Languages — Minor — 1 pt

**Who:** Loreto

**How it was implemented:** The frontend uses an internationalization (i18n) system to support multiple languages. User-facing text is handled through translations and users can switch between the available languages through the interface.

### Backend as Microservices — Major — 2 pts

**Who:** Daniel + Sam

**How it was implemented:** Authentication is separated into an independent service from the main backend. The main NestJS backend handles deployment functionality, WebSockets and monitoring-related functionality.

This separation isolates responsibilities and allows the different services to be developed and maintained independently.


### Support for Additional Browsers — Minor — 1 pt

**Who:** Sam

**How it was implemented:** The application is designed to work correctly across different modern web browsers, ensuring that the main functionality and user interface remain accessible and usable beyond a single browser environment.

### Advanced Analytics Dashboard — Major — 2 pts

**Who:** Sam

**How it was implemented:** Interactive dashboard with line, bar and pie charts showing deployment metrics — success/failure rates, build duration and resource usage. Data updates in real time via Socket.IO, supports custom date range filters, and can be exported as PDF/CSV.

### User Activity Analytics and Insights Dashboard — Minor — 1 pt

**Who:** Sam

**How it was implemented:** DeployHub provides an analytics dashboard that collects and presents user activity and deployment-related data through visualizations and aggregated metrics. This allows users to obtain insights into their activity and the overall behavior of their deployments from a centralized dashboard.

## Individual Contributions

### Loreto — Product Owner + Developer

* Product requirements and prioritization.
* Real-time functionality.
* WebSocket gateway.
* Deployment rooms.
* Live deployment logs and status.

### Claudia — Developer

* Deployment Engine.
* Git integration.
* Docker build/run pipeline.
* Deployment states.
* Port allocation.
* Environment variables.
* Deployment error handling.

### Daniel — Developer

* PostgreSQL and Prisma.
* Authentication service.
* Password hashing.
* JWT.
* Google, GitHub and 42 OAuth.

### Giselle — Project Manager / Scrum Master + Developer

* Team coordination and task management.
* Frontend and dashboard.
* Project and deployment interfaces.
* Logs interface.
* Analytics and reusable UI components.

### Sam — Technical Lead + Developer

* Technical architecture.
* Docker Compose infrastructure.
* Traefik and HTTPS.
* ModSecurity.
* Prometheus, Grafana, cAdvisor and Alertmanager.

## Privacy & Terms

DeployHub provides accessible **Privacy Policy** and **Terms of Service** pages containing information relevant to the application.
