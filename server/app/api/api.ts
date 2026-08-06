import { EventListeners } from "../utils/EventListeners";

export enum PCRequestType {
    lock = "lock",
    unlock = "unlock",
    open = "open",
    registration = "registration",
    reboot = "reboot",
    shutdown = "shutdown",
    apps_list = "apps/list",
    apps_uninstall = "apps/uninstall"
}

export enum SelfRequestType {
    all_list = "all/list",
    debug = "debug",
}

interface ResponseMessage {
    id: number;
    ok: boolean;
    type?: string;
    error?: string;
    data?: any;
}

let lastMessageId = Date.now()
const responseListeners = new EventListeners<ResponseMessage>();

const send = async (target: 'self' | 'all' | 'one', type: string, data?: any): Promise<any> => {
    const id = lastMessageId++;

    (window as any).electronAPI.sendMessage({
        target,
        type,
        data,
        id,
    });

    return new Promise<ResponseMessage>((res, rej) => {
        const listener = (event: ResponseMessage) => {
            if (event.id === id) {
                responseListeners.remove(listener)
                if (event.ok) {
                    res(event.data)
                } else {
                    rej(new Error(event.error || 'Unknown error occurred'))
                }
            }
        }

        responseListeners.add(listener)
    })
}


(window as any).electronAPI.onReceiveMessage((r: ResponseMessage) => {
    responseListeners.onEvent(r)
});

const subscribers = new Map<(data: any) => void, (evt: ResponseMessage) => void>()

export const API = {
    subscribe: (type: string, listener: (data: any) => void) => {
        const subscriber = (evt: ResponseMessage) => {
            if (evt.type === type) {
                listener(evt.data)
            }
        }
        subscribers.set(listener, subscriber)
        responseListeners.add(subscriber)
    },

    subscribeToAll: (listener: (data: {
        type: string,
        data: any,
    }) => void) => {
        const subscriber = (evt: ResponseMessage) => {
            if (evt.type) {
                listener({ type: evt.type, data: evt.data })
            }
        }
        subscribers.set(listener, subscriber)
        responseListeners.add(subscriber)
    },

    unsubscribe: (listener: (data: any) => void) => {
        const subscriber = subscribers.get(listener)
        if (subscriber) {
            subscribers.delete(listener);
            responseListeners.remove(subscriber)
        }
    },

    self: {
        list: async (): Promise<string[]> => send("self", SelfRequestType.all_list),
        debug: async () => send("self", SelfRequestType.debug),
    },

    one: {
        open: async (pc: string, url: string) => send("one", PCRequestType.open, { pc, url }),
        lock: async (pc: string) => send("one", PCRequestType.lock, { pc }),
        unlock: async (pc: string) => send("one", PCRequestType.unlock, { pc }),
        reboot: async (pc: string) => send("one", PCRequestType.reboot, { pc }),
        shutdown: async (pc: string) => send("one", PCRequestType.shutdown, { pc }),
        registration: async (pc: string) => send("one", PCRequestType.registration, { pc }),

        apps: {
            list: async (pc: string) => send("one", PCRequestType.apps_list, { pc }),
            uninstall: async (pc: string, app: string) => send("one", PCRequestType.apps_uninstall, { pc, app }),
        }
    },

    all: {
        open: async (url: string) => send("all", PCRequestType.open, { url }),
        lock: async () => send("all", PCRequestType.lock),
        unlock: async () => send("all", PCRequestType.unlock),
        reboot: async () => send("all", PCRequestType.reboot),
        shutdown: async () => send("all", PCRequestType.shutdown),
        registration: async () => send("all", PCRequestType.registration),
    },
}