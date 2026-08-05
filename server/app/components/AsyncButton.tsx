import { useCallback, useEffectEvent, useState, type PropsWithChildren } from 'react';
import Button from 'react-bootstrap/Button';
import { useToasts } from './Toasts';
import { ConfirmDialog } from './ConfirmDialog';
import { Stack } from 'react-bootstrap';

export interface AsyncButtonProps {
    variant?: string;
    onClick: () => Promise<void> | void;
    toast?: string;
    confirm?: boolean;
}

export const AsyncButton = (props: PropsWithChildren<AsyncButtonProps>) => {
    const { children, variant, onClick, toast, confirm } = props;
    const [processing, setProcessing] = useState(false)
    const toasts = useToasts()
    const [showDialog, setShowDialog] = useState(false);

    const onShowDialog = useEffectEvent(() => {
        setShowDialog(true)
    })

    const onCancel = useEffectEvent(() => {
        setShowDialog(false)
    })

    const onConfirm = useEffectEvent(() => {
        setShowDialog(false)

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

    return <>
        <Button variant={variant} onClick={confirm ? onShowDialog : onConfirm} disabled={processing}>
            <Stack gap={2} direction='horizontal'>
                {children}
            </Stack>
        </Button>
        {confirm ?
            <ConfirmDialog
                show={showDialog}
                onCancel={onCancel}
                onConfirm={onConfirm}
                title="Are you sure?"
                description="This operation is final and could not be reverted"
            />
            : null}
    </>
}