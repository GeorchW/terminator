enum Sign { Plus = 1, Minus = -1 }
interface EquationContext {
    lastElement: JQuery<HTMLElement>
    equation: Equation
}
class Equation {
    constructor(public left: SumTerm, public right: SumTerm) { }
    public toString(): string {
        return this.left + " = " + this.right
    }
    public toClickableHtml(target: JQuery<HTMLElement>): JQuery<HTMLElement> {
        let context = { equation: this, lastElement: target }
        return $("<div> = </div>")
            .prepend(this.left.toClickableHtml(context))
            .append(this.right.toClickableHtml(context))
    }
    public add(summand: ProductTerm): Equation {
        return new Equation(this.left.add(summand), this.right.add(summand))
    }
}
class SumTerm {
    constructor(public summands: ProductTerm[]) { }
    public toString(): string {
        return this.summands[0].toString() + this.summands.slice(1).map(x => x.toString(true)).join("")
    }
    public toClickableHtml(context: EquationContext): JQuery<HTMLElement> {
        let first = this.summands[0].toClickableHtml(context)
        let result = $("<span/>")
            .append(first)
            .append(this.summands.slice(1).map(x => x.toClickableHtml(context, true)))
        return result
    }
    public add(summand: ProductTerm): SumTerm {
        return new SumTerm(this.summands.concat([summand]))
    }
}
class ProductTerm {
    constructor(public sign: Sign, public factors: MathSymbol[]) { }
    public toString(forceSign: boolean = false): string {
        if (this.factors.length == 0) {
            return "1"
        }
        let sign = (this.sign == Sign.Minus ? " - " :
            forceSign ? " + " : "")
        return sign + this.factors.join(" * ")
    }
    public toClickableHtml(context:EquationContext, forceSign: boolean=false):JQuery<HTMLElement>{
        let term = this
        let result = $("<a/>").html(this.toString(forceSign))
        return result.on("click", function () {
            context.lastElement
                .append(context.equation.add(term.negate()).toClickableHtml(context.lastElement))
            result.css("color", "red")
        })
    }
    public negate() : ProductTerm{
        return new ProductTerm(-this.sign, this.factors)
    }
}
class MathSymbol {
    constructor(public name: string) { }
    public toString(): string {
        return this.name
    }
}

let equation = new Equation(
    new SumTerm(
        [
            new ProductTerm(-1, [
                new MathSymbol("a"),
                new MathSymbol("b")])
        ]),
    new SumTerm(
        [
            new ProductTerm(1, [
                new MathSymbol("a"),
                new MathSymbol("c")])
        ]),
)

console.log("hi")
console.log(equation)
console.log(equation.toString())
let eqnArea = $("#equationArea")
eqnArea.empty().append(equation.toClickableHtml(eqnArea))
//document.body.innerHTML = equation.toClickableHtml()