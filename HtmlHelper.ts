function clickable(content: string | JQuery<HTMLElement>, handler: JQuery.EventHandler<HTMLElement> | JQuery.EventHandlerBase<any, JQuery.Event> | false = false): JQuery<HTMLElement> {
    let base = typeof content == "string" ?
        $("<span/>").append(content) : content
    if(handler != false){
        base
            .addClass("clickable")
            .on("click", handler)
    }
    return base
}

function scrollToElement(element: JQuery<HTMLElement>, speed: number | string = "fast") {
    const offset = element.offset()
    if (offset != undefined)
        $("html, body").animate({ scrollTop: offset.top }, speed);
};
