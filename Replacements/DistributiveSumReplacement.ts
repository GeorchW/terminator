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
            const includedTerms = []
            const excludedTerms = []
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
                    includedTerms.push(new Product([constant, ...subterm.actualTerm.terms.array, new AbelianTermItem(-1, commonFactor)]))
                }
                else {
                    excludedTerms.push(subterm)
                }
            }
            console.log(commonFactor, includedTerms, excludedTerms)
            result.push(new Sum([new Product([commonFactor, new Sum(includedTerms).reduce()]).reduce(), ...excludedTerms]).reduce())
        }

        return result;
    }
}
