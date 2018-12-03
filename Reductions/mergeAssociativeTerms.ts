function mergeAssociativeTerms(term: Term): Term {
    if (!(term instanceof AbelianTerm))
        return term;
    let result: AbelianTermItem[] = [];
    let didReductions = false;
    for (const subTerm of term.terms.array) {
        const reduced = subTerm.actualTerm.reduce();
        if (Object.getPrototypeOf(reduced) === Object.getPrototypeOf(term)) {
            didReductions = true;
            for (const subterm of (reduced as AbelianTerm).terms.array) {
                result.push(new AbelianTermItem(subTerm.constantModifier * subterm.constantModifier, subterm.actualTerm));
            }
        }
        else {
            result.push(subTerm);
        }
    }
    if (!didReductions)
        return term;
    else
        return term.createNew(result);
}