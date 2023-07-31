import * as React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

// {children}> 태그 안에 원하시는 레이아웃 작성하시면 됩니다.
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
