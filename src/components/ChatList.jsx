import React, { useEffect, useState, useRef, useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import getJwtCookie, { jwtCookie } from '../api/cookies';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { roomNameState, chatSocketState } from '../api/atoms';
import { createChatSocket } from '../api/socket';
import SocketContext from '../api/SocketContext'

const ChatList = () => {
    console.log("챗리스트 컴포넌트");

    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [chats, setChats] = useState([]);
    const [message, setMessage] = useState('');
    const chatContainerEl = useRef(null);
    const { pingpongSocket, chatSocket } = useContext(SocketContext)
    const RsetRoomName = useSetRecoilState(roomNameState)

    const onCreateRoom = useCallback(() => {
        const roomName = prompt('방 이름을 입력해 주세요.');
        if (!roomName) return alert('방 이름은 반드시 입력해야 합니다.');
        RsetRoomName(roomName)
        chatSocket.emit('create-room', roomName, (response) => {
            if (!response.success) return alert(response.payload);
            navigate(`/room/${response.payload}`);
        });
    }, [navigate]);

    const onJoinRoom = useCallback(
        (roomName) => () => {
            RsetRoomName(roomName)
            chatSocket.emit('join-room', roomName, (res) => {
                console.log(`check res ${res}`);
                navigate(`/room/${roomName}`);
            });
        },
        [navigate]
    );
    useEffect(() => {
        const roomListHandler = (rooms) => {
            setRooms(rooms);
        };
        const createRoomHandler = (newRoom) => {
            setRooms((prevRooms) => [...prevRooms, newRoom]);
        };
        const deleteRoomHandler = (roomName) => {
            setRooms((prevRooms) => prevRooms.filter((room) => room !== roomName));
        };

        chatSocket.emit('room-list', roomListHandler);
        chatSocket.on('create-room', createRoomHandler);
        chatSocket.on('delete-room', deleteRoomHandler);

        return () => {
            chatSocket.off('room-list', roomListHandler);
            chatSocket.off('create-room', createRoomHandler);
            chatSocket.off('delete-room', deleteRoomHandler);
        };
    }, []);

    return (
        <div style={{ border: '1px solid #000', padding: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2>채팅방 목록</h2>
                <button onClick={onCreateRoom}>채팅방 생성</button>
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
                    {rooms.map((room, index) => (
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
        </div >
    );
};

export default ChatList;