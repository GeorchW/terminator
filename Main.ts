interface EquationContext {
    readonly currentEquation: Equation | undefined
    addNewEquation(equation: Equation): void
}

function clickable(
    content: string | JQuery<HTMLElement>,
    handler:
        JQuery.EventHandler<HTMLElement> |
        JQuery.EventHandlerBase<any, JQuery.Event<HTMLElement>> |
        false = false): JQuery<HTMLElement> {
    return $("<span/>")
        .append(content)
        .addClass("clickable")
        .on("click", handler)
}

function onStart() {
    let equation = new Equation(
        new Sum(
            [
                new AbelianTermItem(3,
                    new Product([
                        new MathSymbol("a"),
                        new Constant(5),
                        new MathSymbol("c")])),
                    new AbelianTermItem(-1,
                        new Product([
                            new MathSymbol("a"),
                            new Constant(5),
                            new MathSymbol("b")]))
            ]).reduce(),
        new Sum(
            [
                new AbelianTermItem(1,
                    new Product([
                        new MathSymbol("a"),
                        new MathSymbol("c")]))
            ]).reduce(),
    )
    // const reduceTest = new Sum([equation.left, equation.left]).reduce();
    // console.log(reduceTest.toString(), reduceTest)
    console.log(equation)

    class DefaultEquationContext implements EquationContext {
        currentEquation: Equation | undefined;
        addNewEquation(equation: Equation): void {
            const html = equation.toClickableHtml(this);
            this.equationArea.append(html)
            this.currentEquation = equation
            console.log(this.currentEquation)
        }
        constructor(private equationArea: JQuery<HTMLElement>) { }
    }

    let context = new DefaultEquationContext($("#equationArea").empty())
    context.addNewEquation(equation)
    //document.body.innerHTML = equation.toClickableHtml()
}