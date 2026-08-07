import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export interface ConfirmDialogProps {
    show: boolean;
    onCancel: () => void;
    onConfirm: () => void;

    title: string;
    description: string;
    confirm?: string;
    cancel?: string;
}

export const ConfirmDialog = (props: ConfirmDialogProps) => {
    const { show, onCancel, onConfirm, title, description, confirm, cancel } = props;

    return <Modal show={show} onHide={onCancel}>
        <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{description}</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onCancel}>
                {cancel || 'Cancel'}
            </Button>
            <Button variant="primary" onClick={onConfirm}>
                {confirm || 'Confirm'}
            </Button>
        </Modal.Footer>
    </Modal>
}