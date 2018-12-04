class Product extends AbelianTerm {
    reductions = AbelianTerm.abelianReductions.concat([moveConstantFactorToFront])
    public operationSymbol = "*"
    public get operationSymbolHtml() { return "&#8729;" } // this is the unicode cdot
    public neutralElement = 1
    private toDisplayableWithoutModifier(term: Term, params: DisplayParams): string | JQuery<HTMLElement> {
        if (term instanceof Sum) {
            return $("<span/>").append("(", term.toDisplayable(params), ")")
        }
        return term.toDisplayable(params)
    }
    private toDisplayableWithModifier(item: AbelianTermItem, params: DisplayParams): string | JQuery<HTMLElement> {
        const baseTerm = this.toDisplayableWithoutModifier(item.actualTerm, params)
        if (params.preferString)
            return $("<span/>").append(baseTerm, "^", item.constantModifier.toString())
        else
            return $("<span/>").append(baseTerm, $("<sup/>").append(item.constantModifier.toString()))
    }
    private itemToDisplayable(item: AbelianTermItem, params:DisplayParams): JQuery<HTMLElement> | string {
        if (item.constantModifier == 1)
            return this.toDisplayableWithoutModifier(item.actualTerm, params)
        else
            return this.toDisplayableWithModifier(item, params)
    }
    public toDisplayable(params:DisplayParams): JQuery<HTMLElement> {
        let result = $("<span/>").attr("class", "product")
        if (this.terms.array.length == 0)
            result.append(this.neutralElement.toString())
        else
        {
            const targetDividend = {target:$("<span/>"), empty:true}
            const targetDivisor = {target:$("<span/>"), empty:true}
            for (const term of this.terms.array) {
                const target = term.constantModifier > 0 ? targetDividend : targetDivisor
                if(target.empty) target.empty = false
                else target.target.append(params.preferString ? this.operationSymbol : this.operationSymbolHtml)
                if (params.clickable)
                    target.target.append(
                        clickable(
                            this.itemToDisplayable(
                                new AbelianTermItem(
                                    Math.abs(term.constantModifier),
                                    term.actualTerm), 
                                params.unclickable()), () => {
                        if (context.currentEquation == undefined) return
                        const newEquation = context.currentEquation.apply(this.getInverter(term))
                        context.addNewEquation(newEquation)
                    }))
                else target.target.append(this.itemToDisplayable(term, params))
            }
            if(targetDivisor.empty) result.append(targetDividend.target)
            else {
                if(targetDividend.empty) targetDividend.target.append("1")
                result.append(targetDividend.target, $("<hr/>"), targetDivisor.target)
            }
            
        }
        return result
    }
    public createNew(terms: (AbelianTermItem | Term)[]): AbelianTerm {
        return new Product(terms)
    }
}