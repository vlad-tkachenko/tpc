import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { Bonjour } from "bonjour-service";
import { Window } from "./window.js";

const INSTANCE = process.argv[2]
const SERVER_NAME = process.env.INSTANCE_NAME || `tpc-client-${INSTANCE || 0}`;

const httpServer = createServer();
const io = new SocketIOServer(httpServer, {
    cors: { origin: "*" }
});

const bonjour = new Bonjour();

io.on("connection", (socket) => {
    console.log(`[${SERVER_NAME}] Client connected: ${socket.id}`);

    socket.on("unlock", () => {
        Window.close()
    })
    
    socket.on("lock", () => {
        Window.show("html/lock.html", {
            fullscreen: true,
            locked: true,
        })
    })

    socket.on("ping-server", (data) => {
        socket.emit("pong-client", { from: SERVER_NAME, received: data });
    });
});

export const Server = {
    connect: () => {
        httpServer.listen(0, () => {
            const { port } = httpServer.address();
            console.log(`Socket.io server running on port ${port}`);

            const service = bonjour.publish({
                name: SERVER_NAME,
                type: "tpc-client",
                protocol: "tcp",
                port,
                txt: { version: "1.0.0" }
            });

            service.on("up", () => {
                console.log(`[Bonjour] Service "${SERVER_NAME}" published.`);
            });
        });
    },

    disconnect: () => {
        bonjour.unpublishAll(() => {
            bonjour.destroy();
        });
    }
}