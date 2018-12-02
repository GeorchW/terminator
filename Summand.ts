/// <reference path="./AbelianTerm.ts" />

class Sum extends AbelianTerm {
    public operationSymbol = "+"
    public neutralElement = 0
    public toStringWithModifier(item: AbelianTermItem): string {
        const modifierString = (Math.abs(item.constantModifier) == 1)?
            (item.constantModifier > 0 ? "+" : "-"):
            (item.constantModifier.toString())
        return modifierString + item.actualTerm
    }
    public createNew(terms: (AbelianTermItem | Term)[]): AbelianTerm {
        return new Sum(terms)
    }
}