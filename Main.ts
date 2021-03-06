/** For debugging purposes only (terminal access). Do not use. */
let globalContext: EquationContext;

function onStart() {
    var useParsed = false;
    var parsed: Equation | undefined;
    const equationArea = $("#equationArea")
    const input = $("#equationInput")
    const popupDestination = $("#popupDestination")

    class DefaultEquationContext implements EquationContext {
        public get currentEquation(): Equation | undefined {
            if (!useParsed) return parsed
            const result = this.oldEquations[this.oldEquations.length - 1]
            if (result == undefined) return undefined
            else return result[0];
        }
        private oldEquations: Array<[Equation, JQuery<HTMLElement>]> = []
        addNewEquation(equation: Equation): void {
            if (!useParsed) {
                useParsed = true;
                input.remove()
            }
            if (this.oldEquations.length > 0)
                scrollToElements(this.oldEquations[this.oldEquations.length - 1][1])
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
        constructor(private equationArea: JQuery<HTMLElement>) {
        }
        showPopup(popup: JQuery<HTMLElement>): void {
            popupDestination.empty().append(popup)
        }
    }

    var context = globalContext = new DefaultEquationContext(equationArea.empty())


    console.log(equationArea, input)


    input.on("input", () => {
        const val = input.val()
        if (val != undefined) {
            parsed = parseEquation(val.toString())
            equationArea.empty().append(parsed.toClickableHtml(context).children())
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
    $("#undoButton").on("click", () => context.undo())
    $("html, body").on("click", () => { $(".autoHideVisible:not(:hover)").removeClass("autoHideVisible") })
    $("html, body").on("mousedown", () => { $(".removeWhenClickedOffscreen:not(:hover)").remove() })
    $("html, body").on("keypress", e => e.key == "Escape" ? popupDestination.empty() : undefined)
}

