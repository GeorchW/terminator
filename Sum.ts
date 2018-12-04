class Sum extends AbelianTerm {
    reductions = AbelianTerm.abelianReductions.concat([replaceProductConstantsBySummandModifiers, replaceLonelySumWithProduct])
    public operationSymbol = "+"
    public neutralElement = 0
    private toDisplayableWithModifier(item: AbelianTermItem, params:DisplayParams): JQuery<HTMLElement> {
        const modifierString = (Math.abs(item.constantModifier) == 1) ?
            (item.constantModifier > 0 ? "+" : "-") :
            (item.constantModifier.toString())
        return $("<span/>").append(modifierString).append(item.actualTerm.toDisplayable(params))
    }
    private requiresOperationSymbol(term:AbelianTermItem){
        return term.constantModifier > 0
    }
    private toDisplayableWithoutModifier(term: Term, params:DisplayParams): JQuery<HTMLElement> | string {
        return term.toDisplayable(params)
    }
    private itemToDisplayable(item: AbelianTermItem, params:DisplayParams): JQuery<HTMLElement> | string {
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
                    result.append(this.operationSymbol)
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
    public createNew(terms: (AbelianTermItem | Term)[]): AbelianTerm {
        return new Sum(terms)
    }
}