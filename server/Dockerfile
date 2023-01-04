FROM node:lts-alpine AS build

WORKDIR /iris

COPY . .

RUN npm install
RUN npm run build


FROM node:lts-alpine AS modules

ENV NODE_ENV=production

WORKDIR /iris

COPY package*.json ./

RUN npm install


FROM alpine:latest AS lib

RUN apk update && apk add --no-cache libgcc


FROM cffnpwr/prisma-engines AS engines 


FROM gcr.io/distroless/nodejs18

WORKDIR /iris

ENV PRISMA_QUERY_ENGINE_BINARY=/prisma-engines/query-engine \
    PRISMA_MIGRATION_ENGINE_BINARY=/prisma-engines/migration-engine \
    PRISMA_INTROSPECTION_ENGINE_BINARY=/prisma-engines/introspection-engine \
    PRISMA_FMT_BINARY=/prisma-engines/prisma-fmt \
    PRISMA_CLI_QUERY_ENGINE_TYPE=binary \
    PRISMA_CLIENT_ENGINE_TYPE=binary

COPY ./prisma ./prisma
COPY --from=build /iris/dist/main.js .
COPY --from=modules /iris/node_modules ./node_modules
COPY --from=lib /lib/libz.so.1 /lib/libz.so.1
COPY --from=lib /lib/libc.musl-*.so.1 /lib/
COPY --from=engines /prisma-engines/query-engine /prisma-engines/migration-engine /prisma-engines/introspection-engine /prisma-engines/prisma-fmt /prisma-engines/

EXPOSE 3000

CMD [ "./main.js" ]