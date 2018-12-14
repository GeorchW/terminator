abstract class Term implements IHashable {
    abstract hash: number;
    abstract equals(other: any): boolean;
    public reduce(): Term {
        let result: Term = this;
        let lastResult: Term;
        let appliedReductions = 0;
        do {
            lastResult = result;
            for (const reduction of result.reductions) {
                result = reduction(result);
                if (result != lastResult) {
                    // console.log("Successfully applied reduction " + reduction.name);
                    // console.log("Old => new:", lastResult.toString(), result.toString());
                    // console.log("Old => new:", lastResult, result);
                    appliedReductions++;
                    break;
                }
            }
            if (appliedReductions > 20) {
                console.log("Too many reductions; breaking.", appliedReductions);
                break;
            }
        } while (result != lastResult);
        return result;
    }
    protected replacementRules: TermReplacementRule[] = []
    protected reductions: Reduction[] = []
    public toString(): string {
        const result = this.toDisplayable(new DisplayParams({ addNewEquation: () => { }, currentEquation: undefined }, false, false, true), () => new Equation(new Constant(0), new Constant(0)))
        if (typeof result == "string")
            return result
        else
            return result.text()
    }
    public abstract toDisplayable(params: DisplayParams, replaceSelf: TermReplacer): JQuery<HTMLElement>;
    public getReplacements(): Term[] {
        const result = []
        for (const rule of this.replacementRules) {
            result.push(...rule.getReplacements(this))
        }
        return result
    }
}

abstract class TermReplacementRule {
    public abstract get name(): string
    public abstract get examples(): string[]
    public abstract getReplacements(term: Term): Term[]
}

interface Reduction {
    (term: Term): Term;
}

class DisplayParams {
    constructor(
        public context: EquationContext,
        public transformable: boolean,
        public replaceable: boolean,
        public preferString: boolean) { }
    untransformable(): DisplayParams {
        return new DisplayParams(this.context, false, this.replaceable, this.preferString)
    }
}