export type Artefact = { 
    name:string;  
    rootSourceFile: string;   
}

export type CLibrary = {  
    sources: string[];   
    flags: string[];
    macros: Record<string,string>;
} & Artefact

export type Exe = { 
} & Artefact


export interface Builder {
    addCLibrary(lib:CLibrary):void;
}
