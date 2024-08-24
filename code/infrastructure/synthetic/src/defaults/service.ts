
import { ServiceType, ServiceTypes } from "../structs/service";

export const SERVICE_DEFAULT = (name: string, podName: string, type: ServiceTypes): ServiceType => {
    return {
        apiVersion: 'v1',
        kind: 'Service',
        metadata: {
            labels: {
                app: name + "-service",
            },
            name,
        },
        spec: {
            ports: [

            ],
            selector: {
                app: (podName ? podName : name) + "-pod",
            },
            type
        },
    }
}