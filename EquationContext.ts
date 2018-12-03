interface EquationContext {
    readonly currentEquation: Equation | undefined;
    addNewEquation(equation: Equation): void;
}