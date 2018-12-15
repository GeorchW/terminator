abstract class Term implements IHashable {
    abstract hash: number;
    abstract equals(other: any): boolean;
    public reduce(): Term {
        let result: Term = this;
        let lastResult: Term;
        let appliedReductions = 0;
        do {
            lastResult = result;
            for (const reduction of result.reductions) {
                result = reduction(result);
                if (result != lastResult) {
                    // console.log("Successfully applied reduction " + reduction.name);
                    // console.log("Old => new:", lastResult.toString(), result.toString());
                    // console.log("Old => new:", lastResult, result);
                    appliedReductions++;
                    break;
                }
            }
            if (appliedReductions > 20) {
                console.log("Too many reductions; breaking.", appliedReductions);
                break;
            }
        } while (result != lastResult);
        return result;
    }
    protected replacementRules: TermReplacementRule[] = []
    protected reductions: Reduction[] = []
    public toString(): string {
        const result = this.toDisplayable(new DisplayParams({ addNewEquation: () => { }, currentEquation: undefined }, false, false, true), () => Equation.default)
        if (typeof result == "string")
            return result
        else
            return result.text()
    }
    public abstract toDisplayable(params: DisplayParams, replaceSelf: TermReplacer): JQuery<HTMLElement>;
    public toEventlessHtml(): JQuery<HTMLElement> {
        return this.toDisplayable(
            new DisplayParams(context, false, false, false),
            _ => Equation.default)
    }
    protected getReplacementsMenu(context: EquationContext, replaceSelf: TermReplacer): JQuery<HTMLElement> {
        const replacementsMenu = $("<span/>")
            .addClass("replacementsMenu")
            .addClass("removeWhenClickedOffscreen")
        const closeMenu = () => replacementsMenu.remove()
        function applyReplacement(replacement: Term) {
            context.addNewEquation(replaceSelf(replacement))
            closeMenu()
    }
        function toHtml(rule: TermReplacementRule, replacement: Term): JQuery<HTMLElement> {
            const equationHtml = replacement.toEventlessHtml()
            const subtitleHtml = $("<span/>")
                .addClass("replacementSubtitle")
                .append(rule.name)
            return clickable($("<span/>"), () => applyReplacement(replacement))
                .addClass("possibleReplacement")
                .append(equationHtml)
                .append(subtitleHtml)
        }
        for (const rule of this.replacementRules) {
            for (const replacement of rule.getReplacements(this)) {
                replacementsMenu.append(toHtml(rule, replacement))
            }
        }
        const custom = $("<span/>")
        custom.append(clickable("custom...", () => {
            custom.empty();
            const textBox = $("<input>")
                .addClass("customReplacementInput")
                .attr("type", "text")
                .attr("value", this.toString())
            var originalValue = this
            var parsedReplacement: Term = this;
            function tryApply(){
                if(!parsedReplacement.equals(originalValue))
                    applyReplacement(parsedReplacement)
                else
                    closeMenu()
            }
            const preview = clickable($("<span/>"), tryApply)
                .addClass("customReplacementPreview")
                .append(this.toEventlessHtml())
            function updateParsing() {
                const value = textBox.val()
                if (typeof value != "string") return
                parsedReplacement = parseTerm(value)
                preview.empty().append(parsedReplacement.toEventlessHtml())
        }
            textBox.on("input", updateParsing)
            const subtitleHtml = $("<span/>")
                .addClass("replacementSubtitle")
                .append("custom")
            textBox.on("keydown", e => e.key === "Enter" ? tryApply() : undefined)
            custom.append(textBox, preview, subtitleHtml)
        }))
        replacementsMenu.append(custom)
        return replacementsMenu
    }
}

abstract class TermReplacementRule {
    public abstract get name(): string
    public abstract get examples(): string[]
    public abstract getReplacements(term: Term): Term[]
}

interface Reduction {
    (term: Term): Term;
}

class DisplayParams {
    constructor(
        public context: EquationContext,
        public transformable: boolean,
        public replaceable: boolean,
        public preferString: boolean) { }
    untransformable(): DisplayParams {
        return new DisplayParams(this.context, false, this.replaceable, this.preferString)
    }
}