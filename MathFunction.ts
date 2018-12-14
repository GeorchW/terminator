abstract class MathFunction implements IHashable {
    public abstract readonly hash: number
    public abstract equals(other: any): boolean
    public abstract get inverse(): MathFunction
    public abstract toDisplayable(params: DisplayParams): JQuery<HTMLElement>
}

class SimpleMathFunction extends MathFunction {
    public readonly hash: number
    constructor(public name: string) {
        super()
        this.hash = stringHash(name)
    }
    public get inverse(): MathFunction {
        return new SimpleInverseMathFunction(this)
    }
    public equals(other: any): boolean {
        return other instanceof SimpleMathFunction && other.name == this.name
    }
    public toDisplayable(params: DisplayParams): JQuery<HTMLElement> {
        return $("<span/>").append(this.name)
    }
}

class SimpleInverseMathFunction extends MathFunction {
    public readonly hash: number
    constructor(public _function: SimpleMathFunction) {
        super()
        this.hash = -_function.hash
    }
    public get inverse(): MathFunction {
        return this._function
    }
    public equals(other: any): boolean {
        return other instanceof SimpleInverseMathFunction && other._function.equals(this._function)
    }
    public toDisplayable(params: DisplayParams): JQuery<HTMLElement> {
        return $("<span/>")
            .append(this._function.toDisplayable(params))
            .append(params.preferString ? "^-1" :
                $("<sup/>").append("-1"))
    }
}

class MathFunctionInstance extends Term {
    reductions = [removeInvertedFuctions]
    hash: number;
    constructor(public _function: MathFunction, public innerTerm: Term) {
        super()
        this.hash = _function.hash << 1 ^ innerTerm.hash
    }
    equals(other: any): boolean {
        return other instanceof MathFunctionInstance && other._function.equals(this._function) && other.innerTerm.equals(this.innerTerm)
    }
    public toDisplayable(params: DisplayParams, replaceSelf: TermReplacer): JQuery<HTMLElement> {
        var result = $("<span/>")
        var context = params.context
        if (params.clickable) {
            result = clickable(result, () => {
                if (context.currentEquation != undefined) {
                    const newEquation = context.currentEquation.apply(term => new MathFunctionInstance(this._function.inverse, term).reduce())
                    context.addNewEquation(newEquation)
                }
            })

        }
        return result
            .append(this._function.toDisplayable(params))
            .append(
                this.innerTerm.toDisplayable(
                    params.unclickable(),
                    term => replaceSelf(new MathFunctionInstance(this._function, term).reduce()))
                .prepend("(").append(")"))
    }
}