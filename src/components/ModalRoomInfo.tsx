import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Box, Typography, TextField, Switch, FormControlLabel, Alert } from '@mui/material';
import { SocketContext } from '../api/SocketContext';
import { usernameState } from '@src/api/atoms';

import { useSetRecoilState, useRecoilValue } from 'recoil';
import { roomFriendsState } from '../api/atoms';

import {Profile} from './Profile';
import ModalError from './ModalError';

interface ModalExampleProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    chatUsers: any[];
    right: number;
    chats: any[];
    setChats: (data: any[]) => void;
    intraId: string;
}

interface Response {
    success: boolean;
    faillog: string;
}

const ModalRoomInfo: React.FC<ModalExampleProps> = ({ isOpen, onClose, title, chatUsers: friends, right, chats, setChats, intraId }) => {
    const { chatSocket } = useContext(SocketContext);
    const navigate = useNavigate();
    const roomName = localStorage.getItem('room-name');
    const [profile, setProfile] = useState(false);
    const [username, setUsername] = useState('');

    const [password, setPassword] = useState<string>('');

    const [openError, setOpenError] = useState(false);
    const [message, setMessage] = useState('');

    const handleInputPasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleCloseModal = () => {
        setProfile(false); // 모달이 닫힐 때 profile 상태를 false로 설정합니다.
        // onClose(); // 모달을 닫습니다.
    };

    const handleFriendClick = (e) => {
        setProfile(true);
        setUsername(e.username);
    };

    const handleChangePassword = () => {
        chatSocket.emit('ft_changeroompassword', { roomName, password }, (response: Response) => {
            if (response.success) {
                setOpenError(true);
                setMessage(response.faillog);
            } else {
                setOpenError(true);
                setMessage(response.faillog);
            }
        });
        setPassword('');
    };

    const handleDeletePassword = () => {
        chatSocket.emit('ft_deleteroompassword', { roomName }, (response: Response) => {
            if (response.success) {
                setOpenError(true);
                setMessage(response.faillog);
            } else {
                setOpenError(true);
                setMessage(response.faillog);
            }
        });
        setPassword('');

    };

    const handleClose = () => {
        setOpenError(false);
    };


    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, height: 500, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                <ModalError isOpen={openError} onClose={handleClose} title={'비밀번호 변경/삭제'} message={message} />
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
                        </li>
                    ))}
                </ul>

                {right === 2 ?
                    <Box>
                        <Typography id="modal-description" sx={{ mt: 2 }}>
                            {'비밀번호 설정'}
                        </Typography>
                        <TextField label="비밀번호를 입력해주세요." type="password" fullWidth sx={{ mt: 2 }} value={password} onChange={handleInputPasswordChange} />
                    </Box>
                    : null}
                {profile ? <Profile username={username} right={right} isOpen={profile} onClose={handleCloseModal} roomName={roomName} chats={chats} setChats={setChats} intra_id={intraId}/> : null}

                <Box sx={{ position: 'absolute', bottom: 20, right: 10 }}>
                    {right === 2 ?
                        <>
                            <Button variant="contained" onClick={handleChangePassword} sx={{ mt: 2, mx: 1 }}>비밀번호 변경</Button>
                            <Button variant="contained" onClick={handleDeletePassword} sx={{ mt: 2, backgroundColor: 'orange', }}>비밀번호 삭제</Button> </>
                        : null}
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
