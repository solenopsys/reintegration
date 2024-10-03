import { ConfigMap } from "..";
import {  VolumeMetadata, VolumeSpecType, VolumeType } from "../structs";
import { VolumeMount } from "./volumemount";

export class ConfigVolume implements VolumeMount {
    constructor(private name: string, configMap: ConfigMap, keyName: string) {

    }
    getName(): string {
        return this.name
    }

}