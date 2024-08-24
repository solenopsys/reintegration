export type IngressType = {
    apiVersion: 'networking.k8s.io/v1';
    kind: 'Ingress';
    metadata: {
        name: string;
        annotations: {
            [key: string]: string;
        };
    };
    spec: {
        tls: {
            hosts: string[];
            secretName: string;
        }[];
        rules: {
            host: string;
            http: {
                paths: {
                    path: string;
                    pathType: string;
                    backend: {
                        service: {
                            name: string;
                            port: {
                                number: number;
                            };
                        };
                    }
                }[];
            };
        }[];
    };
}
     
