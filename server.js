const httpServer = require('http');
const dgram = require('node:dgram');

const tcpPorts = [
  80, // http
  82, // ngrok
  83, // ngrok
  443, // https
  1883, // emqtt
  4443, // ngrok tunneling
  5671, // amqp/amqps
  5672, // amqp/amqps
  8883, // emqtts
  9000, // firmware upgrade
];

const udpPorts = [
  53, // dns
  123, // ntp
];

const mainNodeV = Number(String(process.versions.node).split('.')[0]);
if (mainNodeV < 18) throw new Error('Node v18 or superior required.');

(() => {
  console.log(`Starting server on TCP ports: ${tcpPorts.join(',')}`);
  const pjson = require('./package.json');
  tcpPorts.forEach((port, index) => {
    const server = httpServer.createServer((req, res) => {
      if (req.url === '/version') return res.end(pjson.version);
      res.end('1');
    }).listen(port);
    server.on('error', (err) => {
      console.log('');
      console.log(`TCP port ${port} not available.`)
    });
  });

  udpPorts.forEach((port) => {
    const dgramServer = dgram.createSocket('udp4');
    dgramServer.on('error', (err) => {
      console.log(`server error:\n${err.stack}`);
    });
    dgramServer.on('listening', () => {
      console.log(`Port UDP listening: ${dgramServer.address().port}`);
    });
    dgramServer.on('message', (msg, info) => {
      // console.log('Data received from client: ' + msg.toString());
      // console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);
      const response = Buffer.from('From server: your msg is received');
      dgramServer.send(response,info.port);
    });
    try {
      dgramServer.bind({
        port: port,
        exclusive: false,
      });
    } catch (error) {
      console.log(`UDP port ${port} not available.`)
    }
  });
})();

