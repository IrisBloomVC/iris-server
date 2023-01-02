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


FROM gcr.io/distroless/nodejs18

WORKDIR /iris

COPY ./prisma ./prisma
COPY --from=build /iris/dist/main.js .
COPY --from=modules /iris/node_modules ./node_modules
COPY --from=lib /lib/libz.so.1 /lib/libz.so.1
COPY --from=lib /lib/libc.musl-*.so.1 /lib/

EXPOSE 3000

CMD [ "./main.js" ]