function replaceProductConstantsBySummandModifiers(term: Term): Term {
    if (term instanceof Sum) {
        let newSubTerms = [];
        let hasChanges = false;
        for (const subterm of term.terms.array)
            if (subterm.actualTerm instanceof Product) {
                let newSubsubTerms = [];
                let constant = subterm.constantModifier;
                for (const subsubterm of subterm.actualTerm.terms.array) {
                    if (subsubterm.actualTerm instanceof Constant) {
                        hasChanges = true
                        constant *= Math.pow(subsubterm.actualTerm.value, subsubterm.constantModifier);
                    }
                    else
                        newSubsubTerms.push(subsubterm);
                }
                newSubTerms.push(new AbelianTermItem(constant, new Product(newSubsubTerms).reduce()));
            }
            else
                newSubTerms.push(subterm);
        if (hasChanges)
            return new Sum(newSubTerms);
    }
    return term;
}