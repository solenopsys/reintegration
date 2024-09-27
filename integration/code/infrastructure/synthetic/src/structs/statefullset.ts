
import { ContainerType } from "./container";
import { VolumeSpecType } from "./volume";

export type StatefullSetType = {
    apiVersion: 'apps/v1';
    kind: 'StatefulSet';
    metadata: {
        name: string;
    };
    spec: {
        replicas: number;
        selector: {
            matchLabels: {
                app: string;
            };
        };
        serviceName: string;
        template: {

            metadata: {
                labels: {
                    app: string;
                };
            };
            spec: {
                volumes: VolumeSpecType[];
                containers: ContainerType[];
            };
        };
        volumeClaimTemplates: {
            metadata: {
                name: string;
            };
            spec: {
                accessModes: string[];
                resources: {
                    requests: {
                        storage: string;
                    };
                };
            };
        }[];
    };
}