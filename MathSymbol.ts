class MathSymbol extends Term {
    readonly hash: number;
    equals(other: any): boolean {
        if (other instanceof MathSymbol)
            return other.name == this.name;
        else
            return false;
    }
    constructor(public name: string) {
        super()
        this.hash = stringHash(name);
    }
    private convertToHtmlCharacter(x:string):string {
        const entity = "&" + x + ";"
        if($("<div/>").append(entity).text().length == 1)
            return entity
        else return x
    }
    public toDisplayable(params: DisplayParams): JQuery<HTMLElement> {
        if (!params.preferString) {
            const parts = this.name.split("_")
            const mainText = parts[0]
            const subTexts = parts.slice(1)
            const result = $("<span/>").append(this.convertToHtmlCharacter(mainText));
            var innermostElement = result
            for (const subText of subTexts) {
                const subElement = $("<sub/>").append(this.convertToHtmlCharacter(subText))
                innermostElement.append(subElement)
                innermostElement = subElement
            }
            return result
        }
        return $("<span/>").append(this.name);
    }
    public checkReducable(): boolean {
        return false
    }
    public reduce(): Term {
        return this
    }
}