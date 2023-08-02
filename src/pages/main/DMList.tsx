import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { getJwtCookie } from '../../api/cookies';
import { useSetRecoilState } from 'recoil';
import { roomNameState } from '../../api/atoms';

import { SocketContext } from '../../api/SocketContext';

const DMList = () => {
    console.log('디엠리스트 컴포넌트');

    const { chatSocket } = useContext(SocketContext);
    const navigate = useNavigate();
    const [DMList, setDMList] = useState<any>([]);
    const RsetRoomName = useSetRecoilState<string>(roomNameState);

    const onJoinRoom = useCallback(
        (roomName: string) => () => {
            RsetRoomName(roomName);
            chatSocket.emit('join-room', roomName, (response: any) => {
                navigate(`/room/${roomName}`);
            });
        },
        [navigate],
    );

    useEffect(() => {
        const dmListHandler = (response: any) => {
            setDMList(response);
        };
        const createDMHandler = (res: any) => {
            console.log('createDMHandler: ', res);
            setDMList((prevRooms: any) => [...prevRooms, res]);
        };
        const deleteRoomHandler = (roomName: string) => {
            setDMList((prevRooms: any) => prevRooms.filter((room: string) => room !== roomName));
        };

        chatSocket.emit('dm-list', dmListHandler);
        chatSocket.on('create-dm-room', createDMHandler);
        chatSocket.on('delete-room', deleteRoomHandler);

        return () => {
            chatSocket.off('room-list', dmListHandler);
            chatSocket.off('create-dm-room', createDMHandler);
            chatSocket.off('delete-room', deleteRoomHandler);
        };
    }, []);

    return (
        <div style={{ border: '1px solid #000', padding: '10px' }}>
            <h2>DM 목록</h2>
            <table style={{ textAlign: 'center', width: '100%' }}>
                <thead>
                    <tr>
                        <th>닉네임</th>
                        <th>입장</th>
                    </tr>
                </thead>
                <tbody>
                    {DMList.map((room: any, index: any) => (
                        <tr key={index}>
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

export default DMList;
