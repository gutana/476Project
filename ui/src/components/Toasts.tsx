import React, { Dispatch, SetStateAction } from 'react';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';

interface Props {
    show: boolean
    setShow: Dispatch<SetStateAction<boolean>>
    variant: string
    title: string
    message: string
}

export default function Toasts({show, setShow, variant, title, message}: Props) {
  return (
    <ToastContainer position='bottom-end' containerPosition='fixed' className='p-3'>
        <Toast bg={variant} onClose={() => setShow(false)} show={show} delay={3000} autohide>
            <Toast.Header>
            <strong className="me-auto">{title}</strong>
            </Toast.Header>
            <Toast.Body color='black'>{message}</Toast.Body>
        </Toast>
    </ToastContainer>
  );
}
