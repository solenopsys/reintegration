import { ContainerType } from "./container";

export type DeploymentType = {
    apiVersion: 'apps/v1';
    kind: 'Deployment';
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
        template: {
            metadata: {
                labels: {
                    app: string;
                };
            };
            spec: {
                containers: ContainerType[];
            };
        };
    };
}