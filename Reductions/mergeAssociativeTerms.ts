function mergeAssociativeTerms(term: Term): Term {
    if (!(term instanceof AbelianTerm))
        return term;
    let result: AbelianTermItem[] = [];
    let didReductions = false;
    for (const subTerm of term.terms.array) {
        if (subTerm.constantModifier == 1 && Object.getPrototypeOf(subTerm.actualTerm) === Object.getPrototypeOf(term)) {
            didReductions = true;
            result.push(...(subTerm.actualTerm as AbelianTerm).terms.array);
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