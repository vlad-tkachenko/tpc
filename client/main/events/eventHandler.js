import { Apps } from "../utils/apps.js"
import { Window } from "../window.js"
import { reboot, shutdown } from "../utils/power.js"

export const eventHandler = async (socket, event, ...args) => {
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

    if (event === "registration") {
        Window.show("html/registration.html", {
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
        const installed = await Apps.getInstalled()
        socket.emit("apps/list", installed)
        return
    }

    if (event === "apps/uninstall") {
        const app = args[0].app
        console.log(`Uninstalling app ${app}`)

        let installed = await Apps.getInstalled();
        const cfg = installed.find(i => i.app === app);
        if (cfg?.uninstall.automatic) {
            console.log(cfg);
            await Apps.quietUninstall(cfg.uninstall.automatic)

            installed = await Apps.getInstalled()
            socket.emit("apps/list", installed)
        } else {
            console.error("Unable to uninstall app. Config not found")
        }
        return
    }

    console.log("Unsupported event:", event)
}