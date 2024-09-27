import { ContainerType } from "src/structs";
import { Builder } from "../interfaces";
import { VolumeClaim } from "./volumeclaim";
import { HostPath } from "./hostpath";
import { VolumeMount } from "./volumemount";
import { Port } from "./port";
 

export class Container extends Builder<ContainerType> {
    constructor(private name: string, private image: string, private registry?: string) {
        super()
        this.init()
    }

    getName(): string {
        return this.name
    }

    init() {
        this.conf = {
            name: this.name,
            image: this.registry ? this.registry : "" + this.image,
            env: {},
            ports: [],
            volumeMounts: []
        }
    }

    env(name: string, value: string) {
        this.conf.env[name] = value
    }

    addPort(port: Port): Container {
        this.conf.ports.push(port.config)
        return this
    }

    mountVolume(volume: VolumeMount, mountPath: string, subPath?: string, readOnly?: boolean) {
        console.log("VOLUME",volume)

        if(volume instanceof VolumeClaim){
            this.conf.volumeMounts.push({
                name: volume.getName(),
                mountPath: mountPath
            })
        } else if (volume instanceof HostPath) {
            this.conf.volumeMounts.push({
                name: volume.getName(),
                mountPath: mountPath,
                subPath: subPath,
                readOnly: readOnly
            })
        }
       
    }
}