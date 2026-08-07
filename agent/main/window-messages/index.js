import { Server } from "../server.js";
import { Window } from "../window.js";

export const windowMessageHandler = (msg) => {
    if (!msg) return;

    if (msg.target === 'server') {
        Server.emit(msg.type, msg.data)
        return
    }

    if (msg.target === 'self') {
         if (msg.type === 'window/close') {
            Window.close()
            return
        }
    }
}