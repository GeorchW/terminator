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
    public toString(): string {
        const result = this.toDisplayable(new DisplayParams({ addNewEquation: () => { }, currentEquation: undefined }, false, true))
        if (typeof result == "string")
            return result
        else
            return result.get(0).outerHTML
    }
    public abstract toDisplayable(params: DisplayParams): JQuery<HTMLElement> | string;
}

interface Reduction {
    (term: Term): Term;
}

class DisplayParams {
    constructor(
        public context:EquationContext, 
        public clickable:boolean, 
        public preferString:boolean){}
    unclickable(): DisplayParams {
        return new DisplayParams(this.context, false, this.preferString)
    }
}