# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS build
ARG BUILD_COMMIT=unknown
WORKDIR /app

# Preact CLI 3 uses webpack 4, whose hashing requires OpenSSL's legacy provider.
# This setting exists only in the disposable build stage.
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV BUILD_COMMIT=${BUILD_COMMIT}

COPY package.json package-lock.json ./
RUN --mount=type=cache,id=atc-manager-npm-cache,target=/root/.npm,sharing=locked \
    --mount=type=cache,id=atc-manager-node-modules,target=/app/node_modules,sharing=locked \
    npm ci --no-audit --no-fund

COPY . .
RUN --mount=type=cache,id=atc-manager-node-modules,target=/app/node_modules,sharing=locked \
    npm run check

FROM nginx:1.28-alpine
ARG APP_VERSION=3.0.0-rc.12
ARG BUILD_COMMIT=unknown
LABEL org.opencontainers.image.title="ATC Manager 3" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.revision="${BUILD_COMMIT}" \
      org.opencontainers.image.description="Browser-based air traffic control simulation"

COPY --from=build /app/build /usr/share/nginx/html
RUN find /usr/share/nginx/html -type f -name '*.map' -delete

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
