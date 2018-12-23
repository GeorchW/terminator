function gcd(a : number, b : number):number{ // greatest common divisor
    if(a == 0 || b == 0) return 1
    else if(a < 0 && b < 0) return -gcd(-a, -b)
    else if(a < 0) return gcd(-a, b)
    else if(b < 0) return -gcd(a, -b)
    else if(a == b) return a
    else if(a > b) return gcd(a-b, b)
    else return gcd(a, b-a)
}

function unifyConstantFactors(term: Term): Term {
    if (term instanceof Product) {
        let constantDividends: number[] = [1]
        let constantDivisors: number[] = [1]
        let nonConstantFactors: AbelianTermItem[] = []
        for (const subterm of term.terms.array)
            if (subterm.actualTerm instanceof Constant)
                if (subterm.constantModifier > 0)
                    constantDividends.push(Math.pow(subterm.actualTerm.value, subterm.constantModifier))
                else
                    constantDivisors.push(Math.pow(subterm.actualTerm.value, -subterm.constantModifier))
            else
                nonConstantFactors.push(subterm)
        const dividend = constantDividends.reduce((a, b) => a * b);
        const divisor = constantDivisors.reduce((a, b) => a * b);
        const gcd_ = gcd(dividend, divisor)
        if (constantDividends.length > 2 || constantDivisors.length > 2 || gcd_ != 1) {
            return term.createNew([
                    new AbelianTermItem(1, new Constant(dividend / gcd_)), 
                    new AbelianTermItem(-1, new Constant(divisor / gcd_)), 
                    ...nonConstantFactors])
        }
    }
    return term
}