export enum NodeType {
    Struct = 'struct',
    Enum = 'enum',
    Interface = 'interface',
}

export enum FieldType {
    // simple types
    Integer8 = 'integer8',
    Integer16 = 'integer16',
    Integer32 = 'integer32',
    Integer64 = 'integer64',
    Unsigned8 = 'unsigned8',
    Unsigned6 = 'unsigned16',
    Unsigned32 = 'unsigned32',
    Unsigned64 = 'unsigned64',
    Float32 = 'float32',
    Float64 = 'float64',
    Bool = 'bool',
    // bytes
    String = 'string',
    Bytes = 'bytes',
    // link types 
    Struct = 'struct',
    Enum = 'enum',
    Interface = 'interface',
    // special types
    Array = 'array',
    Union = 'union', // several types and one active
    Group = 'group', // sub felds group
  //  Void = 'void',
}

 
export interface Node<T extends NodeType>  {
    name : string;
    nodeType: T;
}

export interface SchemaField {
    name: string;
    type: FieldType;
    offset: number;
    defaultValue?: any;
}

export interface UnionField extends SchemaField {
    discriminantOffset: number;
    unionFields: SchemaField[];
}

export interface InterfaceMethod extends Node<NodeType.Interface> {
    paramStruct: StructNode;
    resultStruct: StructNode;
}

export interface StructNode extends Node<NodeType.Struct> {
    dataWordCount: number;
    pointerCount: number;
    fields: SchemaField[];
}

export interface EnumNode extends Node<NodeType.Enum> {
    enumerants: string[];
}

export interface InterfaceNode extends Node<NodeType.Interface> {
    methods: InterfaceMethod[];
}

export type SchemaNode = StructNode | EnumNode | InterfaceNode ;

interface Schema {
    nodes: SchemaNode[];
    version: string;
}

