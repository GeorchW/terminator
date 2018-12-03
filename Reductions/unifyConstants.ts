// function unifyConstants(term: Term): Term {
//     if (term instanceof AbelianTerm) {
//         let newTerms = [];
//         let hasChange = false;
//         for (const subterm of term.terms.array)
//             if (subterm.actualTerm instanceof Constant && subterm.actualTerm.value != term.neutralElement) {
//                 newTerms.push(new AbelianTermItem(subterm.actualTerm.value * subterm.constantModifier, new Constant(term.neutralElement)))
//                 hasChange = true;
//             }
//             else
//                 newTerms.push(subterm)
//         if (hasChange)
//             return term.createNew(newTerms)
//     }
//     return term
// }