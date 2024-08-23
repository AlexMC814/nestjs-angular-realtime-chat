FROM node:20 AS development

WORKDIR /usr/frontend/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install
RUN npm install -g @angular/cli

COPY . .

RUN npm run build

EXPOSE 4200