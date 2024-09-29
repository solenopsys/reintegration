export interface CapSerializer<T> {

    serialize(value: T): Uint8Array;

    serializeTo(value: T, buffer: Uint8Array, offset: number): void;

}

export interface CapDeserializer<T> {

    deserialize(data: Uint8Array): T;

    deserializeFrom(data: Uint8Array, offset: number): T;

}

export interface CapIO<T> extends CapSerializer<T>, CapDeserializer<T> {

}