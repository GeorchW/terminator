interface TermTransformer {
    (term: Term): Term
}

class Equation {
    constructor(public left: Term, public right: Term) { }
    public toString(): string {
        return this.left + " = " + this.right;
    }
    public toClickableHtml(context: EquationContext): JQuery<HTMLElement> {
        return $("<div/>")
            .attr("id", "equation")
            .attr("class", "math")
            .append(this.left.toClickable(context))
            .append($("<span/>").append("&nbsp;=&nbsp;"))
            .append(this.right.toClickable(context));
    }
    public apply(transformer: TermTransformer): Equation {
        return new Equation(transformer(this.left), transformer(this.right));
    }
}