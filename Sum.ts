class Sum extends AbelianTerm {
    reductions = AbelianTerm.abelianReductions.concat([
        replaceProductConstantsBySummandModifiers,
        replaceLonelySumWithProduct,
        moveConstantSummandsToBack,
        unifyConstantSummands])
    public operationSymbol = "+"
    public neutralElement = 0
    private toDisplayableWithModifier(item: AbelianTermItem, params: DisplayParams, replaceItem: TermReplacer): JQuery<HTMLElement> {
        var result = $("<span/>")
        var displayModifierNumber = Math.abs(item.constantModifier) != 1
        const modifierString = displayModifierNumber ?
            item.constantModifier.toString() :
            (item.constantModifier > 0 ? "+" : "-")
        result.append($("<span/>").append(modifierString))
        if (displayModifierNumber)
            result.append($("<span/>").append(params.preferString ? "*" : "&#8729;"))
        result.append(item.actualTerm.toDisplayable(params, replaceItem))
        return result
    }
    private requiresOperationSymbol(term: AbelianTermItem) {
        return term.constantModifier > 0
    }
    private toDisplayableWithoutModifier(term: Term, params: DisplayParams, replaceItem: TermReplacer): JQuery<HTMLElement> | string {
        return term.toDisplayable(params, replaceItem)
    }
    private itemToDisplayable(item: AbelianTermItem, params: DisplayParams, replaceItem: TermReplacer): JQuery<HTMLElement> | string {
        if (item.constantModifier == 1)
            return this.toDisplayableWithoutModifier(item.actualTerm, params, replaceItem)
        else
            return this.toDisplayableWithModifier(item, params, replaceItem)
    }
    public toDisplayable(params: DisplayParams, replaceSelf: TermReplacer): JQuery<HTMLElement> {
        let result = $("<span/>")
        if (this.terms.array.length == 0)
            result.append(this.neutralElement.toString())
        else {
            let isFirst = true
            for (const term of this.terms.array) {
                if (isFirst) isFirst = false
                else if (this.requiresOperationSymbol(term))
                    result.append(this.operationSymbol)
                const onClick = () => {
                    if (context.currentEquation == undefined) return
                    const newEquation = context.currentEquation.apply(this.getInverter(term))
                    context.addNewEquation(newEquation)
                }
                result.append(clickable(this.itemToDisplayable(term, params.untransformable(), this.getReplacer(term, replaceSelf)), params.transformable ? onClick : false))
            }
        }
        return result
    }
    public createNew(terms: (AbelianTermItem | Term)[]): AbelianTerm {
        return new Sum(terms)
    }
}