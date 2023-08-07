import React, { useState } from 'react';
import { Button, Modal, Box, Typography } from '@mui/material';

interface ModalExampleProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

const ModalExample: React.FC<ModalExampleProps> = ({ isOpen, onClose, title, message }) => {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                <Typography id="modal-title" variant="h6" component="h2">
                    {title}
                </Typography>
                <Typography id="modal-description" sx={{ mt: 2 }}>
                    {message}
                </Typography>
                <Box sx={{ position: 'absolute', bottom: 10, right: 10 }}>
                    <Button variant="contained" onClick={onClose} sx={{ mt: 2 }}>닫기</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalExample;
