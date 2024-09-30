
import { StatefullSetType } from "../structs/statefullset";

export const STATEFULLSET_DEFAULT = (name: string, replicas: number): StatefullSetType => {
    return {
        apiVersion: 'apps/v1',
        kind: 'StatefulSet',
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

            serviceName: name,
            template: {
                metadata: {
                    labels: {
                        app: name
                    }
                },
                spec: {
                    containers: [],
                    volumes: []
                }
            },
            volumeClaimTemplates: []
        }
    } as StatefullSetType
}