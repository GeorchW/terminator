class DistributiveProductReplacement extends TermReplacementRule {
    public name = "Distributive law";
    public examples = ["a*(b+c)"];
    public getReplacements(term: Term): Term[] {
        if (!(term instanceof Product))
            return [];
        const result = [];
        var i = 0;
        const terms = term.terms.array;
        for (const subTerm of terms) {
            if (subTerm.actualTerm instanceof Sum && subTerm.constantModifier == 1) {
                const remainingProductTerms = term.terms.array.filter(item => item != subTerm);
                const replacement = new Sum((subTerm.actualTerm as Sum).terms.array.map(originalTerm => new Product([
                    new Constant(originalTerm.constantModifier),
                    originalTerm.actualTerm,
                    ...remainingProductTerms
                ]).reduce())).reduce();
                result.push(replacement);
            }
            i += 1;
        }
        return result;
    }
}
