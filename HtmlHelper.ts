var hoveredElement: JQuery<HTMLElement> | undefined = undefined

function clickable(content: string | JQuery<HTMLElement>, handler: JQuery.EventHandler<HTMLElement> | JQuery.EventHandlerBase<any, JQuery.Event> | false = false): JQuery<HTMLElement> {
    let base = typeof content == "string" ?
        $("<span/>").append(content) : content
    if (handler != false) {
        base
            .on("mouseover mouseout", e => {
                base.toggleClass("clickableMouseOver", e.type === "mouseover")
                e.stopPropagation()
            })
            .on("click", e => {
                handler(e)
                e.stopPropagation()
            })
    }
    return base
}

function scrollToElements(elements: JQuery<HTMLElement>, speed: number | string = "fast") {
    var top = 1e300
    for (const element of elements) {
        const offset = $(element).offset()
        if (offset != undefined)
            top = Math.min(top, offset.top)
    }
    $("html, body").animate({ scrollTop: top }, speed);
};
