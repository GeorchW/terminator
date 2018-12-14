class Product extends AbelianTerm {
    reductions = AbelianTerm.abelianReductions.concat([moveConstantFactorToFront, unifyConstantFactors])
    replacementRules = [new DistributiveProductReplacement()]
    public operationSymbol = "*"
    public get operationSymbolHtml() { return "&#8729;" } // this is the unicode cdot
    public neutralElement = 1
    private toDisplayableWithoutModifier(term: Term, params: DisplayParams, mayNeedBrackets: boolean, replaceTerm: TermReplacer): string | JQuery<HTMLElement> {
        if (term instanceof Sum && mayNeedBrackets) {
            return $("<span/>").append("(", term.toDisplayable(params, replaceTerm), ")")
        }
        return term.toDisplayable(params, replaceTerm)
    }
    private toDisplayableWithModifier(item: AbelianTermItem, params: DisplayParams, replaceItem: TermReplacer): string | JQuery<HTMLElement> {
        const baseTerm = this.toDisplayableWithoutModifier(item.actualTerm, params, true, replaceItem)
        if (params.preferString)
            return $("<span/>").append(baseTerm, "^", item.constantModifier.toString())
        else
            return $("<span/>").append(baseTerm, $("<sup/>").append(item.constantModifier.toString()))
    }
    private itemToDisplayable(item: AbelianTermItem, params: DisplayParams, mayNeedBrackets: boolean, replaceItem: TermReplacer): JQuery<HTMLElement> | string {
        if (item.constantModifier == 1)
            return this.toDisplayableWithoutModifier(item.actualTerm, params, mayNeedBrackets, replaceItem)
        else
            return this.toDisplayableWithModifier(item, params, replaceItem)
    }
    public toDisplayable(params: DisplayParams, replaceSelf: TermReplacer): JQuery<HTMLElement> {
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
            function toDisplayable(terms: AbelianTermItem[], product: Product): JQuery<HTMLElement> {
                const result = $("<span/>")
                var i = 0
                for (const term of terms) {
                    const displayedTerm = new AbelianTermItem(Math.abs(term.constantModifier), term.actualTerm)
                    if (i != 0) {
                        const sumTerms: AbelianTermItem[] = []
                        const lastTerm = terms[i - 1]
                        if (lastTerm.actualTerm instanceof Sum && lastTerm.constantModifier == 1) sumTerms.push(lastTerm)
                        if (term.actualTerm instanceof Sum && term.constantModifier == 1) sumTerms.push(term)
                        var onOpClick: JQuery.EventHandler<HTMLElement> | JQuery.EventHandlerBase<any, JQuery.Event> | false = false
                        if (sumTerms.length == 1) {
                            onOpClick = () => {
                                const replacedSumTerm = sumTerms[0]
                                const remainingProductTerms = product.terms.array.filter(item => item != replacedSumTerm)
                                const replacement = new Sum(
                                    (replacedSumTerm.actualTerm as Sum).terms.array.map(originalTerm =>
                                        new Product([
                                            new Constant(originalTerm.constantModifier),
                                            originalTerm.actualTerm,
                                            ...remainingProductTerms]).reduce())
                                ).reduce()
                                context.addNewEquation(replaceSelf(replacement))
                            }
                        }
                        if (sumTerms.length > 1) {
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
                        product.itemToDisplayable(displayedTerm, params.untransformable(), terms.length > 1, product.getReplacer(displayedTerm, replaceSelf)),
                        params.transformable ? onClick : false))

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