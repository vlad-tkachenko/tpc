import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { API } from "./api/api";

interface Registration {
    class: string;
    users: { firstName: string, lastName: string }[]
}

interface StorageContext {
    registrations: Record<string, Registration>
    clearRegistrations: () => void;
    clearRegistration: (pc: string) => void;
    updateRegistration: (pc: string, registration: Registration) => void;
}

const StorageContext = createContext<StorageContext | undefined>(undefined)

export const useStorageContext = () => {
    const ctx = useContext(StorageContext);
    if (!ctx) throw new Error('useStorageContext should have a parent <StorageProvider> component');

    return ctx;
};

export const StorageProvider = (props: PropsWithChildren) => {
    const [registrations, setRegistrations] = useState<Record<string, Registration>>(() => {
        const lsValue = localStorage.getItem("registrations")
        console.log(lsValue);

        if (!lsValue) return {}

        return JSON.parse(lsValue)
    });

    useEffect(() => {
        console.log(registrations);
        localStorage.setItem("registrations", JSON.stringify(registrations))
    }, [registrations])

    const ctx = useMemo(() => ({
        registrations,
        clearRegistrations: () => {
            setRegistrations({})
        },
        clearRegistration: (pc: string) => {
            setRegistrations(prevValue => {
                const value = { ...prevValue }
                delete value[pc];
                return value;
            })
        },
        updateRegistration: (pc: string, registration: Registration) => {
            setRegistrations(prevValue => {
                return { ...prevValue, [pc]: registration }
            })
        },
    }), [registrations, setRegistrations])

    useEffect(() => {
        const listener = (msg: {
            type: string,
            data: {
                event: string,
                data: any,
                service: string,
            }
        }) => {
            console.log(msg);
            if (msg.data.event === 'registration') {
                setRegistrations(prevValue => {
                    return { ...prevValue, [msg.data.service]: msg.data.data }
                })
            }
        }
        API.subscribeToAll(listener)

        return () => {
            API.unsubscribe(listener)
        }
    }, [setRegistrations])

    return <StorageContext.Provider value={ctx}>
        {props.children}
    </StorageContext.Provider>
}