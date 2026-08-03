
import { useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import { API } from '../api/Api';
import { useToasts } from '../components/Toasts';

export const IndexPage = () => {
    const toasts = useToasts()

    const lock = useCallback(() => {
        API.all.lock()
        toasts.info("All PCs are now locked");
    }, [toasts])

    const unlock = useCallback(() => {
        API.all.unlock()
        toasts.info("All PCs are now unlocked");
    }, [toasts])

    return <Container className={"my-3"}>
        <Stack direction="horizontal" gap={3}>
            <Button variant="danger" onClick={lock}>Lock</Button>
            <Button variant="warning" onClick={unlock}>Unlock</Button>
        </Stack>
    </Container>
}