
const ports = [
  53, // dns
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

ports.forEach(async(port) => {
  const response = await fetch('http://localhost:80')
    .catch((err) => console.error('Error: ', err));
  console.log(`Port ${port}: ${response.status}`);
});
