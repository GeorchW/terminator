function clickable(content: string | JQuery<HTMLElement>, handler: JQuery.EventHandler<HTMLElement> | JQuery.EventHandlerBase<any, JQuery.Event<HTMLElement>> | false = false): JQuery<HTMLElement> {
    let base = typeof content == "string"?
        $("<span/>").append(content):content
    return base
        .addClass("clickable")
        .on("click", handler);
}