import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { getJwtCookie } from '../../api/cookies';
import { useSetRecoilState } from 'recoil';
import { dmNameState } from '../../api/atoms';

import { SocketContext } from '../../api/SocketContext';

const DMList = ({ dmName }) => {
    console.log('디엠리스트 컴포넌트');

    const { chatSocket } = useContext(SocketContext);
    const navigate = useNavigate();
    const [DMList, setDMList] = useState<any>([]);
    const RsetRoomName = useSetRecoilState<string>(dmNameState);

    const onJoinDM = useCallback((roomName: any) => () => {
        RsetRoomName(roomName.username);
        chatSocket.emit('join-dm', roomName, (response: any) => {
            if (response.success) {
                navigate(`/dm/${roomName}`);
            }
        });
    }, [navigate]);

    useEffect(() => {
        if (dmName) {
            if (dmName.success) {
                console.log('FUCK');
                setDMList((prevRooms: any) => [...prevRooms, dmName]);
            }
        }
    }, [dmName]);

    useEffect(() => {
        const dmListHandler = (response: any) => {
            console.log('dmListHandler: ', response);
            setDMList(response);
        };

        const deleteRoomHandler = (roomName: string) => {
            setDMList((prevRooms: any) => prevRooms.filter((room: string) => room !== roomName));
        };

        chatSocket.on('ft_dm_invitation', (res: any) => {
            console.log('ft_dm_invitation on: ', res);
            setDMList((prevRooms: any) => [...prevRooms, res]);
        });

        chatSocket.emit('dm-list', dmListHandler);
        // chatSocket.on('create-dm', createDMHandler);
        chatSocket.on('delete-room', deleteRoomHandler);

        return () => {
            chatSocket.off('dm-list', dmListHandler);
            // chatSocket.off('create-dm', createDMHandler);
            chatSocket.off('delete-room', deleteRoomHandler);

            console.log('ft_dm_invitation off');
            chatSocket.off('ft_dm_invitation');
        };
    }, []);

    const onLeaveRoom = useCallback(() => {
        chatSocket.emit('leave-dm', () => { });
    }, []);

    return (
        <div style={{ border: '1px solid #000', padding: '10px' }}>
            <h2>DM 목록</h2>
            <table style={{ textAlign: 'center', width: '100%' }}>
                <thead>
                    <tr>
                        <th>닉네임</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {DMList.map((i: any, index: any) => (
                        <tr key={index}>
                            <td>{i.username}</td>
                            <td>
                                <button onClick={onJoinDM(i)}>입장</button>
                            </td>
                            <td>
                                <button onClick={onLeaveRoom}>X</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DMList;
