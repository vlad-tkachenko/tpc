import { useEffectEvent, useState, type PropsWithChildren } from 'react';
import Button from 'react-bootstrap/Button';
import { useToasts } from './Toasts';

export interface AsyncButtonProps {
    variant?: string;
    onClick: () => Promise<void> | void;
    toast?: string;
}

export const AsyncButton = (props: PropsWithChildren<AsyncButtonProps>) => {
    const { children, variant, onClick, toast } = props;
    const [processing, setProcessing] = useState(false)
    const toasts = useToasts()

    const onClickHandlerEvent = useEffectEvent(() => {
        if (processing) return;

        setProcessing(true)
        const promise = onClick()
        if (promise) {
            promise
                .then(() => {
                    if (toast) {
                        toasts.info(toast)
                    }
                })
                .catch((e) => {
                    toasts.error(e?.message || 'Unknown error occurred')
                })
                .finally(() => {
                    setProcessing(false)
                })
        } else {
            setProcessing(false)
        }
    })

    return <Button variant={variant} onClick={onClickHandlerEvent} disabled={processing}>{children}</Button>
}