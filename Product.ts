class Product extends AbelianTerm {
    reductions = AbelianTerm.abelianReductions.concat([moveConstantFactorToFront, unifyConstantFactors])
    public operationSymbol = "*"
    public get operationSymbolHtml() { return "&#8729;" } // this is the unicode cdot
    public neutralElement = 1
    private toDisplayableWithoutModifier(term: Term, params: DisplayParams, mayNeedBrackets:boolean): string | JQuery<HTMLElement> {
        if (term instanceof Sum && mayNeedBrackets) {
            return $("<span/>").append("(", term.toDisplayable(params), ")")
        }
        return term.toDisplayable(params)
    }
    private toDisplayableWithModifier(item: AbelianTermItem, params: DisplayParams): string | JQuery<HTMLElement> {
        const baseTerm = this.toDisplayableWithoutModifier(item.actualTerm, params, true)
        if (params.preferString)
            return $("<span/>").append(baseTerm, "^", item.constantModifier.toString())
        else
            return $("<span/>").append(baseTerm, $("<sup/>").append(item.constantModifier.toString()))
    }
    private itemToDisplayable(item: AbelianTermItem, params: DisplayParams, mayNeedBrackets:boolean): JQuery<HTMLElement> | string {
        if (item.constantModifier == 1)
            return this.toDisplayableWithoutModifier(item.actualTerm, params, mayNeedBrackets)
        else
            return this.toDisplayableWithModifier(item, params)
    }
    public toDisplayable(params: DisplayParams): JQuery<HTMLElement> {
        const result = $("<span/>").attr("class", "product")
        if (this.terms.array.length == 0)
            result.append(this.neutralElement.toString())
        else {
            const dividend: AbelianTermItem[] = []
            const divisor: AbelianTermItem[] = []
            for (const term of this.terms.array) {
                const target = term.constantModifier > 0 ? dividend : divisor
                target.push(term)
            }
            function toDisplayable(terms: AbelianTermItem[], product: Product) : JQuery<HTMLElement> {
                const result = $("<span/>")
                var i = 0
                for (const term of terms) {
                    const displayedTerm = new AbelianTermItem(Math.abs(term.constantModifier), term.actualTerm)
                    if (i != 0){ 
                        const sumTerms = []
                        const lastTerm = terms[i-1].actualTerm
                        if(lastTerm instanceof Sum) sumTerms.push(lastTerm)
                        if(term.actualTerm instanceof Sum) sumTerms.push(term)
                        var onOpClick : JQuery.EventHandler<HTMLElement> | JQuery.EventHandlerBase<any, JQuery.Event> | false = false
                        if(sumTerms.length == 1){
                            onOpClick = () => alert("TODO: apply distributive law")
                        }
                        if(sumTerms.length > 1){
                            onOpClick = () => alert("TODO: popup asking where distributive law should be applied")
                        }
                        result.append(clickable(params.preferString ? product.operationSymbol : product.operationSymbolHtml, onOpClick))
                    }
                    var onClick = () => {
                        if (context.currentEquation == undefined) return
                        const newEquation = context.currentEquation.apply(product.getInverter(term))
                        context.addNewEquation(newEquation)
                    }
                    result.append(clickable(
                        product.itemToDisplayable(displayedTerm, params.unclickable(), terms.length > 1),
                        params.clickable ? onClick : false))

                    i += 1
                }
                return result
            }
            if (divisor.length == 0) result.append(toDisplayable(dividend, this))
            else {
                const dividendElement = toDisplayable(dividend, this)
                const divisorElement = toDisplayable(divisor, this)
                result.addClass("fraction")
                if (dividend.length == 0) dividendElement.append("1")
                if (params.preferString)
                    result.append(dividendElement, " / (", divisorElement, ")")
                else
                    result.append(dividendElement, $("<hr/>"), divisorElement)
            }

        }
        return result
    }
    public createNew(terms: (AbelianTermItem | Term)[]): AbelianTerm {
        return new Product(terms)
    }
}