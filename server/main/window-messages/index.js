import { Browser } from "../browser.js"

export const windowMessageHandler = (msg) => {
    if (msg?.type == 'lock') {
        Browser.emitAll("lock")
        return
    }

    if (msg?.type == 'unlock') {
        Browser.emitAll("unlock")
        return
    }
}