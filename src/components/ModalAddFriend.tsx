import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Box, Typography, TextField, Switch, FormControlLabel, Alert } from '@mui/material';
import { SocketContext } from '../api/SocketContext';

interface ModalExampleProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    sender: string;
    receiver: string;
}

interface Response {
    success: boolean;
    payload: string;
}

const ModalAddFriend: React.FC<ModalExampleProps> = ({ isOpen, onClose, title, sender, receiver }) => {
    const { chatSocket } = useContext(SocketContext);
    const navigate = useNavigate();

    const onAccept = () => {
        chatSocket.emit('ft_acceptfriend', {receiver, sender}, (response) => {
            console.log('ft_acceptfriend: ', response);
            onClose();
        });
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, height: 300, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                
                <Typography id="modal-title" variant="h6" component="h2">
                    {title}
                </Typography>
                <Typography id="modal-description" sx={{ mt: 2 }}>
                    {sender + '님의 친구 요청을 수락하시겠습니까?'}
                </Typography>
                
                <Box sx={{ position: 'absolute', bottom: 20, right: 10 }}>
                    <Button variant="contained" onClick={onAccept} sx={{ mt: 2 }}>수락</Button>
                    <Button variant="contained" onClick={onClose} sx={{
                        mt: 2,
                        mx: 1,
                        backgroundColor: 'red',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'red', // Keep the same color on hover
                        },
                    }}>거절</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalAddFriend;