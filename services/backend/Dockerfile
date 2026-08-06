# --- Build stage ---
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate
COPY . .
RUN npm run build

# --- Production stage ---
FROM node:20-alpine

# docker-cli for DooD, git for cloning user repos, openssl for Prisma
RUN apk add --no-cache docker-cli git openssl

WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev
RUN npx prisma generate
COPY --from=builder /app/dist ./dist
RUN mkdir -p /app/tmp

EXPOSE 3001
CMD ["sh", "-c", "npx prisma db push && node dist/main.js"]
