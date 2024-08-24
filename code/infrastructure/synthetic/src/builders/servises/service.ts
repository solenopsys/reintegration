import { Builder } from "../../interfaces";
import { DEFAULTS } from "../../defaults";
import { ServiceType, ServiceTypes } from "src/structs";
import { Port } from "src/parts/port";

export class Service extends Builder<ServiceType> {
    constructor(private name: string, private podName?: string) {
        super()
        this.init()
    }

    getName(): string {
        return this.name
    }

    init() {
        this.conf = DEFAULTS.SERVICE(this.name, this.podName, ServiceTypes.Service)
    }

    addPort(port: Port): Service {
        return this.newPort(port.config.name, port.config.port)
    }

    newPort(name: string, port: number, targetPort?: number): Service {
        this.conf.spec?.ports.push({ name, port, targetPort: targetPort ? targetPort : port })
        return this
    }
}