class Sum extends AbelianTerm {
    reductions = AbelianTerm.abelianReductions.concat([replaceProductConstantsBySummandModifiers, replaceLonelySumWithProduct])
    public operationSymbol = "+"
    public neutralElement = 0
    public toDisplayableWithModifier(item: AbelianTermItem, params:DisplayParams): JQuery<HTMLElement> {
        const modifierString = (Math.abs(item.constantModifier) == 1) ?
            (item.constantModifier > 0 ? "+" : "-") :
            (item.constantModifier.toString())
        return $("<span/>").append(modifierString).append(item.actualTerm.toDisplayable(params))
    }
    public requiresOperationSymbol(term:AbelianTermItem){
        return term.constantModifier > 0
    }
    public createNew(terms: (AbelianTermItem | Term)[]): AbelianTerm {
        return new Sum(terms)
    }
}