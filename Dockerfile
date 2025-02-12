# STAGE 1 - Build
FROM node:18.19-alpine AS build
WORKDIR /usr/src/app

# Установим зависимости для node-gyp
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
RUN rm -rf package-lock.json node_modules
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build --prod

# STAGE 2 - Nginx
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/smeshariki-front/browser /usr/share/nginx/html
