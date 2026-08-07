import { Window } from "../window.js"

export const eventHandler = (serviceKey, event, data) => {
    Window.event(
        "evt/pc/one/" + serviceKey,
        {
            event,
            data,
            service: serviceKey,
        })
}