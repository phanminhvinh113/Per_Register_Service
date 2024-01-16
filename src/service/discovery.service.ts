import Consul from "consul";

const consul = new Consul();

export function discoverService(serviceName: string): Promise<string | null> {
  return new Promise((resolve) => {
    consul.catalog.service.nodes(serviceName, (err, nodes: any) => {
      if (err) {
        console.error(`Error discovering service ${serviceName}: ${err}`);
        resolve(null);
      } else {
        const availableNodes = nodes.filter((node: any) =>
          node.Checks.every((check: any) => check.Status === "passing")
        );
        if (availableNodes.length > 0) {
          const randomNode = availableNodes[Math.floor(Math.random() * availableNodes.length)];
          resolve(`http://${randomNode.Address}:${randomNode.ServicePort}`);
        } else {
          console.error(`No healthy instances of service ${serviceName} found`);
          resolve(null);
        }
      }
    });
  });
}
