 
import { VolumeClaim } from "./volumeclaim";
import { VolumeMount } from "./volumemount";

export class HostPath implements VolumeMount {

    constructor(private name: string, claim: VolumeClaim, path: string) {
    }

    getName(): string {
        return this.name
    }
   
     

}