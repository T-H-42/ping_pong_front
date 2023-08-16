import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Box, Typography, TextField, Switch, FormControlLabel, Alert } from '@mui/material';
import { SocketContext } from '../api/SocketContext';

interface ModalExampleProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    friends: any[];
}

interface Response {
    success: boolean;
    payload: string;
}

const ModalRoomInvitation: React.FC<ModalExampleProps> = ({ isOpen, onClose, title, friends }) => {
    const { chatSocket } = useContext(SocketContext);
    const navigate = useNavigate();
    const roomName = localStorage.getItem('room-name');

    const handleFriendClick = (e) => {
        chatSocket.emit('ft_invitechat', { roomName, targetUser: e }, (res: any) => {
            console.log('ft_invitechat emit: ', res);
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
                    {'초대할 친구를 선택하세요.'}
                </Typography>

                <ul style={{ listStyle: 'none' }}>
                    {friends.map((element, index) => (
                        <li key={index} style={{ marginBottom: '10px' }}>
                            <Button variant="contained" onClick={() => handleFriendClick(element.username)}>
                                {element.username}
                            </Button>
                        </li>
                    ))}
                </ul>

                <Box sx={{ position: 'absolute', bottom: 20, right: 10 }}>
                    <Button variant="contained" onClick={onClose} sx={{
                        mt: 2,
                        mx: 1,
                        backgroundColor: 'red',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'red',
                        },
                    }}>닫기</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalRoomInvitation;