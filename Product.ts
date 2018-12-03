class Product extends AbelianTerm{
    protected additionalReductions: Reduction[] = []
    public operationSymbol = "&#8729;" // this is the unicode cdot
    public neutralElement = 1
    public toStringWithoutModifier(term: Term): string{
        if (term instanceof Sum){
            return "(" + term.toString() + ")"
        }
        return super.toStringWithoutModifier(term)
    }
    public toStringWithModifier(item: AbelianTermItem): string {
        return this.toStringWithoutModifier(item.actualTerm) + "^" + item.constantModifier
    }
    public createNew(terms: (AbelianTermItem | Term)[]): AbelianTerm {
        return new Product(terms)
    }
}