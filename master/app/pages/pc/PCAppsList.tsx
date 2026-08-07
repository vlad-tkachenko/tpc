import { useCallback, useEffect, useState } from 'react';
import { ListGroupItem, Stack } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import { IoReloadOutline } from 'react-icons/io5';
import { API } from '../../api/api';
import { AsyncButton } from '../../components/AsyncButton';

interface App {
    app: string;
    version: string;
    publisher: string;
    location: string;
    uninstall: {
        automatic?: string | null;
        manual: string;
    },
}

export const PCAppsList = (props: { pc: string }) => {
    const { pc } = props
    const [list, setList] = useState<App[]>([])

    const refresh = useCallback(async () => {
        setList([])
        await API.one.apps.list(pc)
    }, [pc, setList])

    useEffect(() => {
        refresh()
    }, [refresh])

    useEffect(() => {
        const type = "evt/pc/one/" + pc;

        const listener = (msg: {
            event: string,
            data: any
        }) => {
            if (msg.event === 'apps/list') {
                setList(msg.data)
            }
        }
        API.subscribe(type, listener)

        return () => {
            API.unsubscribe(listener)
        }
    }, [setList, pc])

    return <ListGroup>
        {list.length > 0 ?
            <div className='ms-auto my-2'>
                <AsyncButton variant="info" onClick={refresh}>
                    <IoReloadOutline />
                    <span>Refresh</span>
                </AsyncButton>
            </div>
            : null}
        {list.map((l, i) => <RenderAppItem key={`${i}-${l.app}`} pc={pc} app={l} />)}
        {list.length === 0 ? <Spinner animation="border" className="mx-auto my-4" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner> : null}
    </ListGroup>
}

const RenderAppItem = ({ pc, app: { app, uninstall } }: { pc: string, app: App }) => {
    const deleteApp = useCallback(async () => {
        await API.one.apps.uninstall(pc, app)
    }, [pc, app])

    return <ListGroupItem action>
        <Stack direction="horizontal" gap={3}>
            <div className="p-2 me-auto">{app}</div>
            {uninstall.automatic ?
                <div className="p-2"><AsyncButton onClick={deleteApp} toast='Removing app...' confirm>Delete</AsyncButton></div>
                : null}
        </Stack>
    </ListGroupItem>
}