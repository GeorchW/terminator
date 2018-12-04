class Constant extends Term {
    get hash(): number { return this.value; }
    constructor(public readonly value: number) { super(); }
    equals(other: any): boolean {
        return other instanceof Constant && this.value == other.value;
    }
    public toDisplayable(): JQuery<HTMLElement> {
        return $("<span/>").append(this.value.toString());
    }
}