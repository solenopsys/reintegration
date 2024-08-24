export interface StructPrint {
    export(): any;
}

export abstract class Builder<T> implements StructPrint {
    protected conf!: T

    constructor() {
  
    }

    abstract getName(): string;

 

    public export(): any {
        return this.conf;
    }
}