describe("unifyConstantFactors", ()=>{
    it("should reduce fractions", () => {
        const input = new Product([new Constant(14), new AbelianTermItem(-1, new Constant(4))])
        const output = unifyConstantFactors(input)
        const expected = new Product([new Constant(7), new AbelianTermItem(-1, new Constant(2))])
        expect(output.toString()).toEqual(expected.toString())
        expect(output).toEqual(expected)
    })
})