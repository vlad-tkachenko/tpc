import { useCallback, useEffect, useState } from 'react';
import { ListGroupItem, Stack } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
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
        await API.one.apps.list(pc)
    }, [pc])

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

    return <ListGroup className='mt-4'>
        {list.map((l, i) => <RenderAppItem key={`${i}-${l.app}`} pc={pc} app={l} />)}
    </ListGroup>
}

const RenderAppItem = ({ pc, app }: { pc: string, app: App }) => {
    const deleteApp = useCallback(() => {

    }, [])

    return <ListGroupItem action>
        <Stack direction="horizontal" gap={3}>
            <div className="p-2 me-auto">{app.app}</div>
            <div className="p-2"><AsyncButton onClick={deleteApp}>Delete</AsyncButton></div>
        </Stack>
    </ListGroupItem>
}