abstract class Term implements IHashable {
    abstract hash: number;
    abstract equals(other: any): boolean;
    public canReduce(): boolean { return false }
    public reduce(): Term { return this }
    public abstract toClickable(context: EquationContext): JQuery<HTMLElement>
}

// Common base class for Sum and Product.
abstract class AbelianTerm extends Term {
    readonly hash: number
    equals(other: any): boolean {
        if (other instanceof AbelianTerm)
            return typeof (other) == typeof (this) &&
                other.terms.equals(this.terms)
        else
            return false;
    }
    public readonly terms: OrderedFrozenSet<AbelianTermItem>;
    constructor(terms: (AbelianTermItem | Term)[]) {
        super();
        const mappedTerms = terms.map((s): [Term, number] => {
            if (s instanceof AbelianTermItem)
                return [s.actualTerm, s.constantModifier] as [Term, number];
            else
                return [s, 1];
        });
        const accumulated = new Accumulator(mappedTerms, (a, b) => a + b);
        this.terms = new OrderedFrozenSet(
            accumulated.array
                .map(pair => new AbelianTermItem(pair[1], pair[0]))
                .filter(summand => summand.constantModifier != 0));
        this.hash = this.terms.hash;
    }
    public abstract readonly operationSymbol: string
    public abstract readonly neutralElement: number
    public toStringWithoutModifier(item: AbelianTermItem): string {
        return item.actualTerm.toString()
    }
    public abstract toStringWithModifier(item: AbelianTermItem): string
    public itemToString(item: AbelianTermItem): string {
        if (item.constantModifier == 1)
            return this.toStringWithoutModifier(item)
        else
            return this.toStringWithModifier(item)
    }
    public toString(): string {
        return "(" + this.terms.array.map(item => this.itemToString(item)).join(this.operationSymbol) + ")"
    }
    public toClickable(context: EquationContext): JQuery<HTMLElement> {
        let result = $("<span/>")
        if (this.terms.array.length == 0)
            result.append(this.neutralElement.toString())
        else
            for (const term of this.terms.array) {
                result.append(this.operationSymbol)
                result.append(clickable(this.itemToString(term), () => {
                    if (context.currentEquation == undefined) return
                    const newEquation = context.currentEquation.apply(this.getInverter(term))
                    context.addNewEquation(newEquation)
                }))
            }
        //result.prepend("(").append(")")
        return result
    }
    public getInverter(termItem: AbelianTermItem): TermTransformer {
        return term => {
            const newTerm = this.createNew([term, new AbelianTermItem(-1 * termItem.constantModifier, termItem.actualTerm)])
            return newTerm.reduce()
        }
    }
    public abstract createNew(terms: (AbelianTermItem | Term)[]): AbelianTerm
    public canReduce(): boolean {
        return this.isIdentity() || this.canReduceChildren()
    }
    private canReduceChildren(): boolean {
        return (this.terms.array.some(term => term.actualTerm.canReduce() || Object.getPrototypeOf(term.actualTerm) === Object.getPrototypeOf(this)));
    }

    public reduce(): Term {
        if (this.canReduceChildren()) {
            return this.reduceChildren();
        }
        else return this.reduceIdentity()
    }

    private reduceChildren() {
        let result: AbelianTermItem[] = [];
        for (const term of this.terms.array) {
            const reduced = term.actualTerm.reduce();
            if (Object.getPrototypeOf(reduced) === Object.getPrototypeOf(this)) {
                for (const subterm of (reduced as AbelianTerm).terms.array) {
                    result.push(new AbelianTermItem(term.constantModifier * subterm.constantModifier, subterm.actualTerm));
                }
            }
            else {
                result.push(term);
            }
        }
        return this.createNew(result).reduceIdentity();
    }

    private isIdentity(): boolean {
        return (this.terms.array.length == 1 && this.terms.array[0].constantModifier == 1);
    }

    private reduceIdentity(): Term {
        if (this.isIdentity()) {
            return this.terms.array[0].actualTerm.reduce();
        }
        else return this
    }
}

class AbelianTermItem {
    readonly hash: number;
    equals(other: any): boolean {
        if (other instanceof AbelianTermItem)
            return other.constantModifier == this.constantModifier
                && other.actualTerm.equals(this.actualTerm);
        else
            return false;
    }
    constructor(public readonly constantModifier: number,
        public readonly actualTerm: Term) {
        this.hash = actualTerm.hash ^ (constantModifier << 1)
    }
}
