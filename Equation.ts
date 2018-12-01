class Equation {
    constructor(public left: Sum, public right: Sum) { }
    public toString(): string {
        return this.left + " = " + this.right;
    }
    public toClickableHtml(context: EquationContext): JQuery<HTMLElement> {
        return $("<div/>")
            .attr("id", "equation")
            .attr("class", "math")
            .append(this.left.toClickableHtml(context))
            .append($("<span/>").append("&nbsp;=&nbsp;"))
            .append(this.right.toClickableHtml(context));
    }
    public add(summand: Summand): Equation {
        return new Equation(this.left.add(summand), this.right.add(summand));
    }
}