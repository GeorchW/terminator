function replaceEmptySetWithNeutralElement(term: Term): Term {
    if (!(term instanceof AbelianTerm))
        return term;
    if (term.terms.array.length == 0)
        return new Constant(term.neutralElement);
    else
        return term;
}