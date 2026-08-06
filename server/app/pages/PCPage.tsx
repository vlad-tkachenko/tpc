
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import { API } from '../api/api';
import { AsyncButton } from '../components/AsyncButton';
import { useCallback, useEffect } from 'react';
import { PCAppsList } from './pc/PCAppsList';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { BsBootstrapReboot } from "react-icons/bs";
import { RiShutDownLine } from "react-icons/ri";
import { IoReloadOutline } from "react-icons/io5";
import { FiLock, FiUnlock } from "react-icons/fi";
import { useNavigate } from '../nav';
import { PiSignInBold } from 'react-icons/pi';
import { useStorageContext } from '../storage';
import { Badge, Button, Col, Row } from 'react-bootstrap';

export const PCPage = (props: { pc: string }) => {
    const { pc } = props;
    const { clearRegistration } = useStorageContext()
    const navigate = useNavigate();

    const { registrations } = useStorageContext();
    const registrationRecord = registrations[pc]

    const lock = useCallback(async () => {
        await API.one.lock(pc);
    }, [pc])

    const registration = useCallback(async () => {
        clearRegistration(pc)
        await API.one.registration(pc);
    }, [pc, clearRegistration])

    const unlock = useCallback(async () => {
        await API.one.unlock(pc);
    }, [pc])

    const reboot = useCallback(async () => {
        await API.one.reboot(pc);
    }, [pc])

    const shutdown = useCallback(async () => {
        await API.one.shutdown(pc);
    }, [pc])

    const back = useCallback(() => {
        navigate("/")
    }, [navigate])

    useEffect(() => {
        const type = "evt/pc/list/change";

        const listener = (list: string[]) => {
            // disconnected
            if (list.indexOf(pc) < 0) {
                navigate("/")
            }
        }
        API.subscribe(type, listener)

        return () => {
            API.unsubscribe(listener)
        }
    }, [pc, navigate])

    return <Container className={"my-3"}>
        <Button variant='link' onClick={back}>&lt; Back</Button>
        <h1 className='mb-4'>{pc}</h1>
        {registrationRecord ?
            <Row className="my-4">
                <Col>
                    <Badge bg="success">{registrationRecord.class}</Badge>
                    {registrationRecord.users.map((u, i) => {
                        return <Badge bg="secondary" className={"ms-2"} key={`${i}-${u.firstName}-${u.firstName}`}>{u.lastName} {u.firstName}</Badge >
                    })}
                </Col>
            </Row>
            : null}
        <Stack direction="horizontal" gap={3}>
            <Stack direction="horizontal" gap={3} className="me-auto">
                <AsyncButton variant="info" onClick={registration} toast={"PC is now awaiting registration"} confirm>
                    <PiSignInBold />
                    <span>Registration</span>
                </AsyncButton>
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

        <Tabs
            className="mt-4"
            defaultActiveKey="apps"
        >
            <Tab eventKey="apps" title="Apps" className='border p-2'>
                <PCAppsList pc={pc} />
            </Tab>
        </Tabs>

    </Container>
}