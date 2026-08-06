import { Browser } from "../browser.js"
import { Window } from "../window.js"

export const windowMessageHandler = (msg) => {
    if (!msg) return;

    // if target is missing, emit to all
    if (msg.target === 'self') {
        if (msg.type === 'all/list') {
            Window.send.ok(msg.id, Browser.list())
            Window.send.ok(msg.id)
            return
        }
       
        if (msg.type === 'debug') {
            Window.openDevTools()
            Window.send.ok(msg.id)
            return
        }

        Window.send.error(msg.id, `Unknown message(#${msg.id}) type: ${msg.type}`)
        return
    }

    if (msg.target === 'all') {
        Browser.emitAll(msg.type)
        Window.send.ok(msg.id)
        return
    }

    if (msg.target === 'one') {
        Browser.emit(msg.data.pc, msg.type, msg.data)
        Window.send.ok(msg.id)
        return
    }

    Window.send.error(msg.id, `Unknown message(#${msg.id}) type: ${msg.type}`)
}