describe("parse", () => {
    it("should parse x*(a+c)+b=1 correctly", () => {
        const parsed = parseEquation("x*(a+c)+b=1")
        expect(parsed).not.toBeUndefined()
        if (parsed == undefined) { return }
        if (!(parsed.left instanceof Sum)) { fail("Expected a sum"); return }
    })
})

/**
 * These characters are not considered a multiplication, but a single token.
 * Contains all greek characters for now, lowercase and uppercase.
 * May be extended in the future.
 */
const tokenWhitelist = new Set([ 
    "alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta", "iota", "kappa", "lambda", "mu", "nu", "xi", "omicron", "pi", "rho", "sigma", "tau", "upsilon", "phi", "chi", "psi", "omega",
    "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta", "Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", "Omicron", "Pi", "Rho", "Sigma", "Tau", "Upsilon", "Phi", "Chi", "Psi", "Omega" ]);

function parseTerm(text: string): Term {
    class ParserState {
        private currentPos: number;
        constructor(public text: string) {
            this.currentPos = 0;
        }
        public get currentChar(): string { return this.currentPos < this.text.length ? this.text[this.currentPos] : ""; }
        public consumeChar() { this.currentPos++; }
    }
    function isLetter(char: string) {
        return char.match("[a-zA-Z\\\\]") != null || char.charCodeAt(0) > 127;
    }
    function isDigit(char: string) {
        return char.match("\\d") != null;
    }
    function isWhitespace(char: string) {
        return char.match("\\s") != null;
    }
    interface StringMatcher {
        (char: string): boolean;
    }
    function consumeToken(state: ParserState, matcher: StringMatcher): string {
        var chars = [];
        do {
            chars.push(state.currentChar);
            state.consumeChar();
        } while (matcher(state.currentChar));
        return chars.join("");
    }
    function parseAbelian(left: Term | undefined, state: ParserState, neutralElement: number, minusOrDivide: string): (AbelianTermItem | Term)[] {
        const opChar = state.currentChar;
        state.consumeChar();
        var leftTerm = left == undefined ? new Constant(neutralElement) : left;
        var right: Term | AbelianTermItem | undefined = parseTermInternal(state, getPrecedence(opChar));
        if (right == undefined)
            right = new Constant(neutralElement);
        if (opChar == minusOrDivide) {
            right = new AbelianTermItem(-1, right);
        }
        return [leftTerm, right];
    }
    function parseSum(left: Term | undefined, state: ParserState): Sum {
        return new Sum(parseAbelian(left, state, 0, "-"))
    }
    function parseProduct(left: Term | undefined, state: ParserState): Product {
        return new Product(parseAbelian(left, state, 1, "/"))
    }
    function parseBrackets(state: ParserState): Term {
        state.consumeChar();
        const result = parseTermInternal(state, 0);
        if (state.currentChar == ")")
            state.consumeChar()
        return result
    }
    function getPrecedence(operator: string) {
        switch (operator) {
            case '-':
            case '+':
                return 100;
            case '*':
            case '/':
                return 200;
            default:
                return 1000;
        }
    }

    interface FunctionLookup { [name: string]: MathFunction | undefined }
    var knownFunctions: FunctionLookup = {
        "sin": new SimpleMathFunction("sin"),
        "cos": new SimpleMathFunction("cos"),
        "tan": new SimpleMathFunction("tan"),
        "exp": new SimpleMathFunction("exp", "log"),
    }
    function forceGetFunction(name: string): MathFunction {
        const result = knownFunctions[name];
        if (result) return result
        else throw new Error()
    }
    knownFunctions = {
        "sin": forceGetFunction("sin"),
        "cos": forceGetFunction("cos"),
        "tan": forceGetFunction("tan"),
        "asin": forceGetFunction("sin").inverse,
        "acos": forceGetFunction("cos").inverse,
        "atan": forceGetFunction("tan").inverse,
        "exp": forceGetFunction("exp"),
        "log": forceGetFunction("exp").inverse,
        "ln": forceGetFunction("exp").inverse
    }

    function getMathFunction(name: string) {
        const knownFunction = knownFunctions[name]
        if (knownFunction != undefined)
            return knownFunction
        else return new SimpleMathFunction(name)
    }

    function consumeWhitespaces(state: ParserState) {
        while (isWhitespace(state.currentChar)) state.consumeChar()
    }

    function parseTermInternal(state: ParserState, returnPrecedence = 0): Term {
        var left: Term | undefined;
        while (state.currentChar != "") {
            if (isWhitespace(state.currentChar)) {
                state.consumeChar();
                continue;
            }
            if (state.currentChar == ")")
                break;
            if (returnPrecedence >= getPrecedence(state.currentChar))
                break;
            switch (state.currentChar) {
                case '+':
                case '-':
                    left = parseSum(left, state);
                    break;
                case "*":
                case "/":
                    left = parseProduct(left, state);
                    break;
                case "(":
                    const brackets = parseBrackets(state);
                    if (left != undefined)
                        left = new Product([left, brackets])
                    else left = brackets;
                    break;
                default:
                    if (isLetter(state.currentChar)) {
                        const string = consumeToken(state, x => isLetter(x) || isDigit(x) || x === "_");
                        consumeWhitespaces(state);
                        var newTerm: Term;
                        if (state.currentChar == "(") 
                            newTerm = new MathFunctionInstance(getMathFunction(string), parseBrackets(state))
                        else {
                            if(tokenWhitelist.has(string) || string[0] == "\\")
                                newTerm = new MathSymbol(string)
                            else {
                                const terms = []
                                for (let i = 0; i < string.length; i++) {
                                    terms.push(new MathSymbol(string.charAt(i)))
                                }
                                newTerm = new Product(terms)
                            }
                        }
                        if (left != undefined)
                            left = new Product([left, newTerm])
                        else left = newTerm;
                    }
                    else if (isDigit(state.currentChar)) {
                        const string = consumeToken(state, isDigit);
                        left = new Constant(parseInt(string));
                    }
                    else {
                        state.consumeChar();
                        left = undefined;
                    }
            }
            if (left != undefined) {
                left = left.reduce();
            }
        }
        if (left == undefined) return new Constant(0)
        else return left;
    }
    return parseTermInternal(new ParserState(text));
}

function parseEquation(text: string): Equation {
    const terms = text.split("=");
    if (terms.length != 2) {
        const left = parseTerm(text);
        if (left != undefined)
            return new Equation(left, new Constant(0));
        else
            return new Equation(new Constant(0), new Constant(0))
    }
    else {
        var left = parseTerm(terms[0]);
        var right = parseTerm(terms[1]);
        return new Equation(left.reduce(), right.reduce());
    }
}