import { Apps } from "../utils/apps.js"
import { Window } from "../window.js"
import { reboot, shutdown } from "../utils/power.js"

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
    
    if (event === "shutdown") {
        shutdown()
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