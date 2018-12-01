class Product implements IHashable {
    readonly hash: number;
    equals(other: any): boolean {
        if (other instanceof Product)
            return other.factorSet.equals(this.factorSet);
        else
            return false;
    }
    readonly factorSet: OrderedFrozenSet<MathSymbol>;
    constructor(public readonly factors: MathSymbol[]) {
        this.factorSet = new OrderedFrozenSet(factors);
        this.hash = this.factorSet.hash;
    }
}