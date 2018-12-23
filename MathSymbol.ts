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
    private convertToHtmlCharacter(x: string): string {
        const entity = "&" + x + ";"
        const converted = $("<div/>").append(entity).text()
        const codePoint = converted.codePointAt(0)
        if (converted.length == 1 && codePoint != undefined
            && codePoint >= 0x0370 && codePoint <= 0x03FF) //greek letters only - we dont want "copy" to be converted to the copyright sign or the like
            return entity
        else return x
    }
    public toDisplayable(params: DisplayParams): JQuery<HTMLElement> {
        if (!params.preferString) {
            const displayName = this.name[0] == "\\" ? this.name.slice(1) : this.name
            const parts = displayName.split("_")
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