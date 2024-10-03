import { ConfigMapType } from "../structs/configmap";

export const CONFIGMAP_DEFAULT = (name: string): ConfigMapType => {
    return {
        apiVersion: 'v1',
        kind: 'ConfigMap',
        metadata: {
            name,
        },
        data: {
        }
    } as ConfigMapType
}