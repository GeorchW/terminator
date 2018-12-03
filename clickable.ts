function clickable(content: string | JQuery<HTMLElement>, handler: JQuery.EventHandler<HTMLElement> | JQuery.EventHandlerBase<any, JQuery.Event<HTMLElement>> | false = false): JQuery<HTMLElement> {
    return $("<span/>")
        .append(content)
        .addClass("clickable")
        .on("click", handler);
}