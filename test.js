const dgram = require('node:dgram');

const udpPorts = [
  53, // dns
  123, // ntp
];

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

if (!process.argv[2]) throw new Error('Missing ip. E.g. npm run test 127.0.0.1');
let theIp = process.argv[2];
theIp = theIp.replace('http://', ''); // just int case the user has set http:// in the argument.

const mainNodeV = Number(String(process.versions.node).split('.')[0]);
if (mainNodeV < 18) throw new Error('Node v18 or superior required.');

(async() => {
  await fetch(`http://${theIp}/version`)
  .then(async(response) => {
    const version = await response.text();
    console.log(`Diagnose tool server version ${version}`);
  })
  .catch(() => {
    console.log('Error fetching server.');
  })

  await new Promise((resolve) => {
    let c = 0;
    console.log('');
    const testTcpPort = async (port) => {
      console.log(`Fetching: http://${theIp}:${port}`);
      await fetch(`http://${theIp}:${port}`)
        .then((response) => {
          console.log(`Port ${port}: ${response.status}`);
        })
        .catch(() => {
          console.log('Error fetching port ' + port);
          // throw err;
        })
        .finally(() => {
          c++;
          if (tcpPorts[c])
            testTcpPort(tcpPorts[c]);
          else
            resolve(true);
        });
    };
    testTcpPort(tcpPorts[c]);
  });
  console.log('------------');

  await new Promise((resolve) => {
    let d = 0;
    const testUdpPort = async (port) => {
      const udpClient = dgram.createSocket('udp4');

      udpClient.on('message', (msg, info) => {
        console.log(`Received from server: ${msg.toString()} on port ${port}`);
      });

      const data = Buffer.from('Hello');
      udpClient.send(data, port, theIp, (error) => {
        if (error) console.log(error);
        console.log('Data sent to udp port ' + port);
        d++;
        if (udpPorts[d])
          testUdpPort(udpPorts[d]);
        else
          resolve(true);
      });
    };
    testUdpPort(udpPorts[d]);
  });
  console.log('Tests done.')

  setTimeout(() => {
    process.exit(0);
  }, 10 * 1000)
})();
