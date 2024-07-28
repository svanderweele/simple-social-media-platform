FROM node:alpine

WORKDIR /app

COPY ./packages/account-api /app
COPY package-lock.json /app
RUN npm unlink @svdw/common
RUN npm i @svdw/common
RUN npm install
RUN npm run build

CMD ["node", "dist/server.js"]
