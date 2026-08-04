
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import { API } from '../api/api';
import { AsyncButton } from '../components/AsyncButton';
import { useCallback } from 'react';
import { PCAppsList } from './pc/PCAppsList';


export const PCPage = (props: { pc: string }) => {
    const { pc } = props;

    const lock = useCallback(async () => {
        await API.one.lock(pc);
    }, [pc])
    
    const unlock = useCallback(async () => {
        await API.one.unlock(pc);
    }, [pc])

    const reboot = useCallback(async () => {
        await API.one.reboot(pc);
    }, [pc])

    return <Container className={"my-3"}>
        <Stack direction="horizontal" gap={3}>
            <AsyncButton variant="danger" onClick={lock} toast={"PC is now locked"}>Lock</AsyncButton>
            <AsyncButton variant="warning" onClick={unlock} toast={"PC is now unlocked"}>Unlock</AsyncButton>
            <AsyncButton variant="danger" onClick={reboot} toast={"PC is now rebooting"}>Reboot</AsyncButton>
        </Stack>

        <PCAppsList pc={pc} />
    </Container>
}