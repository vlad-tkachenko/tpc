import { Bonjour } from "bonjour-service";
import { io } from "socket.io-client";
import { eventHandler } from "./events/index.js";
import { Window } from "./window.js";

const bonjour = new Bonjour();
// Stores { serviceKey: { socket, service } }
const activeConnections = new Map();
let browser;

const RESCAN_INTERVAL_MS = 5000;
let rescan;

const onChange = () => {
  Window.event("evt/pc/list/change", Browser.list())
}


export const Browser = {
  shutdown: () => {
    clearInterval(rescan);
    browser?.stop();
    // Close all open sockets on shutdown
    for (const { socket } of activeConnections.values()) {
      socket.disconnect();
    }
    activeConnections.clear();
    onChange();
  },

  list: () => {
    const result = []
    for (const key of activeConnections.keys()) {
      result.push(key)
    }
    return result
  },

  init: () => {
    browser = bonjour.find({ type: "tpc-client", protocol: "tcp" });

    browser.on("up", (service) => {
      const serviceKey = service.name || service.fqdn;

      // Check if we already have an ACTIVE connection to this specific port
      const existing = activeConnections.get(serviceKey);
      if (existing && existing.port === service.port && existing.socket.connected) {
        return; // Same server, same port already connected
      }

      // If the port changed for the same service name, disconnect the old socket first
      if (existing) {
        existing.socket.removeAllListeners();
        existing.socket.disconnect();
        activeConnections.delete(serviceKey);
        onChange()
      }

      const hostIp = service.addresses?.find((addr) => addr.includes(".")) || service.referer?.address;
      if (!hostIp) return;

      const targetUrl = `http://${hostIp}:${service.port}`;
      console.log(`[Discovery] Server "${service.name}" available at dynamic port ${service.port}`);

      const socket = io(targetUrl, {
        transports: ["websocket", "polling"],
        reconnection: false // Turn OFF auto-reconnect because the port will be different on restart!
      });

      // Track connection along with the current port number
      const connection = { socket, port: service.port }
      activeConnections.set(serviceKey, connection);
      onChange()

      socket.onAny((event, ...args) => {
        eventHandler(serviceKey, event, args[0])
      });

      socket.on("connect", () => {
        console.log(`[Connected] Joined ${service.name} on port ${service.port} (${socket.id})`);
      });

      socket.on("disconnect", (reason) => {
        console.log(`[Disconnected] ${service.name} (port ${service.port}) lost: ${reason}`);

        // Clean up socket listener and delete connection map entry
        socket.removeAllListeners();
        activeConnections.delete(serviceKey);
        onChange()

        // Force purge from Bonjour browser cache so mDNS can re-trigger 'up' when the server gets its new port
        if (browser?.services) {
          const idx = browser.services.findIndex((s) => (s.fqdn || s.name) === serviceKey);
          if (idx !== -1) browser.services.splice(idx, 1);
        }
      });
    });

    browser.on("down", (service) => {
      const serviceKey = service.fqdn || service.name;
      console.log(`[Discovery] mDNS down: ${service.name}`);

      if (activeConnections.has(serviceKey)) {
        const { socket } = activeConnections.get(serviceKey);
        socket.removeAllListeners();
        socket.disconnect();
        activeConnections.delete(serviceKey);
      }
    });

    // Rescan interval to trigger queries
    rescan = setInterval(() => {
      browser.update();
    }, RESCAN_INTERVAL_MS);
  },

  emit: (serviceKey, eventName, data) => {
    const connection = activeConnections.get(serviceKey);
    if (connection?.socket?.connected) {
      console.log(`[${serviceKey}] Emitting ${eventName} with data:`, data)
      connection.socket.emit(eventName, data);
    }
  },

  emitAll: (eventName, data) => {
    for (const { socket } of activeConnections.values()) {
      if (socket.connected) {
        socket.emit(eventName, data);
      }
    }
  }
};