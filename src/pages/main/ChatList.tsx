import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { getJwtCookie } from '../../api/cookies';
import { useSetRecoilState } from 'recoil';
import { roomNameState } from '../../api/atoms';
import  { removeJwtCookie}  from '../../api/cookies';
import { SocketContext } from '../../api/SocketContext';

import ModalCreateRoom from '../../components/ModalCreateRoom';
import ModalError from '../../components/ModalError';
import { Button } from '@mui/material';
import ModalTokenError from '../../components/ModalTokenError';


interface Response {
    index: string;
    limit_user: number;
    room_stat: number;
}

const ChatList = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [rooms, setRooms] = useState<Response[]>([]);
    const { chatSocket, gameSocket, pingpongSocket} = useContext(SocketContext);
    const roomName = localStorage.getItem('room-name');
    const [openTokenError, setOpenTokenError] = useState(false);

    const [openError, setOpenError] = useState(false);
    const [message, setMessage] = useState('');
    const handleExit = () => {
        gameSocket.emit('ft_exit_match_queue', (response: any) => {
            if (response.checktoken===false) {
                pingpongSocket.disconnect();
                chatSocket.disconnect();
                gameSocket.disconnect();
                removeJwtCookie('jwt');
                localStorage.clear();
                navigate('/');
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
    
    const onJoinRoom = useCallback((roomName: string) => () => {
        chatSocket.emit('join-room', { roomName, password }, (response: any) => {
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
                localStorage.setItem('room-name', roomName);
                handleExit();
                navigate(`/room/${roomName}`);
            } else {
                setOpenError(true);
                setMessage(response.faillog);
            }
        });
    }, [navigate]);
    
    useEffect(() => {
        const roomListHandler = (res: any) => {
            setRooms(res);
        };
        chatSocket.emit('room-list', roomListHandler);

        chatSocket.on('room-list', (res: any) => {
            setRooms(res);
        });
    }, [chatSocket]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setOpenError(false);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event: any, roomName: string) => {
        event.preventDefault();
        chatSocket.emit('join-room', { roomName, password }, (response: any) => {
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
                localStorage.setItem('room-name', roomName);
                navigate(`/room/${roomName}`);
            } else {
                setOpenError(true);
                setMessage(response.faillog);
            }
        });
    };

    return (
        <div style={{ border: '1px solid #000', padding: '10px' }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <ModalError isOpen={openError} onClose={handleClose} title={'채팅방 입장 에러'} message={message} />
                <ModalTokenError isOpen={openTokenError} onClose={handleClose} title={'토큰 에러'} message={"토큰이 만료되었습니다. 재로그인해주세요"} />
                <div style={{ margin: '30px 0' }} />
                <h2>채팅방 목록</h2>
                <Button variant='outlined' onClick={handleOpen}>채팅방 생성</Button>
                <ModalCreateRoom isOpen={open} onClose={handleClose} title={'채팅방 생성'} message={''} />
            </div>
            <table style={{ textAlign: 'center', width: '100%' }}>
                <thead>
                    <tr>
                        <th>방이름</th>
                        <th>제한인원</th>
                        <th>입장</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room: any, index: any) => (
                        <tr key={index}>
                            <td style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {room.room_stat === 1 ? (
                                    <img
                                        src="https://media.istockphoto.com/id/936681148/vector/lock-icon.jpg?s=612x612&w=0&k=20&c=_0AmWrBagdcee-KDhBUfLawC7Gh8CNPLWls73lKaNVA="
                                        alt="Special"
                                        style={{ width: '50px', height: '50px' }}
                                    />
                                ) : null}
                                {room.index}
                            </td>
                            <td>{room.limit_user}</td>
                            <td>
                                {room.room_stat === 0 ? (
                                    <Button variant='outlined' onClick={onJoinRoom(room.index)}>입장하기</Button>
                                ) : null}
                                {room.room_stat === 1 ? (
                                    <form onSubmit={(e) => handleSubmit(e, room.index)}>
                                        <input type="password" placeholder="비밀번호" onChange={handleChange} />
                                        <Button variant='outlined' type="submit">입장하기</Button>
                                    </form>
                                ) : null}
                                {room.room_stat === 2 ? (
                                    <Button variant='outlined' onClick={onJoinRoom(room.index)}>입장하기</Button>
                                ) : null}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ChatList;
