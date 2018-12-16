interface EquationContext {
    readonly currentEquation: Equation | undefined;
    addNewEquation(equation: Equation): void;
    showPopup(popup: JQuery<HTMLElement>): void;
}

const dummyContext : EquationContext = { addNewEquation: () => { }, currentEquation: undefined, showPopup: () => { } }