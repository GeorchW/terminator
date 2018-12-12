interface TermTransformer {
    (term: Term): Term
}

class Equation {
    constructor(public left: Term, public right: Term) { }
    public toString(): string {
        return this.left + " = " + this.right;
    }
    public toClickableHtml(context: EquationContext): JQuery<HTMLElement> {
        const params = new DisplayParams(context, true, false)
        return $("<div/>")
            .attr("id", "equation")
            .attr("class", "math")
            .append($("<span/>").append(this.left.toDisplayable(params)).attr("class", "equation-left"))
            .append($("<span/>").append("&nbsp;=&nbsp;").attr("class", "equation-equals"))
            .append($("<span/>").append(this.right.toDisplayable(params)).attr("class", "equation-right"));
    }
    public apply(transformer: TermTransformer): Equation {
        return new Equation(transformer(this.left), transformer(this.right));
    }
}