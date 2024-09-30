import {
    Deploy, Ingress, Service, LoadBalancer, ConfigMap, VolumeClaim,
    HostPath, StatefullSet, ExternalService, Container, ConfigVolume, Port
} from "@solenopsys/synthetic";

const routing = "dhtclient"

type Config = {
    name: string,
    description: string,
    version: string,
    swarmKey: string,
    nodes: { [key: string]: string }
    volumesSizes: {
        staging: string
        data: string
    }
}

// config maps
function genSript(nodes: { [key: string]: string }, port: number) {
    let script = `#!/bin/sh\nset -ex\nipfs bootstrap rm all\n`;

    for (let key in nodes)
        script += `ipfs bootstrap add "/dns4/${key}.default.svc.cluster.local/tcp/${port}/p2p/${nodes[key]}"\n`;

    script += `ipfs config Routing --json '{ "Type": "${routing}" }' `;

    console.log("SCRIPT", script)
    return script
}


export const run = (config: Config) => {
    console.log("CONFIG", config)
    const dp = new Deploy(config)

    // ports
    const gateway = new Port("gateway", 8080)
    const rpc = new Port("rpc", 5001)
    const p2p = new Port("p2p", 4001)


    //services
    console.log("NAME", config.name)
    const ipfsService = new Service(config.name).addPort(rpc).addPort(gateway);
    dp.add(ipfsService)
    dp.add(new LoadBalancer(config.name).addPort(p2p))

    for (let key in config.nodes)
        dp.add(new ExternalService(key).addPort(p2p))

    const bootstrapConf = new ConfigMap("ipfs-bootstrap")
    bootstrapConf.set("bootstrap.sh", genSript(config.nodes, p2p.config.port))
    dp.add(bootstrapConf)

    const swarmConf = new ConfigMap("swarm-key")
    swarmConf.set("swarm.key", `/key/swarm/psk/1.0.0/\n/base16/\n${config.swarmKey}`)
    dp.add(swarmConf)

    // claims
    const stagingClaim = new VolumeClaim("staging", config.volumesSizes.staging)
    const dataClaim = new VolumeClaim("data", config.volumesSizes.data);

    // volumes
    const stagingVolume = new HostPath(stagingClaim, "/opt/ipfs-staging")
    const dataVolume = new HostPath(dataClaim, "/opt/ipfs-data")
    const swarmVolume = new ConfigVolume(swarmConf, "swarm.key")
    const bootstrapVolume = new ConfigVolume(bootstrapConf, "bootstrap.sh")

    // Containers
    const kubo: Container = new Container("kubo", "ipfs/kubo")
    kubo.env("LIBP2P_FORCE_PNET", "1")
    kubo.addPort(gateway).addPort(rpc).addPort(p2p)
    kubo.mountVolume(stagingVolume, "/export")
    kubo.mountVolume(dataVolume, " /data/ipfs")
    kubo.mountVolume(swarmVolume, "/data/ipfs")
    kubo.mountVolume(bootstrapVolume, "/container-init.d/bootstrap.sh")

    // Pods
    const ipfsPod: StatefullSet = new StatefullSet(config.name, 1)
    ipfsPod.addContainer(kubo)

    dp.add(ipfsPod)


    // ingress
    const ingress = new Ingress(config.name)
    ingress.addDomain("ipfs.solenopsys.org", ipfsService, gateway, "/")
    dp.add(ingress)

    return dp
}