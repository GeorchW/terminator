interface TermTransformer {
    (term: Term): Term
}

class Equation {
    constructor(public left: Term, public right: Term) { }
    public toString(): string {
        return this.left + " = " + this.right;
    }
    public toClickableHtml(context: EquationContext): JQuery<HTMLElement> {
        const params = new DisplayParams(context, true, true)
        return $("<div/>")
            .attr("id", "equation")
            .attr("class", "math")
            .append(this.left.toDisplayable(params))
            .append($("<span/>").append("&nbsp;=&nbsp;"))
            .append(this.right.toDisplayable(params));
    }
    public apply(transformer: TermTransformer): Equation {
        return new Equation(transformer(this.left), transformer(this.right));
    }
}