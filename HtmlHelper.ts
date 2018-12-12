function clickable(content: string | JQuery<HTMLElement>, handler: JQuery.EventHandler<HTMLElement> | JQuery.EventHandlerBase<any, JQuery.Event> | false = false): JQuery<HTMLElement> {
    let base = typeof content == "string" ?
        $("<span/>").append(content) : content
    return base
        .addClass("clickable")
        .on("click", handler);
}

function scrollTo(element: JQuery<HTMLElement>, speed: number | string = "fast") {
    const offset = element.offset()
    if (offset != undefined)
        $("html, body").animate({ scrollTop: offset.top }, speed);
};
