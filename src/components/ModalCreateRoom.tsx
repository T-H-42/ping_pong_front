import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Box, Typography, TextField, Switch, FormControlLabel, Alert } from '@mui/material';
import { SocketContext } from '../api/SocketContext';
import  { removeJwtCookie}  from '../api/cookies';
import ModalTokenError from '../components/ModalTokenError';


interface ModalExampleProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

interface Response {
    success: boolean;
    faillog: string;
}

const ModalCreateRoom: React.FC<ModalExampleProps> = ({ isOpen, onClose, title, message }) => {
    const [openTokenError, setOpenTokenError] = useState(false);

    const { chatSocket , gameSocket, pingpongSocket} = useContext(SocketContext);
    const navigate = useNavigate();
    const [roomName, setRoomName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [protectedRoom, setProtectedRoom] = useState(false);
    const [passwordRoom, setPasswordRoom] = useState(false);
    const [inputNumber, setInputNumber] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputRoomNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        const sanitizedInput = input.replace(/[^\wㄱ-ㅎ가-힣]/gi, '');
        setRoomName(sanitizedInput);
    };

    const handleInputPasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleProtectedRoomSwitchChange = () => {
        if (!passwordRoom) {
            setProtectedRoom(!protectedRoom);
        }
    };

    const handlePasswordSwitchChange = () => {
        if (!protectedRoom) {
            setPasswordRoom(!passwordRoom);
        }
    };

    const handleInputNumberChange = (event) => {
        setInputNumber(event.target.value);
    };
     
    const handleExit = () => {        
        gameSocket.emit('ft_exit_match_queue', (response: any) => {
            if (response.checktoken===false) {
                pingpongSocket.disconnect();
                chatSocket.disconnect();
                gameSocket.disconnect();
                removeJwtCookie('jwt');
                localStorage.clear();
                // setOpenTokenError(true);
                return ;
            }
                if (!response.success) {
                    alert("매치 취소에 실패하였습니다 : ");
                    return
                }
            });
        navigate('/');
    };

    const onCreateRoom = () => {
        // 공개방은 0, 비밀번호방1, 비공개방 2
        let status = 0;
        if (passwordRoom) {
            status = 1;
        } else if (protectedRoom) {
            status = 2;
        }

        const data = {
            roomName,
            status,
            password,
            limitUser: inputNumber,
        };

        // handleExit()
        chatSocket.emit('create-room', data, (response: any) => {
            if (response.checktoken===false) {
                pingpongSocket.disconnect();
                chatSocket.disconnect();
                gameSocket.disconnect();
                removeJwtCookie('jwt');
                localStorage.clear();
                setOpenTokenError(true);
                return ;
            }
            if (response.success) {
                setShowAlert(false);
                localStorage.setItem('room-name', response.faillog);
                navigate(`/room/${response.faillog}`);
            } else {
                setShowAlert(true);
                setErrorMessage(response.faillog);
            }
        });
        setPassword('');
    };
    const handleClose = () => {
        setOpenTokenError(false);
    };

    return (
        <>
        <ModalTokenError isOpen={openTokenError} onClose={handleClose} title={'토큰 에러'} message={"토큰이 만료되었습니다. 재로그인해주세요"} />
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
        
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, height: 500, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                {showAlert && <Alert severity="error">{errorMessage}</Alert>}
                <Typography id="modal-title" variant="h6" component="h2">
                    {title}
                </Typography>
                <Typography id="modal-description" sx={{ mt: 2 }}>
                    {'방제목'}
                </Typography>
                <TextField label="방제목을 입력해주세요." fullWidth sx={{ mt: 2 }} value={roomName}
                    onChange={handleInputRoomNameChange} />

                <FormControlLabel
                    control={<Switch checked={protectedRoom} onChange={handleProtectedRoomSwitchChange} />}
                    label="비공개방"
                    sx={{ mt: 2 }}
                />

                <FormControlLabel
                    control={<Switch checked={passwordRoom} onChange={handlePasswordSwitchChange} />}
                    label="비밀번호 설정"
                    sx={{ mt: 2 }}
                />
                {passwordRoom && (
                    <TextField label="비밀번호를 입력해주세요." type="password" fullWidth sx={{ mt: 2 }} value={password}
                        onChange={handleInputPasswordChange} />
                )}
                <Typography id="modal-description" sx={{ mt: 2 }}>
                    {'인원 수'}
                </Typography>

                <TextField label="인원 수를 입력해주세요." type="number" fullWidth sx={{ mt: 2 }} InputProps={{
                    inputProps: {
                        min: 1,
                        max: 8,
                    },
                }} value={inputNumber}
                    onChange={handleInputNumberChange} />

                <Box sx={{ position: 'absolute', bottom: 20, right: 10 }}>
                    <Button variant="contained" onClick={onCreateRoom} sx={{ mt: 2 }}>생성</Button>
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
        </>
    );
};

export default ModalCreateRoom;