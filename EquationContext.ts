interface EquationContext {
    readonly currentEquation: Equation | undefined;
    addNewEquation(equation: Equation): void;
    showPopup(popup: JQuery<HTMLElement>): void;
}
