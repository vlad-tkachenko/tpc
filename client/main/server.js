import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { Bonjour } from "bonjour-service";
import { Window } from "./window.js";
import { eventHandler } from "../events/eventHandler.js";

const SERVER_NAME = process.env.TPC_CLIENT_NAME || `tpc-client-${Date.now()}`;

const httpServer = createServer();
const io = new SocketIOServer(httpServer, {
    cors: { origin: "*" }
});

const bonjour = new Bonjour();

io.on("connection", (socket) => {
    console.log(`[${SERVER_NAME}] Client connected: ${socket.id}`);

    socket.onAny((event, ...args) => {
        eventHandler(socket, event, ...args)
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