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
        new MathFunctionInstance(new SimpleMathFunction("sin"),
            new Sum(
                [
                    new AbelianTermItem(1,
                        new Product([
                            new MathSymbol("a"),
                            new MathSymbol("c")]))
                ])).reduce(),
    )
    // const reduceTest = new Sum([equation.left, equation.left]).reduce();
    // console.log(reduceTest.toString(), reduceTest)
    console.log(equation)

    class DefaultEquationContext implements EquationContext {
        public get currentEquation(): Equation | undefined {
            const result = this.oldEquations[this.oldEquations.length - 1]
            if (result == undefined) return undefined
            else return result[0];
        }
        private oldEquations: Array<[Equation, JQuery<HTMLElement>]> = []
        addNewEquation(equation: Equation): void {
            scrollTo(this.equationArea.children().last())
            const html = equation.toClickableHtml(this).children();
            this.equationArea.append(html)
            this.oldEquations.push([equation, html])
            console.log(this.currentEquation)
        }
        public undo() {
            const element = this.oldEquations.pop()
            if (element == undefined) return
            else {
                var [, html] = element;
                html.remove()
            }
        }
        constructor(private equationArea: JQuery<HTMLElement>) { }
    }

    var localContext = context = new DefaultEquationContext($("#equationArea").empty())
    context.addNewEquation(equation)

    const scratchpad = $("#equationScratchpad")
    const input = $("#equationInput")

    console.log(scratchpad, input)

    var parsed: Equation | undefined;

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
    
    $("#copyArea #copyAreaCopyButton").on("click", () => {
        $("#copyArea #copyAreaText").focus().select()
        document.execCommand("copy")
    })


    $("#sendToConsoleButton").on("click", () => console.log(context.currentEquation))
    $("#convertToTextButton").on("click", (e) => {
        const text = context.currentEquation == undefined ? "undefined" : context.currentEquation.toString()
        $("#copyArea").addClass("autoHideVisible")
        const node = $("#copyArea #copyAreaText")
        node.attr("value", text)
        node.focus().select()
        document.execCommand("copy")
        e.stopPropagation()
    })
    $("#undoButton").on("click", () => localContext.undo())
    $("body").on("click", () => {$(".autoHideVisible:not(:hover)").removeClass("autoHideVisible")})
}

