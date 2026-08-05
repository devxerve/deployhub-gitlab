FROM node:20-alpine

WORKDIR /app

# Only copy package files to cache dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Next.js inlines NEXT_PUBLIC_* at build time — they MUST be present here
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_AUTH_SERVICE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_AUTH_SERVICE_URL=$NEXT_PUBLIC_AUTH_SERVICE_URL

# Build the Next.js app
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
