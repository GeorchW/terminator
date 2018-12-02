class Product extends AbelianTerm{
    public operationSymbol = "&#8729;" // this is the unicode cdot
    public neutralElement = 1
    public toStringWithModifier(item: AbelianTermItem): string {
        return item.actualTerm.toString() + "^" + item.constantModifier
    }
    public createNew(terms: (AbelianTermItem | Term)[]): AbelianTerm {
        return new Product(terms)
    }
}