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
    public abstract readonly operationSymbol: string
    public get operationSymbolHtml(): JQuery<HTMLElement> | string{
        return this.operationSymbol
    }
    public abstract readonly neutralElement: number
    public requiresOperationSymbol(item:AbelianTermItem){
        return true
    }
    public toDisplayableWithoutModifier(term: Term, params:DisplayParams): JQuery<HTMLElement> | string {
        return term.toDisplayable(params)
    }
    public abstract toDisplayableWithModifier(item: AbelianTermItem, params:DisplayParams): JQuery<HTMLElement> | string
    public itemToDisplayable(item: AbelianTermItem, params:DisplayParams): JQuery<HTMLElement> | string {
        if (item.constantModifier == 1)
            return this.toDisplayableWithoutModifier(item.actualTerm, params)
        else
            return this.toDisplayableWithModifier(item, params)
    }
    public toDisplayable(params:DisplayParams): JQuery<HTMLElement> {
        let result = $("<span/>")
        if (this.terms.array.length == 0)
            result.append(this.neutralElement.toString())
        else
        {
            let isFirst = true
            for (const term of this.terms.array) {
                if(isFirst) isFirst = false
                else if (this.requiresOperationSymbol(term))
                    result.append(params.preferString ? this.operationSymbol : this.operationSymbolHtml)
                if (params.clickable)
                    result.append(clickable(this.itemToDisplayable(term, params.unclickable()), () => {
                        if (context.currentEquation == undefined) return
                        const newEquation = context.currentEquation.apply(this.getInverter(term))
                        context.addNewEquation(newEquation)
                    }))
                else result.append(this.itemToDisplayable(term, params))
            }
        }
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
