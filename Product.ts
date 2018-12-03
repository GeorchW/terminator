class Product extends AbelianTerm{
    protected additionalReductions: Reduction[] = []
    public operationSymbol = "*"
    public operationSymbolHtml = "&#8729;" // this is the unicode cdot
    public neutralElement = 1
    public toDisplayableWithoutModifier(term: Term, params:DisplayParams): string | JQuery<HTMLElement> {
        if (term instanceof Sum){
            return $("<span/>").append("(", term.toDisplayable(params), ")")
        }
        return super.toDisplayableWithoutModifier(term, params)
    }
    public toDisplayableWithModifier(item: AbelianTermItem, params:DisplayParams): string | JQuery<HTMLElement> {
        const baseTerm = this.toDisplayableWithoutModifier(item.actualTerm, params)
        if (params.preferString)
            return $("<span/>").append(baseTerm, "^", item.constantModifier.toString())
        else
            return $("<span/>").append(baseTerm, $("<sup/>").append(item.constantModifier.toString()))
    }
    public createNew(terms: (AbelianTermItem | Term)[]): AbelianTerm {
        return new Product(terms)
    }
}