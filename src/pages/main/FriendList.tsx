import React, { useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { IFriendsState, friendsState } from '../../api/atoms';
import { SocketContext } from '../../api/SocketContext';

const FriendList = () => {
    console.log('프렌드리스트 컴포넌트');

    const navigate = useNavigate();
    const { chatSocket } = useContext(SocketContext);
    const friends = useRecoilValue<IFriendsState[]>(friendsState);

    const dmHandler = useCallback((username, status) => () => {
        if (status) {
            chatSocket.emit('ft_dm_invitation', username, (response: any) => {
                console.log('ft_dm_invitation: ', response);
            });
        } else {
            return alert(`${username}님이 오프라인 상태입니다.`);
        }
    }, []);

    useEffect(() => {
        chatSocket.on('ft_dm_invited', (response: any) => {
            console.log('ft-dm-invited: ', response);
        });

        return () => {
            console.log('ft_dm_invited off');
            chatSocket.off('ft_dm_invited');
        };
    }, []);

    return (
        <div style={{ border: '1px solid #000', padding: '10px' }}>
            <h2>친구 목록</h2>
            <ul style={{ textAlign: 'left' }}>
                {friends.map((friend: any) => (
                    <div key={friend.f_id}>
                        <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            {friend.status ? (
                                <button
                                    style={{
                                        width: '15px',
                                        height: '15px',
                                        borderRadius: '50%',
                                        backgroundColor: 'green',
                                    }}
                                ></button>
                            ) : (
                                <button
                                    style={{
                                        width: '15px',
                                        height: '15px',
                                        borderRadius: '50%',
                                        backgroundColor: 'red',
                                    }}
                                ></button>
                            )}{' '}
                            {friend.username}
                            <button onClick={dmHandler(friend.username, friend.status)}>DM</button>
                        </li>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default FriendList;
