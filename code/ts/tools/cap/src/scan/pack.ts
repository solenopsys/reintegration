type Hash = string;

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

type Pack = ( // binary structure format
    number[] | // pack fields
    Hash[] | // union 
    Hash // links
)[];

type Struct = { //Struct for code generating
    hash: Hash;
    name: string;
    fields: {
        name: string;
        offset: number;
        type: FieldType|Hash[];
    }[];
}

type Enum = { //Enum for code generating
    key: string,
    value: number
}[]

type Interface = { //Interface for code generating
    name: string;
    params: Hash;
    result: Hash;
}[]

type Schema = Hash[]; 

type SchemaFile = {[hash:Hash]:string}; // file pack