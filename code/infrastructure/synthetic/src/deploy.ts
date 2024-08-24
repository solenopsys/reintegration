import type { StructPrint } from "./interfaces";
import { Deployment } from "./builders/deployment/deployment";
import { LoadBalancer } from "./builders/servises/loadbalancer";
import { Role } from "./builders/role";
import { Service } from "./builders/servises/service";
import { Ingress } from "./builders/ingress";
import { ConfigMap } from "./builders/configmap";
import { StatefullSet } from "./builders/deployment/statefullset";

export interface ChartConf  {
    name: string,
    version: string,
    description: string
}

export class Deploy implements StructPrint {
    items: any[] = [];
    result: any;

    constructor(public config: ChartConf) {
    }

    add(obj: any) {
        this.items.push(obj);
    }

    export(): object {
        return {
            "apiVersion": "v2",
            "name": this.config.name,
            "version": this.config.version,
            "description": this.config.description,
            "icon": `/icons/${this.config.name}.svg`,
            "appVersion": "1.0.0"
        };
    }

    exportItem(object: { export: () => void }, prefix: string) {
        const name = "templates/" + prefix + "-" + object.getName();
        this.result[name] = object.export()
    }

    processItem(obj: any) {

        if (obj instanceof LoadBalancer)
            this.exportItem(obj, "loadbalancer")
        else if (obj instanceof Service)
            this.exportItem(obj, "service")
        else if (obj instanceof ConfigMap)
            this.exportItem(obj, "configmap")
        else if (obj instanceof StatefullSet)
            this.exportItem(obj, "statefullset")
        else if (obj instanceof Role)
            this.exportItem(obj, "role")
        else if (obj instanceof Deployment)
            this.exportItem(obj, "deployment")
        else if (obj instanceof Ingress)
            this.exportItem(obj, "ingress")
    }

    exportStruct(): { [name: string]: object } {
        this.result = {}

        this.result['chart'] = this.export()

        for (let i = 0; i < this.items.length; i++) {
            console.log("ITEM: ", i)
            this.processItem(this.items[i])
        }
        return this.result;
    }




}
