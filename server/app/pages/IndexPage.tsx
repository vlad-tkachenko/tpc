
import { useCallback, useEffect, useState } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Stack from 'react-bootstrap/Stack';
import { API } from '../api/api';
import { AsyncButton } from '../components/AsyncButton';
import { useNavigate } from '../nav';

import { BsBootstrapReboot } from "react-icons/bs";
import { RiShutDownLine } from "react-icons/ri";
import { IoReloadOutline } from "react-icons/io5";
import { FiLock, FiUnlock } from "react-icons/fi";

export const IndexPage = () => {
    const [list, setList] = useState<string[]>([])

    const refresh = useCallback(async () => {
        const list = await API.self.list()
        setList(list)
    }, [setList])

    useEffect(() => {
        refresh()
    }, [refresh])

    useEffect(() => {
        const type = "evt/pc/list/change";

        const listener = (list: string[]) => {
            setList(list)
        }
        API.subscribe(type, listener)

        return () => {
            API.unsubscribe(listener)
        }
    }, [setList])


    return <Container className={"my-3"}>
        <Stack direction="horizontal" gap={3}>
            <Stack direction="horizontal" gap={3} className="me-auto">
                <AsyncButton variant="light" onClick={API.all.lock} toast={"All PCs are now locked"} confirm>
                    <FiLock />
                    <span>Lock</span>
                </AsyncButton>
                <AsyncButton variant="secondary" onClick={API.all.unlock} toast={"All PCs are now unlocked"} confirm>
                    <FiUnlock />
                    <span>Unlock</span>
                </AsyncButton>
            </Stack>

            <Stack direction="horizontal" gap={3} className="me-auto">
                <AsyncButton variant="warning" onClick={API.all.reboot} toast={"All PCs are now rebooting"} confirm>
                    <BsBootstrapReboot />
                    <span>Reboot</span>
                </AsyncButton>
                <AsyncButton variant="danger" onClick={API.all.shutdown} toast={"All PCs are now shutting down"} confirm>
                    <RiShutDownLine />
                    <span>Shutdown</span>
                </AsyncButton>
            </Stack>
            
            <AsyncButton variant="primary" onClick={refresh} toast={"List refreshed"}>
                <IoReloadOutline />
                <span>Reload</span>
            </AsyncButton>
        </Stack>

        <ListGroup className='mt-4'>
            {list.map(l => <RenderPCItem key={l} pc={l} />)}
        </ListGroup>
    </Container>
}

const RenderPCItem = ({ pc }: { pc: string }) => {
    const navigate = useNavigate();

    const openPCPage = useCallback(() => {
        navigate("/pc", { pc })
    }, [pc, navigate])

    return <ListGroupItem action onClick={openPCPage}>{pc}</ListGroupItem>
}