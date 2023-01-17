FROM node:lts-alpine AS modules

WORKDIR /iris

COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm npm install --omit=dev


FROM modules AS build

RUN --mount=type=cache,target=/root/.npm npm install

COPY tsconfig*.json vite.config.js .swcrc ./
COPY src src

RUN npm run build


FROM ubuntu:22.04 AS lib

ADD https://github.com/krallin/tini/releases/latest/download/tini-static /tini

RUN chmod +x /tini


FROM node:lts-alpine AS runner

WORKDIR /iris

COPY package.json package.json
COPY ./prisma ./prisma
COPY --from=lib /tini /tini
COPY --from=modules /iris/node_modules ./node_modules
COPY --from=build /iris/dist/main.js dist/main.js

EXPOSE 3000

ENTRYPOINT [ "/tini", "--" ]
CMD [ "node", "./dist/main.js" ]