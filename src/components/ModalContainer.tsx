import * as React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

export default function ModalContainer({ open, handleClose, children }) {
    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                {children}
            </Modal>
        </div>
    );
}
