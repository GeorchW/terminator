describe("parse", () => {
    it("should parse x*(a+c)+b=1 correctly", () => {
        const parsed = parse("x*(a+c)+b=1")
        expect(parsed).not.toBeUndefined()
        if (parsed == undefined) { return }
        if (!(parsed.left instanceof Sum)) { fail("Expected a sum"); return }
    })
})

function parse(text: string): Equation | undefined {
    class ParserState {
        private currentPos: number;
        constructor(public text: string) {
            this.currentPos = 0;
        }
        public get currentChar(): string { return this.currentPos < this.text.length ? this.text[this.currentPos] : ""; }
        public consumeChar() { this.currentPos++; }
    }
    function isLetter(char: string) {
        return char.match("[a-zA-Z]") != null || char.charCodeAt(0) > 127;
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
        var right: Term | AbelianTermItem | undefined = parseTerm(state, getPrecedence(opChar));
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
    function parseBrackets(state: ParserState): Term | undefined {
        state.consumeChar();
        const result = parseTerm(state, 0);
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
    function parseTerm(state: ParserState, returnPrecedence = 0): Term | undefined {
        var left: Term | undefined;
        while (state.currentChar != "") {
            if (isWhitespace(state.currentChar)) {
                state.consumeChar();
                continue;
            }
            if (state.currentChar == ")") {
                return left;
            }
            if (returnPrecedence >= getPrecedence(state.currentChar))
                return left;
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
                    left = parseBrackets(state);
                    break;
                default:
                    if (isLetter(state.currentChar)) {
                        const string = consumeToken(state, isLetter);
                        left = new MathSymbol(string);
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
        return left;
    }
    function parseTermAsText(text: string): Term | undefined {
        return parseTerm(new ParserState(text));
    }
    const terms = text.split("=");
    if (terms.length != 2){
        const left = parseTermAsText(text);
        if(left != undefined)
            return new Equation(left, new Constant(0));
        else
            return new Equation(new Constant(0), new Constant(0))
    }
    else {
        var left = parseTermAsText(terms[0]);
        var right = parseTermAsText(terms[1]);
        if(left == undefined) left = new Constant(0)
        if(right == undefined) right = new Constant(0)
        if (left != undefined && right != undefined)
            return new Equation(left.reduce(), right.reduce());
        else
            return undefined;
    }
}