# This file is intended to extend `base.dockerfile`

FROM nginx:1-alpine-slim as react-app

WORKDIR /usr/share/nginx/html

COPY --from=service-builder /app/dist/ ./
COPY ./deploy/nginx.conf /etc/nginx/conf.d/default.conf