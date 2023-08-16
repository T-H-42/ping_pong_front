import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Box, Typography, TextField, Switch, FormControlLabel, Alert } from '@mui/material';
import { SocketContext } from '../api/SocketContext';
import { usernameState } from '@src/api/atoms';

import { useSetRecoilState, useRecoilValue } from 'recoil';
import { roomFriendsState } from '../api/atoms';

import Profile from './Profile';

interface ModalExampleProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    friends: any[];
    right: number;
    chats: any[];
    setChats: (data: any[]) => void;
}

interface Response {
    success: boolean;
    payload: string;
}

// const ModalUser = ({ userName, right }) => {
//     const [open, setOpen] = useState(false);

//     const handleProfileOpen = () => {
//         setOpen(true);
//     };

//     const handleProfileClose = () => {
//         setOpen(false);
//     };
//     return (
//         <>
//             <Button variant="contained" onClick={() => handleProfileOpen()}>
//                 {userName} - {right}
//             </Button>
//             <Modal open={open} onClose={handleProfileClose}>
//                 <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
//                     <Profile username={userName} right={right}></Profile>
//                 </Box>
//             </Modal>
//         </>
//     );
// };

const ModalRoomInfo: React.FC<ModalExampleProps> = ({ isOpen, onClose, title, friends, right, chats, setChats }) => {
    console.log('모달룸인포');
    const { chatSocket } = useContext(SocketContext);
    const navigate = useNavigate();
    const roomName = localStorage.getItem('room-name');
    const [profile, setProfile] = useState(false);
    const [username, setUsername] = useState('');

    const handleCloseModal = () => {
        setProfile(false); // 모달이 닫힐 때 profile 상태를 false로 설정합니다.
        // onClose(); // 모달을 닫습니다.
    };

    const handleFriendClick = (e) => {
        setProfile(true);
        setUsername(e.username);
        // const targetUser = e.username;
        // chatSocket.emit('ft_addAdmin', { roomName, targetUser }, (response: any) => {
        //     console.log('ft_addAdmin: ', response);
        //     if (!response.success) {
        //         return;
        //     }
        //     setChats([...chats, response]);
        // });
    };

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
                            {element.right === 0 ? <Button variant="contained" onClick={() => handleFriendClick(element)}>
                                {element.username} - {element.right}
                            </Button> : null}
                            {element.right === 1 ? <Button variant="contained" onClick={() => handleFriendClick(element)} sx={{
                                backgroundColor: 'green',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'green',
                                },
                            }}>
                                {element.username} - {element.right}
                            </Button> : null}
                            {element.right === 2 ? <Button variant="contained" onClick={() => handleFriendClick(element)} sx={{
                                backgroundColor: 'red',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'red',
                                },
                            }}>
                                {element.username} - {element.right}
                            </Button> : null}
                            {/* <ModalUser userName={element.username} right={element.right} /> */}
                        </li>
                    ))}
                </ul>
                {profile ? <Profile username={username} right={right} isOpen={profile} onClose={handleCloseModal} roomName={roomName} chats={chats} setChats={setChats}/> : null}
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
