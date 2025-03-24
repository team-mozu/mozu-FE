FROM node:18-alpine AS builder
RUN apk add --no-cache libc6-compat git curl unzip

ARG VITE_SERVER_URL
ARG VITE_ADMIN_URL
ARG VITE_ADMIN_AUTH_URL
ARG VITE_ADMIN_COOKIE_DOMAIN

ENV VITE_SERVER_URL=${VITE_SERVER_URL}
ENV VITE_ADMIN_URL=${VITE_ADMIN_URL}
ENV VITE_ADMIN_AUTH_URL=${VITE_ADMIN_AUTH_URL}
ENV VITE_ADMIN_COOKIE_DOMAIN=${VITE_ADMIN_COOKIE_DOMAIN}

ARG BRANCH
ENV BRANCH=${BRANCH}

RUN curl -L -o ../mozu-FE.zip https://github.com/team-mozu/mozu-FE/archive/refs/heads/${BRANCH}.zip && \
    unzip ../mozu-FE.zip -d /

RUN corepack enable && corepack prepare yarn@4.6.0 --activate

WORKDIR /mozu-FE-${BRANCH}
RUN yarn set version berry
RUN yarn install

WORKDIR /mozu-FE-${BRANCH}/packages/admin
RUN yarn build

FROM nginx:alpine AS runner

ARG BRANCH
ENV BRANCH=${BRANCH}

RUN echo "\
server {\
    listen 3000;\
    location / {\
        root   /usr/share/nginx/html;\
        index  index.html index.html;\
        try_files \$uri \$uri/ /index.html =404;\
    }\
}" > /etc/nginx/conf.d/default.conf

COPY --from=builder /mozu-FE-${BRANCH}/packages/admin/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]