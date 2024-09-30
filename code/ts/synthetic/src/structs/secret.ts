
export type SecretType = {
    apiVersion: 'v1';
    kind: 'Secret';
    metadata: {
        name: string;
    };
    data: {
        [key: string]: string;
    };
}