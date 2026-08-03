import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import ToastContainer from "react-bootstrap/ToastContainer"
import Toast from "react-bootstrap/Toast"

type ToastType = 'error' | 'info'

interface ToastConfig {
    ts: number,
    type: ToastType,
    msg: string,
}

interface ToastsContext {
    info: (msg: string) => void;
    error: (msg: string) => void;
}

const ToastsContext = createContext<ToastsContext | undefined>(undefined)

export const useToasts = () => {
    const ctx = useContext(ToastsContext);
    if (!ctx) throw new Error('useToasts should have a parent <Toasts> component');

    return ctx;
}

export const ToastsProvider = (props: PropsWithChildren) => {
    const [toasts, setToasts] = useState<ToastConfig[]>([])

    const show = useCallback((type: ToastType, msg: string) => {
        setToasts(toasts => [{
            type,
            msg,
            ts: Date.now(),
        }, ...toasts])
    }, [setToasts])

    const ctx = useMemo(() => ({
        info: (msg: string) => {
            show('info', msg)
        },
        error: (msg: string) => {
            show('error', msg)
        },
    }), [show])

    const remove = useCallback((toast: ToastConfig) => {
        setToasts((toasts) => toasts.filter(t => t !== toast))
    }, [setToasts])


    return <ToastsContext.Provider value={ctx}>
        <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
            {toasts.map((toast) => <RenderToast key={`${toast.ts}_${toast.type}_${toast.msg}`} toast={toast} onClose={remove} />)}
        </ToastContainer>
        {props.children}
    </ToastsContext.Provider>
}

const RenderToast = (props: { toast: ToastConfig, onClose: (toast: ToastConfig) => void }) => {
    const { toast, onClose } = props;

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(toast)
        }, 3000)

        return () => {
            clearTimeout(timer);
        }
    }, [toast, onClose])

    const bg = useMemo(() => {
        if (toast.type === 'info') {
            return 'primary'
        }

        if (toast.type === 'error') {
            return 'danger'
        }

        return undefined
    }, [toast])

    return <Toast bg={bg}>
        <Toast.Body>{toast.msg}</Toast.Body>
    </Toast>
}