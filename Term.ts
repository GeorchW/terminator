abstract class Term implements IHashable {
    abstract hash: number;
    abstract equals(other: any): boolean;
    public reduce(): Term {
        let result: Term = this;
        let lastResult: Term;
        let appliedReductions = 0;
        do {
            lastResult = result;
            for (const reduction of this.reductions) {
                result = reduction(result);
                if (result != lastResult) {
                    console.log("Successfully applied reduction " + reduction);
                    console.log("Old => new:", lastResult.toString(), result.toString());
                    console.log("Old => new:", [lastResult, result]);
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
    protected reductions: Reduction[] = [];
    public abstract toClickable(context: EquationContext): JQuery<HTMLElement>;
}

interface Reduction {
    (term: Term): Term;
}