function removeIdentityOperations(term: Term): Term {
    if (!(term instanceof AbelianTerm))
        return term;
    if (term.terms.array.length == 1 && term.terms.array[0].constantModifier == 1) {
        return term.terms.array[0].actualTerm;
    }
    else
        return term;
}

