export type ConfigMapType = {
    apiVersion: 'v1';
    kind: 'ConfigMap';
    metadata: {
        name: string;
    };
    data: {
        [key: string]: string;
    };
}