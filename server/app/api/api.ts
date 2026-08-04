import { EventListeners } from "../utils/EventListeners";

interface ResponseMessage {
    id: number;
    ok: boolean;
    type?: string;
    error?: string;
    data?: any;
}

let lastMessageId = Date.now()
const responseListeners = new EventListeners<ResponseMessage>();

const send = async (type: string, data?: any): Promise<any> => {
    const id = lastMessageId++;

    (window as any).electronAPI.sendMessage({
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

    unsubscribe: (listener: (data: any) => void) => {
        const subscriber = subscribers.get(listener)
        if (subscriber) {
            subscribers.delete(listener);
            responseListeners.remove(subscriber)
        }
    },

    one: {
        lock: async (pc: string) => send("pc/one/lock", { pc }),
        unlock: async (pc: string) => send("pc/one/unlock", { pc }),
        reboot: async (pc: string) => send("pc/one/reboot", { pc }),
        apps: {
            list: async (pc: string) => send("pc/one/apps/list", { pc }),
        }
    },

    all: {
        list: async (): Promise<string[]> => send("pc/all/list"),
        lock: async () => send("pc/all/lock"),
        unlock: async () => send("pc/all/unlock"),
        reboot: async () => send("pc/all/reboot"),
    }
}