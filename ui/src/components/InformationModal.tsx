import { Button, Modal } from "react-bootstrap"

interface Props {
    showModal: boolean,
    handleClose: () => void,
    title: string,
    body: string,
    closeButtonText: string
}

export const InformationModal = ({ showModal, handleClose, title, body, closeButtonText }: Props) => {
    return (

        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    {closeButtonText}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}