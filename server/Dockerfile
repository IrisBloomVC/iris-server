FROM node:lts-alpine AS modules

WORKDIR /iris

COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm npm install --omit=dev


FROM modules AS build

RUN --mount=type=cache,target=/root/.npm npm install

COPY tsconfig*.json vite.config.js .swcrc ./
COPY src src

RUN npm run build


FROM alpine:3 AS lib

ADD https://github.com/krallin/tini/releases/latest/download/tini /tini

RUN chmod +x /tini


FROM cffnpwr/prisma-engines AS engines 


FROM gcr.io/distroless/nodejs18

WORKDIR /iris

ENV PRISMA_QUERY_ENGINE_BINARY=/prisma-engines/query-engine \
    PRISMA_MIGRATION_ENGINE_BINARY=/prisma-engines/migration-engine \
    PRISMA_INTROSPECTION_ENGINE_BINARY=/prisma-engines/introspection-engine \
    PRISMA_FMT_BINARY=/prisma-engines/prisma-fmt \
    PRISMA_CLI_QUERY_ENGINE_TYPE=binary \
    PRISMA_CLIENT_ENGINE_TYPE=binary

COPY package.json package.json
COPY ./prisma ./prisma
COPY --from=lib /tini /tini
COPY --from=lib /lib/libz.so.1 /lib/libz.so.1
COPY --from=lib /lib/libc.musl-*.so.1 /lib/
COPY --from=engines /prisma-engines/query-engine /prisma-engines/migration-engine /prisma-engines/introspection-engine /prisma-engines/prisma-fmt /prisma-engines/
COPY --from=modules /iris/node_modules ./node_modules
COPY --from=build /iris/dist/main.js dist/main.js

EXPOSE 3000

ENTRYPOINT [ "/tini", "--" ]
CMD [ "/nodejs/bin/node", "./dist/main.js" ]