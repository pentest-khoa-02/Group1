
FROM node:20

RUN mkdir /usr/app

WORKDIR /usr/app

COPY . .

RUN npm install

RUN chmod 755 scripts/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./scripts/entrypoint.sh"]
