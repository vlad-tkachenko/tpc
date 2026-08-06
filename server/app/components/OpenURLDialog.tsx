import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useCallback, useState } from 'react';
import { Form } from 'react-bootstrap';

export interface OpenURLDialogProps {
    show: boolean;
    onCancel: () => void;
    onSubmit: (url: string) => void;
}

export const OpenURLDialog = (props: OpenURLDialogProps) => {
    const { show, onCancel, onSubmit, } = props;
    const [url, setURL] = useState("")

    const onConfirm = useCallback(() => {
        if (!url.length) return;
        onSubmit(url)
    }, [url, onSubmit]);

    return <Modal show={show} onHide={onCancel}>
        <Modal.Header closeButton>
            <Modal.Title>Open URL</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group>
                    <Form.Label>URL address</Form.Label>
                    <Form.Control type="text" placeholder="Enter URL" onChange={(e) => setURL(e.target.value)} />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onCancel}>
                Cancel
            </Button>
            <Button variant="primary" onClick={onConfirm}>
                Confirm
            </Button>
        </Modal.Footer>
    </Modal>
}