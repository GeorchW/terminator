function moveConstantFactorToFront(term: Term): Term {
    if (term instanceof Product)
        return collectConstants(term, (constants, nonConstants) => constants.concat(nonConstants))
    else return term
}
function moveConstantSummandsToBack(term: Term): Term {
    if (term instanceof Sum)
        return collectConstants(term, (constants, nonConstants) => nonConstants.concat(constants))
    else return term
}

interface Collector { (constants: AbelianTermItem[], nonConstants: AbelianTermItem[]): AbelianTermItem[] }
function collectConstants(term: AbelianTerm, collector: Collector): Term {
    let nonConstants: AbelianTermItem[] = []
    let constants: AbelianTermItem[] = []
    for (const subTerm of term.terms.array)
        if (subTerm.actualTerm instanceof Constant)
            constants.push(subTerm)
        else
            nonConstants.push(subTerm)
    if (constants.length != 0) {
        const collected = collector(constants, nonConstants)
        if (collected.some((value, index) => value != term.terms.array[index]))
            return term.createNew(collected)
    }
    return term
}
