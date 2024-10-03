
import { PortType } from "../structs";
 
export class Port  {

    config: PortType;

    constructor(name: string, port: number) {
        this.config = { name, port }
    }

    
}