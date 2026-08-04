import { Apps } from "../main/apps.js"
import { Window } from "../main/window.js"
import { reboot } from "./reboot.js"

export const eventHandler = (socket, event, ...args) => {
    if (event === "unlock") {
        Window.close()
        return
    }

    if (event === "lock") {
        Window.show("html/lock.html", {
            fullscreen: true,
            locked: true,
        })
        return
    }

    if (event === "reboot") {
        reboot()
        return
    }

    if (event === "apps/list") {
        console.log("Listing installed apps")
        Apps.getInstalled().then((installed) => {
            console.log("Emitting installed apps list")
            socket.emit("apps/list", installed)
        })
        return
    }
}