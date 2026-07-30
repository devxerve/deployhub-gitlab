FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Instalar openssl, necesario para que Prisma funcione en Alpine Linux
RUN apk add --no-cache openssl

# Copiar primero los archivos de dependencias para aprovechar la caché de Docker
COPY package*.json ./
COPY prisma ./prisma/

# Instalar las dependencias de Node.js
RUN npm install

# Generar el cliente de Prisma para poder acceder a la BBDD
RUN npx prisma generate

# Copiar el resto del código fuente del servicio
COPY . .

# Compilar el código TypeScript a JavaScript
RUN npm run build

# Exponer el puerto en el que escucha la aplicación
EXPOSE 3001

# Comando por defecto para iniciar el servicio
CMD ["sh", "-c", "npx prisma db push && node dist/app.js"]
