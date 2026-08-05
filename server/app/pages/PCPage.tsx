
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import { API } from '../api/api';
import { AsyncButton } from '../components/AsyncButton';
import { useCallback } from 'react';
import { PCAppsList } from './pc/PCAppsList';

import { BsBootstrapReboot } from "react-icons/bs";
import { RiShutDownLine } from "react-icons/ri";
import { IoReloadOutline } from "react-icons/io5";
import { FiLock, FiUnlock } from "react-icons/fi";

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

    const shutdown = useCallback(async () => {
        await API.one.shutdown(pc);
    }, [pc])

    return <Container className={"my-3"}>
        <h1 className='mb-4'>{pc}</h1>
        <Stack direction="horizontal" gap={3}>
            <Stack direction="horizontal" gap={3} className="me-auto">
                <AsyncButton variant="light" onClick={lock} toast={"PC is now locked"} confirm>
                    <FiLock />
                    <span>Lock</span>
                </AsyncButton>
                <AsyncButton variant="secondary" onClick={unlock} toast={"PC is now unlocked"} confirm>
                    <FiUnlock />
                    <span>Unlock</span>
                </AsyncButton>
            </Stack>

            <Stack direction="horizontal" gap={3}>
                <AsyncButton variant="warning" onClick={reboot} toast={"PC is now rebooting"} confirm>
                    <BsBootstrapReboot />
                    <span>Reboot</span>
                </AsyncButton>
                <AsyncButton variant="danger" onClick={shutdown} toast={"PC is now shutting down"} confirm>
                    <RiShutDownLine />
                    <span>Shutdown</span>
                </AsyncButton>
            </Stack>
        </Stack>

        <PCAppsList pc={pc} />
    </Container>
}