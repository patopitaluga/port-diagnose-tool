FROM node:18.3.0

WORKDIR /usr/src/app

COPY . .

EXPOSE 53 80 82 83 123 443 1883 4443 5671 5672 8883 9000

CMD [ "node", "server.js" ]
