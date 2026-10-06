# Built in CI only, where imports/ holds checkouts, not links.
FROM node:22-bookworm-slim AS build
WORKDIR /src
COPY . .
RUN npm ci --no-audit --no-fund && npm run build

FROM nginx:1.27-alpine
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /src/dist /usr/share/nginx/html
