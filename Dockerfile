FROM node:18-alpine AS build
WORKDIR /app

# install deps (including devDeps needed for building)
COPY package.json package-lock.json* ./
RUN npm install --production=false --no-audit --no-fund

# copy source and build
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html

# SPA fallback (rewrite to index.html)
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
