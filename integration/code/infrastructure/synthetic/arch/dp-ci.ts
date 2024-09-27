import { REGISTRY_SOLENOPSYS } from "../src/consts"
import {Container, Deployment, Role} from "../src/structs";
import {Deployment} from "../src/deploy";
export const manage = new Deployment({
    name: "HSM",
    version: "0.1.2",
    description: "Continuous integration module"
})

const zmqPort = 5555;
const ci = new Container("alexstorm-hsm-ci", REGISTRY_SOLENOPSYS);
ci.setEnv({"zmq.SocketUrl": `tcp://*:${ zmqPort}`})

manage.add(new Deployment("ci", [ci]));
manage.add(new Role());