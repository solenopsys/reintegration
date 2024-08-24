import { PortLink } from "./port";

export enum ServiceTypes {
    LoadBalancer = "LoadBalancer",
    Service = "Service",
    ExternalName = "ExternalName"
}

export type ServiceSpecType = {
    ports: PortLink[];
    selector: {
        app: string;
    };
    type: ServiceTypes;
}

export type ServiceMetadataType = {
    labels: {
        app: string;
    };
    name: string;
}

export type ServiceType = {
    apiVersion: 'v1';
    kind: 'Service';
    metadata: ServiceMetadataType;
    spec?: ServiceSpecType;
}

