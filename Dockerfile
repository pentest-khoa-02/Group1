FROM node:alpine

WORKDIR /usr

COPY . /usr/

COPY package.json /usr/

RUN npm install

EXPOSE 3001

CMD npx prisma migrate dev && npm run dev
