import { execAsync } from "./exec.js"

export const reboot = async () => {
    console.log("Rebooting...")
    await execAsync('shutdown /r /t 0')
}

export const shutdown = async () => {
    console.log("Shutting down...")
    await execAsync('shutdown /t 0')
}