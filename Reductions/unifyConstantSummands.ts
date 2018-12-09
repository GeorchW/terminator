function unifyConstantSummands(term: Term): Term {
    if (term instanceof Sum) {
        let constantSummands: number[] = [0]
        let nonConstantFactors: AbelianTermItem[] = []
        let hasNonUniformConstants = false
        for (const subterm of term.terms.array)
            if (subterm.actualTerm instanceof Constant){
                if(subterm.constantModifier != 1)
                    hasNonUniformConstants = true
                constantSummands.push(subterm.actualTerm.value * subterm.constantModifier)
            }
            else
                nonConstantFactors.push(subterm)
        if (constantSummands.length > 2 || hasNonUniformConstants) {
            return term.createNew([
                new AbelianTermItem(1, new Constant(constantSummands.reduce((x, y) => x + y))),
                ...nonConstantFactors])
        }
    }
    return term
}