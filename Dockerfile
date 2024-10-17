# Etapa 1: Build Stage
# Usamos una imagen oficial de Node.js con TypeScript como base
FROM node:22.9.0-alpine3.19 AS build

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

#Copia el package.json y package.lock.json
COPY package*.json ./

# Copia el resto de los archivos del proyecto
COPY . .

# Instala las dependencias necesarias
RUN npm install

ENV NODE_ENV=production

# Compila el código TypeScript a JavaScript
RUN npm run build

# Etapa 2: Production Stage
# Usamos una imagen más ligera de Node.js para la etapa de producción
FROM node:22.9.0-alpine3.19 AS production

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copiamos las dependencias desde el build anterior
COPY --from=build /app/node_modules ./node_modules

# Copiamos el código compilado desde el build anterior
COPY --from=build /app/dist ./dist

# Copiamos el archivo .env desde el build anterior
COPY --from=build /app/.env ./

# Copiamos los archivos estáticos desde el build anterior
COPY --from=build /app/public ./public

# Montamos un volumen para la persistencia de la carpeta auth
VOLUME /app/auth

#Exponemos el puerto 3000
EXPOSE 3000

# Define el comando que se ejecutará al iniciar el contenedor
CMD ["node", "dist/index.js"]