const httpServer = require('http');

const ports = [
  // 53, // dns
  80, // http
  82, // ngrok
  83, // ngrok
  123, // ntp
  443, // https
  1883, // emqtt
  4443, // ngrok tunneling
  5671, // amqp/amqps
  5672, // amqp/amqps
  8883, // emqtts
  9000, // firmware upgrade
];

ports.forEach((port) => {
  httpServer.createServer((req, res) => res.end('1')).listen(port);
});

console.log(`Server listening ports: ${ports.join(', ')}`)
