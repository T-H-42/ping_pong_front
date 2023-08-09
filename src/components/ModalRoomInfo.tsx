import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Box, Typography, TextField, Switch, FormControlLabel, Alert } from '@mui/material';
import { SocketContext } from '../api/SocketContext';
import Profile from './Profile';
import { usernameState } from '@src/api/atoms';

interface ModalExampleProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

interface Response {
    success: boolean;
    payload: string;
}

const ModalUser = ({ userName, right }) => {
    const [open, setOpen] = useState(false);

    const handleProfileOpen = () => {
        setOpen(true);
    };

    const handleProfileClose = () => {
        setOpen(false);
    };
    return (
        <>
            <Button variant="contained" onClick={() => handleProfileOpen()}>
                {userName} - {right}
            </Button>
            <Modal open={open} onClose={handleProfileClose}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                    <Profile username={userName} right={right}></Profile>
                </Box>
            </Modal>
        </>
    );
};

const ModalRoomInfo: React.FC<ModalExampleProps> = ({ isOpen, onClose, title, message }) => {
    console.log('모달룸인포');
    const { chatSocket } = useContext(SocketContext);
    const navigate = useNavigate();
    const roomName = localStorage.getItem('room-name');
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        chatSocket.emit('ft_getUserListInRoom', roomName, (response: any) => {
            console.log('ft_getUserListInRoom: ', response);
            setFriends(response);
        });
    }, []);

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, height: 500, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                {/* {showAlert && <Alert severity="error">방제목과 인원 수를 입력해주세요.</Alert>} */}
                <Typography id="modal-title" variant="h6" component="h2">
                    {title}
                </Typography>
                <ul style={{ listStyle: 'none' }}>
                    {friends.map((element, index) => (
                        <li key={index} style={{ marginBottom: '10px' }}>
                            <ModalUser userName={element.username} right={element.right} />
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
                            backgroundColor: 'red', // Keep the same color on hover
                        },
                    }}>닫기</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalRoomInfo;
