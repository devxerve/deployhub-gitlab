# transcendence

- Ver qué contenedores están corriendo

```bash
docker ps --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}"
```
- Parar y borrar TODOS los contenedores de prueba a la vez

```bash
docker stop $(docker ps -q) && docker rm $(docker ps -aq)
```

- El backend se lanza en el directorio services/backend con
```bash
npm run start:dev
```

- Cómo se prueba la parte de Giselle: user admin@deployhub.com y contraseña 1234

- Grafana: http://grafana.157.230.23.219.nip.io/

- Conectarse servidor Sam:
```bash
ssh root@157.230.23.219
```

- Lanzar backend - Terminal 1 - Puerto 3001
```bash
cd services/backend && npm run start:dev
```

- Lanzar frontend - Terminal 2 - Puerto 3000
```bash
cd services/frontend && npm run dev
```

- VARIABLES DE ENTORNO ACTUALES - 31/07 - .env raiz
# Database (PostgreSQL)
DB_USER=transcendence
DB_PASSWORD=b50d869aaa3b587f1a4d0a908a99389a
DB_NAME=transcendence

# Grafana
GRAFANA_ADMIN_PASSWORD=972e6cda563c31c3227dee25

# Google
GOOGLE_CLIENT_ID=818452968938-lm3emccemc78ej2plm0bg3t6ogiccauk.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/oauth/google/callback

# GitHub
GITHUB_CLIENT_ID=Ov23liXZ5BqMmDKMDOqa
GITHUB_CLIENT_SECRET=0804a5c1eb4dd729180480daf595728be48a1aca
GITHUB_REDIRECT_URI=http://localhost:3001/auth/oauth/github/callback

# 42 Intra
INTRA_CLIENT_ID=u-s4t2ud-93d04a250ba94fc17f10d097f193ad142a96eaeda9cbbe63f334e422d8cded12
INTRA_CLIENT_SECRET=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
INTRA_REDIRECT_URI=http://localhost:3001/auth/oauth/42/callback

NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3001

JWT_SECRET='super_secret_key_123'
JWT_EXPIRES_IN=1d

PORT_AUTH_SERVICE=3001

APP_BASE_URL=http://localhost:3000

AUTH_SERVICE_URL=http://auth_service:3001

PROMETHEUS_URL=http://prometheus:9090

- VARIABLES DE ENTORNO ACTUALES - 31/07 - .env backend
DOCKER_NETWORK_NAME=deploy-network
DOCKER_BUILD_TIMEOUT=300000
AUTH_SERVICE_URL=http://localhost:3001
DEPLOY_TMP_DIR=/tmp/transcendence-deploys

- VARIABLES DE ENTORNO ACTUALES - 31/07 - .env.local frontend
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3001
NEXTAUTH_SECRET=tNllrtj/+B9zcpd13U/IOz41ya+jitMLWGlNBkYWvX4=

GITHUB_ID=
GITHUB_SECRET=

GOOGLE_ID=
GOOGLE_SECRET=

FORTY_TWO_ID=
FORTY_TWO_SECRET=
