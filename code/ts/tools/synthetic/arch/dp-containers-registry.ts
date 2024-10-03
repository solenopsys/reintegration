import { Container, Deployment, Role} from "../src/structs"
import {Deployment} from "../src/deploy";

const manage = new Deployment({
    name: "containers-registry",
    version: "0.1.1",
    description: "Docker-registry"
})

const container = new Container("alexstorm-hsm-ci");

manage.add(new Deployment("ci", [container]));
manage.add(new Role());