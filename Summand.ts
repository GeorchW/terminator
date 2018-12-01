class Summand implements IHashable {
    hash = 0;
    equals(other: any): boolean {
        if (other instanceof Summand)
            return other.constantFactor == this.constantFactor
                && other.product.equals(this.product);
        else
            return false;
    }
    constructor(public readonly constantFactor: number, public readonly product: Product) { }
    public toString(forceSign: boolean = false): string {
        if (this.product.factors.length == 0)
            return "1";
        let sign = (this.constantFactor < 0 ? " - " :
            forceSign ? " + " : "");
        let absFactor = Math.abs(this.constantFactor);
        let prefix = absFactor != 1 ? absFactor : "";
        return sign + prefix + this.product.factors.join("&#8729;"); // \cdot
    }
    public toClickableHtml(context: EquationContext, forceSign: boolean = false): JQuery<HTMLElement> {
        let term = this;
        return clickable(this.toString(forceSign), function (result: JQuery.Event<HTMLElement>) {
            if (context.currentEquation == undefined)
                return;
            context.addNewEquation(context.currentEquation.add(term.multiply(-1)));
            $(result.target).css("color", "red");
        });
    }
    public multiply(factor: number): Summand {
        return new Summand(this.constantFactor * factor, this.product);
    }
}
class Sum implements IHashable {
    readonly hash: number;
    equals(other: any): boolean {
        if (other instanceof Sum)
            return other.summands.equals(this.summands);
        else
            return false;
    }
    public summands: OrderedFrozenSet<Summand>;
    constructor(summands: Summand[]) {
        const accumulated = new Accumulator(summands.map(s => [s.product, s.constantFactor] as [Product, number]), (a, b) => a + b);
        this.summands = new OrderedFrozenSet(accumulated.toArray().map(pair => new Summand(pair[1], pair[0])).filter(summand => summand.constantFactor != 0));
        this.hash = this.summands.hash;
    }
    public toString(): string {
        if (this.summands.array.length == 0)
            return "0";
        return this.summands.array[0].toString() + this.summands.array.slice(1).map(x => x.toString(true)).join("");
    }
    public toClickableHtml(context: EquationContext): JQuery<HTMLElement> {
        return this.toClickableHtmlInner(context).attr("id", "sum");
    }
    private toClickableHtmlInner(context: EquationContext): JQuery<HTMLElement> {
        if (this.summands.array.length == 0)
            return $("<span>0</span>");
        if (this.summands.array.length == 1) {
            // give possibility to move individual factors around
            const summand = this.summands.array[0];
            let mainText = $("<span/>").attr("id", "innerSum");
            if (summand.constantFactor != 1)
                mainText.append(clickable(summand.constantFactor == -1 ? "-" : (summand.constantFactor + "")));
            let isFirst = true;
            for (const factor of summand.product.factors) {
                if (isFirst)
                    isFirst = false;
                else
                    mainText.append("&#8729;");
                mainText.append(clickable(factor.name));
            }
            let suffix = clickable("move summand", () => { }).attr("id", "subtext");
            return $("<span/>").append(mainText).append(suffix);
        }
        else {
            let first = this.summands.array[0].toClickableHtml(context);
            let result = $("<span/>")
                .append(first)
                .append(this.summands.array.slice(1).map(x => x.toClickableHtml(context, true)));
            return result;
        }
    }
    public add(summand: Summand): Sum {
        return new Sum(this.summands.array.concat([summand]));
    }
}