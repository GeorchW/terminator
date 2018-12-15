function showReplacementsMenu(term: Term, context: EquationContext, termReplacer: TermReplacer, parent: JQuery<HTMLElement>) {
    const replacementsMenu = $("<span/>")
        .addClass("replacementsMenu")
        .addClass("removeWhenClickedOffscreen")
    for (const rule of term.replacementRules) {
        for (const replacement of rule.getReplacements(term)) {
            replacementsMenu.append(convertRuleToHtml(rule, replacement))
        }
    }
    addCustomReplacementOption()
    context.showPopup(replacementsMenu)
    positionPopup()

    // These functions are used in some events
    function closeMenu() { replacementsMenu.remove() }
    function applyReplacement(replacement: Term) {
        context.addNewEquation(termReplacer(replacement))
        closeMenu()
    }

    // The following are the individual functions creating the menu
    function convertRuleToHtml(rule: TermReplacementRule, replacement: Term): JQuery<HTMLElement> {
        const equationHtml = replacement.toEventlessHtml()
        const subtitleHtml = $("<span/>")
            .addClass("replacementSubtitle")
            .append(rule.name)
        return clickable($("<span/>"), () => applyReplacement(replacement))
            .addClass("possibleReplacement")
            .append(equationHtml)
            .append(subtitleHtml)
    }
    function addCustomReplacementOption() {
        const custom = $("<span/>")
        custom.append(clickable("custom...", () => {
            custom.empty();
            const textBox = $("<input>")
                .addClass("customReplacementInput")
                .attr("type", "text")
                .attr("value", term.toString())
            var originalValue = term
            var parsedReplacement: Term = term;
            function tryApply() {
                if (!parsedReplacement.equals(originalValue))
                    applyReplacement(parsedReplacement)
                else
                    closeMenu()
            }
            const preview = clickable($("<span/>"), tryApply)
                .addClass("customReplacementPreview")
                .append(term.toEventlessHtml())
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
            textBox.focus()
            textBox.select()
        }))
        replacementsMenu.append(custom)
    }
    function positionPopup() {
        const offset = parent.offset()
        const width = parent.width()
        const height = parent.height()
        if (offset == undefined || width == undefined || height == undefined) return
        replacementsMenu.css("position", "absolute")
            .css("left", offset.left)
            .css("top", offset.top + height)
    }
}