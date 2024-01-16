import Consul from "consul";
import { NAME_SERVICE, PORT_SERVICE } from "./src/utils/constant";
import dotenv from "dotenv";
dotenv.config();
const consul = new Consul();

const serviceNameOrder: string = NAME_SERVICE.OrderService;
const serviceNameProduct: string = NAME_SERVICE.ProductService;
const servicePort = process.env?.PORT_SERVER || 3558;
//
// Register Order Service Instances
for (let i = 0; i < 2; i++) {
  const serviceId = `${serviceNameOrder}-${i + 1}`;
  const serviceDetails = {
    name: serviceNameOrder,
    id: serviceId,
    address: "localhost",
    port: PORT_SERVICE.Order + i,
    check: {
      http: `http://localhost:${PORT_SERVICE.Order + i}/health`,
      interval: "10s",
      timeout: "2s",
    },
  };
  consul.agent.service.register(serviceDetails, (err) => {
    if (err) throw err;
    console.log(`Service ${serviceId} registered with Consul`);
  });
}

// Register Product Service
const serviceDetailsProduct = {
  name: serviceNameProduct,
  address: "localhost",
  port: PORT_SERVICE.Product,
  check: {
    http: `http://localhost:${PORT_SERVICE.Product}/health`,
    interval: "10s",
    timeout: "2s",
  },
};
consul.agent.service.register(serviceDetailsProduct, (err) => {
  if (err) throw err;
  console.log(`Service ${serviceNameProduct} registered with Consul`);
});

// Graceful service deregistration on server shutdown
process.on("SIGINT", () => {
  for (let i = 0; i < 2; i++) {
    const serviceId = `${serviceNameOrder}-${i + 1}`;
    consul.agent.service.deregister(serviceId, () => {
      console.log(`Service ${serviceId} deregistered from Consul`);
    });
  }
  consul.agent.service.deregister(serviceNameProduct, () => {
    console.log(`Service ${serviceNameProduct} deregistered from Consul`);
    server.close();
  });
});
