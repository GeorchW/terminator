abstract class Term implements IHashable {
    abstract hash: number;
    abstract equals(other: any): boolean;
    public reduce(): Term {
        let result: Term = this
        let lastResult: Term
        let appliedReductions = 0
        do {
            lastResult = result
            for (const reduction of this.reductions) {
                result = reduction(result)
                if (result != lastResult) {
                    console.log("Successfully applied reduction " + reduction)
                    console.log("Old => new:", lastResult.toString(), result.toString())
                    console.log("Old => new:", [lastResult, result])
                    appliedReductions++
                    break
                }
            }
            if (appliedReductions > 20) {
                console.log("Too many reductions; breaking.", appliedReductions)
                break
            }
        }
        while (result != lastResult)
        return result
    }
    protected reductions: Reduction[] = []
    public abstract toClickable(context: EquationContext): JQuery<HTMLElement>
}

interface Reduction {
    (term: Term): Term
}

// Common base class for Sum and Product.
abstract class AbelianTerm extends Term {
    public static readonly abelianReductions = [mergeAssociativeTerms, removeNeutralElements, removeIdentityOperations]//, unifyConstants]
    reductions = AbelianTerm.abelianReductions
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
