FROM node:20 AS development

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./

RUN npm install

# COPY . .

RUN npm run build

EXPOSE 3000

################
## PRODUCTION ##
################
FROM node:20 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY --from=development /usr/src/app/ .

EXPOSE 3000

CMD ["node", "dist/main"]
