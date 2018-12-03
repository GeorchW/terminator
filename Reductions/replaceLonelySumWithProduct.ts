function replaceLonelySumWithProduct(term: Term): Term {
    if (!(term instanceof Sum))
        return term;
    if (term.terms.array.length == 1)
        return new Product([term.terms.array[0].actualTerm, new Constant(term.terms.array[0].constantModifier)]);
    else
        return term;
}