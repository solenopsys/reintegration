

export class VolumeClaim {
    constructor(private name: string, size: string) {
    }

    getName(): string {
        return this.name
    }
}