# --- Build stage ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Production stage ---
FROM node:20-alpine

# docker-cli for DooD, git for cloning user repos
RUN apk add --no-cache docker-cli git

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
RUN mkdir -p /app/tmp

EXPOSE 3001
CMD ["node", "dist/main.js"]
