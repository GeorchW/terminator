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

function onStart(){
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

    class DefaultEquationContext implements EquationContext{
        currentEquation: Equation | undefined;
        addNewEquation(equation: Equation): void {
            console.log(equation)
            const html = equation.toClickableHtml(this);
            console.log(html)
            this.equationArea.append(html)
        }
        constructor(private equationArea : JQuery<HTMLElement>) { }
    }
    
    let context = new DefaultEquationContext($("#equationArea").empty())
    context.addNewEquation(equation)
    //document.body.innerHTML = equation.toClickableHtml()
}