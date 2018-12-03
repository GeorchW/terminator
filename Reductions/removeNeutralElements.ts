function removeNeutralElements(term: Term): Term {
    if (term instanceof AbelianTerm) {
        let newTerms = [];
        let hasChange = false;
        for (const subterm of term.terms.array)
            if (subterm.actualTerm instanceof Constant)
                newTerms.push(new AbelianTermItem(subterm.actualTerm.value * subterm.constantModifier, new Constant(term.neutralElement)));
            else
                newTerms.push(subterm);
        if (hasChange)
            return term.createNew(newTerms);
    }
    return term;
}