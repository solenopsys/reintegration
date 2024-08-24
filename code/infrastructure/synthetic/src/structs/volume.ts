
export type VolumeMetadata = {
    name: string;
}

export type HostPathVolumeType = {
    path: string;
    type: string;
}

export type ConfigMapVolumeType = {
    name: string;
    items: {
        key: string;
        path: string;
    }
}

export type VolumeSpecType = {
    name: string;
    configMap?: ConfigMapVolumeType;
    hostPath?: HostPathVolumeType;
}

export type VolumeType = {
    apiVersion: 'v1';
    kind: 'Volume';
    metadata: VolumeMetadata;
    spec?: VolumeSpecType;
}