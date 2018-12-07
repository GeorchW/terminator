function removeInvertedFuctions(term: Term): Term {
    if (term instanceof MathFunctionInstance) {
        if (term.innerTerm instanceof MathFunctionInstance) {
            if (term._function.inverse.equals(term.innerTerm._function)) {
                return term.innerTerm.innerTerm
            }
        }
    }
    return term
}
