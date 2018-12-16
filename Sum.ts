class Sum extends AbelianTerm {
    reductions = AbelianTerm.abelianReductions.concat([
        replaceProductConstantsBySummandModifiers,
        replaceLonelySumWithProduct,
        moveConstantSummandsToBack,
        unifyConstantSummands])
    replacementRules = [new DistributiveSumReplacement()]
    public operationSymbol = "+"
    public neutralElement = 0
    private toDisplayableWithModifier(item: AbelianTermItem, params: DisplayParams, replaceSelf: TermReplacer): JQuery<HTMLElement> {
        var result = $("<span/>")
        var displayModifierNumber = Math.abs(item.constantModifier) != 1
        const modifierString = displayModifierNumber ?
            item.constantModifier.toString() :
            (item.constantModifier > 0 ? "+" : "-")
        result.append($("<span/>").append(modifierString))
        if (displayModifierNumber){
            const multiplicationSymbol = params.preferString ? "*" : "&#8729;"
            const multiplicationSymbolHtml = clickable(multiplicationSymbol, () => {
                new Product([new Constant(item.constantModifier), item.actualTerm]).showReplacementsMenu(params.context, this.getReplacer(item, replaceSelf, false), result)
            })
            result.append($("<span/>").append(params.replaceable ? multiplicationSymbolHtml : multiplicationSymbol))
        }
        const actualTermHtml = item.actualTerm.toDisplayable(params, this.getReplacer(item, replaceSelf))
        result.append(actualTermHtml)
        if(item.actualTerm instanceof Sum)
            result.append("(", actualTermHtml, ")")
        else result.append(actualTermHtml)
        return result
    }
    private toDisplayableWithoutModifier(item: AbelianTermItem, params: DisplayParams, replaceSelf: TermReplacer): JQuery<HTMLElement> | string {
        return item.actualTerm.toDisplayable(params, this.getReplacer(item, replaceSelf))
    }
    private itemToDisplayable(item: AbelianTermItem, params: DisplayParams, replaceSelf: TermReplacer): JQuery<HTMLElement> | string {
        if (item.constantModifier == 1)
            return this.toDisplayableWithoutModifier(item, params, replaceSelf)
        else
            return this.toDisplayableWithModifier(item, params, replaceSelf)
    }
    public toDisplayable(params: DisplayParams, replaceSelf: TermReplacer): JQuery<HTMLElement> {
        let result = $("<span/>").addClass("sum")
        if (this.terms.array.length == 0)
            result.append(this.neutralElement.toString())
        else {
            let isFirst = true
            for (const term of this.terms.array) {
                if (isFirst) isFirst = false
                else if (term.constantModifier > 0)
                    result.append(clickable(this.operationSymbol,
                        params.replaceable ? () => this.showReplacementsMenu(params.context, replaceSelf, result) : false))
                const onClick = () => {
                    if (params.context.currentEquation == undefined) return
                    const newEquation = params.context.currentEquation.apply(this.getInverter(term))
                    params.context.addNewEquation(newEquation)
                }
                result.append(clickable(this.itemToDisplayable(term, params.untransformable(), replaceSelf), params.transformable ? onClick : false))
            }
        }
        return result
    }
    public createNew(terms: (AbelianTermItem | Term)[]): AbelianTerm {
        return new Sum(terms)
    }
}