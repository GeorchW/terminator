describe('Sum', () => {
    describe("constructor", () => {
        it('should merge (simple symbol) summands', () => {
            const sum = new Sum([new MathSymbol("a"), new MathSymbol("a")])
            expect(sum).toEqual(new Sum([new AbelianTermItem(2, new MathSymbol("a"))]));
        })
        it('should merge (simple symbol) summands with different factors', () => {
            const sum = new Sum([new MathSymbol("a"), new AbelianTermItem(3, new MathSymbol("a"))])
            expect(sum).toEqual(new Sum([new AbelianTermItem(4, new MathSymbol("a"))]));
        })
        it('should merge (factor) summands', () => {
            const sum = new Sum([new Product([new MathSymbol("a"), new MathSymbol("b")]), new Product([new MathSymbol("a"), new MathSymbol("b")])])
            const expected = new Sum([new AbelianTermItem(2, new Product([new MathSymbol("a"), new MathSymbol("b")]))]);
            expect(sum.toString()).toEqual(expected.toString())
            expect(sum).toEqual(expected);
        })
    })
    describe("equals", () => {
        it('should implement symbolic equality', () => {
            const sum1 = new Sum([new MathSymbol("a"), new MathSymbol("b")])
            const sum2 = new Sum([new MathSymbol("a"), new MathSymbol("b")])
            expect(sum1.equals(sum2)).toBeTruthy()
        })
    })
})

describe("OrderedFrozenSet", ()=>{
    describe("equals", () => {
        it("should recognize that two instances of an empty set are equal", () => {
            const a = new OrderedFrozenSet([])
            const b = new OrderedFrozenSet([])
            expect(a.equals(b)).toBeTruthy()
        })
        it("should recognize equality of one-item sets", () => {
            const a = new OrderedFrozenSet([new Constant(1)])
            const b = new OrderedFrozenSet([new Constant(1)])
            expect(a.equals(b)).toBeTruthy()
        })
        it("should recognize equality of ordered inputs", () => {
            const a = new OrderedFrozenSet([new Constant(1), new Constant(2), new Constant(3)])
            const b = new OrderedFrozenSet([new Constant(1), new Constant(2), new Constant(3)])
            expect(a.equals(b)).toBeTruthy()
        })
        it("should recognize equality independent of order", () => {
            const a = new OrderedFrozenSet([new Constant(1), new Constant(2), new Constant(3)])
            const b = new OrderedFrozenSet([new Constant(2), new Constant(3), new Constant(1)])
            expect(a.equals(b)).toBeTruthy()
        })
    })
})