class DistributiveSumReplacement extends TermReplacementRule {
    public name = "Distributive law";
    public examples = ["a*b+a*c"];
    public getReplacements(term: Term): Term[] {
        if (!(term instanceof Sum))
            return []
        const result = []

        // Algorithm idea:
        // 1. Collect all factors.
        // 2. Throw out all factors appearing only once.
        // 2. Apply law of distributivity using these factors.

        // Step 1
        const factors = []
        for (const subterm of term.terms.array) {
            factors.push(new Constant(subterm.constantModifier))
            if (subterm.actualTerm instanceof Product) {
                factors.push(...subterm.actualTerm.terms.array.map(term => term.constantModifier != 1 ? new Product([term]) : term.actualTerm))
            }
            else {
                factors.push(subterm.actualTerm)
            }
        }

        // Step 2
        const accumulated = new Accumulator(
            factors.map((x): [Term, number] => [x, 1]),
            (a, b) => a + b)
        const factorsAppearingMultipleTimes = accumulated.array.filter(x => x[1] > 1)

        // Step 3
        for (const [commonFactor, appearances] of factorsAppearingMultipleTimes) {
            if (commonFactor.equals(new Constant(1))) continue //trying to convert a+b to 1*(a+b) is nonsense

            // We want to have a term of the form
            //     commonFactor * sum(includedTerms) + sum(excludedTerms)
            // at the end.
            // To be exact, the terms should be moved as little as possible.
            // Therefore, we're doing this instead:
            //    sum(excludedTermsBefore) + commonFactor * sum(includedTerms) + sum(excludedTermsAfter)
            // E.g. a transformation from
            //    x + a*b + a*c + y
            // should be transformed into
            //    x + a*(b+c) + y
            // instead of
            //    a*(b+c) + x + y
            const includedTerms = []
            const excludedTermsBeforeProduct: AbelianTermItem[] = []
            const excludedTermsAfterProduct: AbelianTermItem[] = []
            function addExcludedTerm(term: AbelianTermItem) {
                if (includedTerms.length == 0)
                    excludedTermsBeforeProduct.push(term)
                else excludedTermsAfterProduct.push(term)
            }
            for (const subterm of term.terms.array) {
                const constant = new Constant(subterm.constantModifier)
                if (constant.equals(commonFactor)) {
                    includedTerms.push(subterm.actualTerm)
                }
                else if (subterm.actualTerm.equals(commonFactor)) {
                    includedTerms.push(constant)
                }
                else if (subterm.actualTerm instanceof Product
                    && subterm.actualTerm.terms.array.some(subsubterm => subsubterm.actualTerm.equals(commonFactor) && subsubterm.constantModifier > 0)) {
                    includedTerms.push(new Product([constant, ...subterm.actualTerm.terms.array, new AbelianTermItem(-1, commonFactor)]).reduce())
                }
                else {
                    addExcludedTerm(subterm)
                }
            }
            result.push(new Sum([...excludedTermsBeforeProduct, new Product([commonFactor, new Sum(includedTerms).reduce()]).reduce(), ...excludedTermsAfterProduct]).reduce())
        }

        return result;
    }
}
