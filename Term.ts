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
    public replacementRules: TermReplacementRule[] = []
    protected reductions: Reduction[] = []
    public toString(): string {
        const result = this.toDisplayable(new DisplayParams({ addNewEquation: () => { }, currentEquation: undefined, showPopup: () => { } }, false, false, true), () => Equation.default)
        if (typeof result == "string")
            return result
        else
            return result.text()
    }
    public abstract toDisplayable(params: DisplayParams, replaceSelf: TermReplacer): JQuery<HTMLElement>;
    public toEventlessHtml(): JQuery<HTMLElement> {
        return this.toDisplayable(
            new DisplayParams(context, false, false, false),
            _ => Equation.default)
    }
    protected showReplacementsMenu(context: EquationContext, replaceSelf: TermReplacer, parent: JQuery<HTMLElement>) {
        showReplacementsMenu(this, context, replaceSelf, parent)
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