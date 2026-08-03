const send = (type: string, data?: any) => {
    (window as any).electronAPI.sendMessage({
        type,
        data,
    });
}

export const API = {
    all: {
        lock: () => send("lock"),
        unlock: () => send("unlock"),
    }
}