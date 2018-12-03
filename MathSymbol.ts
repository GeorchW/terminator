class MathSymbol extends Term {
    readonly hash: number;
    equals(other: any): boolean {
        if (other instanceof MathSymbol)
            return other.name == this.name;
        else
            return false;
    }
    constructor(public name: string) {
        super()
        this.hash = stringHash(name);
    }
    public toString(): string {
        return this.name;
    }
    public toClickable(context: EquationContext): JQuery<HTMLElement> {
        return $("<span/>").append(this.name)
    }
    public checkReducable(): boolean {
        return false
    }
    public reduce(): Term {
        return this
    }
}