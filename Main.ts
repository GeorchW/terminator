let context: EquationContext;

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
                        new Constant(4),
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
            const html = equation.toClickableHtml(this).contents();
            this.equationArea.append(html)
            this.currentEquation = equation
            console.log(this.currentEquation)
        }
        constructor(private equationArea: JQuery<HTMLElement>) { }
    }

    context = new DefaultEquationContext($("#equationArea").empty())
    context.addNewEquation(equation)

    const scratchpad = $("#equationScratchpad")
    const input = $("#equationInput")

    console.log(scratchpad, input)

    var parsed : Equation | undefined;

    input.on("input", () => {
        const val = input.val()
        if (val != undefined) {
            parsed = parse(val.toString())
            if (parsed != undefined) {
                scratchpad.empty().append(parsed.toClickableHtml(context))
            }
            else {
                scratchpad.empty().append("error")
            }
        }
    })
    $("#sendToConsoleButton").on("click", () => console.log(parsed))
    //document.body.innerHTML = equation.toClickableHtml()
}

