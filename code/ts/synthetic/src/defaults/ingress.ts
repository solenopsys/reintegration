import { IngressType } from "../structs/ingress"

export const INGRESS_DEFAULT = (name: string): IngressType => {
    return {
        apiVersion: 'networking.k8s.io/v1',
        kind: 'Ingress',
        metadata: {
            name,
            annotations: {
                'kubernetes.io/ingress.class': 'traefik',
                'cert-manager.io/cluster-issuer': 'zerossl-production',
                'cert-manager.io/acme-challenge-type': 'dns01',
                'cert-manager.io/acme-dns01-provider': 'route53',
                'ingress.kubernetes.io/force-hsts': 'true',
                'ingress.kubernetes.io/hsts-preload': 'true',
                'ingress.kubernetes.io/ssl-redirect': 'true',
                'ingress.kubernetes.io/enable-cors': 'true'
            }
        },
        spec: {
            tls: [],
            rules: []
        }
    } as IngressType
}


