export type PortType = {
    port: number;
    name: string;
}



export type PortLink = {
    targetPort?: number;
} | PortType

