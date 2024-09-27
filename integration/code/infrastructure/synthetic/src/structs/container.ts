import { PortLink } from "./port";

export type ContainerType = {
    name: string;
    image: string;
    env: {
        [key: string]: string;
    };
    ports: PortLink[];
    volumeMounts: {
        name: string;
        mountPath: string;
        subPath?: string;
        readOnly?: boolean;
    }[];
}