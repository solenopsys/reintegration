import { DeploymentType } from "../structs"


export const DEPLOYMENT_DEFAULT = (name: string, replicas: number): DeploymentType => {
    return {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: {
            name,
        },
        spec: {
            replicas,
            selector: {
                matchLabels: {
                    app: name
                }
            },
            template: {
                metadata: {
                    labels: {
                        app: name
                    }
                },
                spec: {
                    containers: []
                }
            }
        }
    } as DeploymentType
}