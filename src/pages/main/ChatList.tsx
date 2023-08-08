import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { getJwtCookie } from '../../api/cookies';
import { useSetRecoilState } from 'recoil';
import { roomNameState } from '../../api/atoms';

import { SocketContext } from '../../api/SocketContext';

import ModalExample from '../../components/ModalExample';

interface Response {
    // success: boolean
    // payload: string
}

interface roomInformation {}

const ChatList = () => {
    console.log('챗리스트 컴포넌트');

    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(false);
    const [rooms, setRooms] = useState<any>([]);
    const { chatSocket } = useContext(SocketContext);
    const RsetRoomName = useSetRecoilState<string>(roomNameState);

    const onCreateRoom = useCallback(() => {
        const roomName: string | null = prompt('방 이름을 입력해 주세요.');
        if (!roomName) return alert('방 이름은 반드시 입력해야 합니다.');
        RsetRoomName(roomName);
        chatSocket.emit('create-room', roomName, (response: any) => {
            if (!response.success) return alert(response.payload);
            navigate(`/room/${response.payload}`);
        });
    }, [navigate]);

    const onJoinRoom = useCallback(
        (roomName: string) => () => {
            RsetRoomName(roomName);
            chatSocket.emit('join-room', roomName, (response: any) => {
                if (response.success) {
                    navigate(`/room/${roomName}`);
                }
            });
        },
        [navigate],
    );

    // useEffect(() => {
    //     const roomListHandler = (rooms: any) => {
    //         setRooms(rooms);
    //     };
    //     const createRoomHandler = (newRoom: any) => {
    //         setRooms((prevRooms: any) => [...prevRooms, newRoom]);
    //     };
    //     const deleteRoomHandler = (roomName: string) => {
    //         setRooms((prevRooms: any) => prevRooms.filter((room: string) => room !== roomName));
    //     };

    //     chatSocket.emit('room-list', roomListHandler);
    //     chatSocket.on('create-room', createRoomHandler);
    //     chatSocket.on('delete-room', deleteRoomHandler);

    //     return () => {
    //         chatSocket.off('room-list', roomListHandler);
    //         chatSocket.off('create-room', createRoomHandler);
    //         chatSocket.off('delete-room', deleteRoomHandler);
    //     };
    // }, []);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
                <h2>채팅방 목록</h2>
                <button onClick={handleOpen}>채팅방 생성</button>
                <ModalExample isOpen={open} onClose={handleClose} title={'채팅방 생성'} message={''} />
            </div>
            <table style={{ textAlign: 'center', width: '100%' }}>
                <thead>
                    <tr>
                        <th>방번호</th>
                        <th>방이름</th>
                        <th>입장</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room: any, index: any) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{room}</td>
                            <td>
                                <button onClick={onJoinRoom(room)}>입장하기</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ChatList;
