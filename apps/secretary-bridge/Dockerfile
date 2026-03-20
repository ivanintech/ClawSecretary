# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

FROM node:20-alpine AS runtime

WORKDIR /app

RUN apk add --no-cache tini

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package.json ./

USER node

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/index.js"]
