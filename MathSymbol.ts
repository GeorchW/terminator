class MathSymbol implements IHashable {
    readonly hash: number;
    equals(other: any): boolean {
        if (other instanceof MathSymbol)
            return other.name == this.name;
        else
            return false;
    }
    constructor(public name: string) {
        this.hash = stringHash(name);
    }
    public toString(): string {
        return this.name;
    }
}