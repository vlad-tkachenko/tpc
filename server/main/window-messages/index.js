import { Browser } from "../browser.js"
import { Window } from "../window.js"

export const windowMessageHandler = (msg) => {
    if (msg?.type === 'pc/one/apps/list') {
        Browser.emit(msg.data.pc, "apps/list")
        Window.send.ok(msg.id)
        return
    }

    if (msg?.type === 'pc/all/lock') {
        Browser.emitAll("lock")
        Window.send.ok(msg.id)
        return
    }

    if (msg?.type === 'pc/one/lock') {
        Browser.emit(msg.data.pc, "lock")
        Window.send.ok(msg.id)
        return
    }

    if (msg?.type === 'pc/all/unlock') {
        Browser.emitAll("unlock")
        Window.send.ok(msg.id)
        return
    }

    if (msg?.type === 'pc/one/unlock') {
        Browser.emit(msg.data.pc, "unlock")
        Window.send.ok(msg.id)
        return
    }

    if (msg?.type === 'pc/all/reboot') {
        Browser.emitAll("reboot")
        Window.send.ok(msg.id)
        return
    }

    if (msg?.type === 'pc/one/reboot') {
        Browser.emitAll(msg.data.pc, "reboot")
        Window.send.ok(msg.id)
        return
    }

    if (msg?.type === 'pc/all/list') {
        Window.send.ok(msg.id, Browser.list())
        return
    }




    Window.send.error(msg.id, `Unknown message(#${msg.id}) type: ${msg.type}`)
}