import { Container } from "../../parts/container"; 
import { Builder } from "src/interfaces";
import { DEFAULTS } from "src/defaults";
import { StatefullSetType } from "src/structs";

export class StatefullSet extends Builder<StatefullSetType> {
    constructor(private name: string, private replicas: number) {
        super()
        this.init()
    }

    getName(): string {
        return this.name
    }

    init() {
        this.conf = DEFAULTS.STATEFULLSET(this.name, this.replicas)
    }

    addContainer(container: Container) {
        const cont = container.export();
        console.log("CONF",this.conf)
        this.conf.spec!.template.spec.containers.push(cont)
    }

}