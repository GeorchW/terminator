/// <reference path="Term.ts" />
// Common base class for Sum and Product.
abstract class AbelianTerm extends Term {
    public static readonly abelianReductions = [
        mergeAssociativeTerms, 
        removeNeutralElements, 
        removeIdentityOperations, 
        replaceEmptySetWithNeutralElement]
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
    public abstract readonly neutralElement: number
    public getInverter(termItem: AbelianTermItem): TermTransformer {
        return term => {
            const newTerm = this.createNew([term, new AbelianTermItem(-1 * termItem.constantModifier, termItem.actualTerm)])
            return newTerm.reduce()
        }
    }
    protected getReplacer(item: AbelianTermItem, replaceSelf: TermReplacer): TermReplacer {
        return newTerm => replaceSelf(
            this.createNew(
                this.terms.array.map(originalItem =>
                    originalItem == item ?
                        new AbelianTermItem(item.constantModifier, newTerm) :
                        originalItem)))
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
