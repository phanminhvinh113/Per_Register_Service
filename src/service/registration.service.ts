import Consul from "consul";
const consul = new Consul();

const serviceName = "Per_Server";
const servicePort = 3550;

const serviceDetails = {
  name: serviceName,
  port: servicePort,
};

consul.agent.service.register(serviceDetails, (err) => {
  if (err) throw err;
  console.log(`Service ${serviceName} registered with Consul`);
});
