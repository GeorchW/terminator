interface EquationContext {
    lastElement: JQuery<HTMLElement>
    equation: Equation
}

class Equation {
    constructor(public left: Sum, public right: Sum) { }
    public toString(): string {
        return this.left + " = " + this.right
    }
    public toClickableHtml(target: JQuery<HTMLElement>): JQuery<HTMLElement> {
        let context = { equation: this, lastElement: target }
        return $("<div> = </div>")
            .prepend(this.left.toClickableHtml(context))
            .append(this.right.toClickableHtml(context))
    }
    public add(summand: Summand): Equation {
        return new Equation(this.left.add(summand), this.right.add(summand))
    }
}
class Summand implements IHashable {
    hash = 0;
    equals(other: any): boolean {
        if (other instanceof Summand)
            return other.constantFactor == this.constantFactor
                && other.product.equals(this.product)
        else return false
    }
    constructor(public readonly constantFactor: number, public readonly product: Product) { }
    public toString(forceSign: boolean = false): string {
        if (this.product.factors.length == 0)
            return "1"
        let sign = (this.constantFactor < 0 ? " - " :
            forceSign ? " + " : "")
        let absFactor = Math.abs(this.constantFactor)
        let prefix = absFactor != 1 ? absFactor : ""
        return sign + prefix + this.product.factors.join("&#8729;") // \cdot
    }
    public toClickableHtml(context: EquationContext, forceSign: boolean = false): JQuery<HTMLElement> {
        let term = this
        let result = $("<a/>").html(this.toString(forceSign))
        return result.on("click", function () {
            const newEquation = context.equation.add(term.multiply(-1))
            context.lastElement.append(newEquation.toClickableHtml(context.lastElement))
            console.log(newEquation)
            result.css("color", "red")
        })
    }
    public multiply(factor: number): Summand {
        return new Summand(this.constantFactor * factor, this.product)
    }
}
class Sum implements IHashable {
    readonly hash: number;
    equals(other: any): boolean {
        if (other instanceof Sum)
            return other.summands.equals(this.summands)
        else return false
    }
    public summands: OrderedFrozenSet<Summand>
    constructor(summands: Summand[]) {
        const accumulated = new Accumulator(summands.map(s => [s.product, s.constantFactor] as [Product, number]), (a, b) => a + b)
        this.summands = new OrderedFrozenSet(accumulated.toArray().map(pair => new Summand(pair[1], pair[0])).filter(summand => summand.constantFactor != 0));
        this.hash = this.summands.hash
    }
    public toString(): string {
        if (this.summands.array.length == 0)
            return "0"
        return this.summands.array[0].toString() + this.summands.array.slice(1).map(x => x.toString(true)).join("")
    }
    public toClickableHtml(context: EquationContext): JQuery<HTMLElement>{
        return this.toClickableHtmlInner(context).attr("id", "sum")
    }
    private toClickableHtmlInner(context: EquationContext): JQuery<HTMLElement> {
        if (this.summands.array.length == 0)
            return $("<span>0</span>")
        // if (this.summands.array.length == 1) {
        //     // give possibility to move individual factors around
        //     let suffix = $("<span/>").attr("id", "subtext").append("move summand")
        //     return this.summands.array[0].toClickableHtml(context).append(suffix)
        // }
        else {
            let first = this.summands.array[0].toClickableHtml(context)
            let result = $("<span/>")
                .append(first)
                .append(this.summands.array.slice(1).map(x => x.toClickableHtml(context, true)))
            return result
        }
    }
    public add(summand: Summand): Sum {
        return new Sum(this.summands.array.concat([summand]))
    }
}
class Product implements IHashable {
    readonly hash: number;
    equals(other: any): boolean {
        if (other instanceof Product)
            return other.factorSet.equals(this.factorSet)
        else return false
    }
    readonly factorSet: OrderedFrozenSet<MathSymbol>
    constructor(public readonly factors: MathSymbol[]) {
        this.factorSet = new OrderedFrozenSet(factors)
        this.hash = this.factorSet.hash
    }
}
class MathSymbol implements IHashable {
    readonly hash: number;
    equals(other: any): boolean {
        if (other instanceof MathSymbol)
            return other.name == this.name
        else return false
    }
    constructor(public name: string) {
        this.hash = stringHash(name)
    }
    public toString(): string {
        return this.name
    }
}

let test: OrderedFrozenSet<MathSymbol>

let equation = new Equation(
    new Sum(
        [
            new Summand(-1,
                new Product([
                    new MathSymbol("a"),
                    new MathSymbol("b")]))
        ]),
    new Sum(
        [
            new Summand(1,
                new Product([
                    new MathSymbol("a"),
                    new MathSymbol("c")]))
        ]),
)

let eqnArea = $("#equationArea")
eqnArea.empty().append(equation.toClickableHtml(eqnArea))
//document.body.innerHTML = equation.toClickableHtml()