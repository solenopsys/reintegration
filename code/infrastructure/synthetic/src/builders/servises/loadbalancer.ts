
import { ServiceTypes } from "src/structs";
import { Service } from "./service";

export class LoadBalancer extends Service {
    constructor(name: string) {
        super(name)
        this.conf.spec!.type = ServiceTypes.LoadBalancer
    }
}