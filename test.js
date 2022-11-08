
const ports = [
  53, // dns
  80, // http
  82, // ngrok
  83, // ngrok
  // 123, // ntp NOT available from node. Alernative check: nc -vz the-ip 123
  443, // https
  1883, // emqtt
  4443, // ngrok tunneling
  5671, // amqp/amqps
  5672, // amqp/amqps
  8883, // emqtts
  9000, // firmware upgrade
];

let theIp = process.argv[2];

let c = 0;
const testOnePort = (port) => {
  console.log(`Fetching: http://${theIp}:${port}`);
  fetch(`http://${theIp}:${port}`)
    .then(() => {
      // console.log(`Port ${port}: ${response.status}`);
    })
    .catch(() => {
      console.log('Error fetching port ' + port);
      // throw err;
    })
    .finally(() => {
      c++;
      if (ports[c])
        testOnePort(ports[c]);
    });
};
testOnePort(ports[c]);
