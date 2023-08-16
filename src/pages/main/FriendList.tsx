import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { IFriendsState, friendsState, dmNameState } from '../../api/atoms';
import { SocketContext } from '../../api/SocketContext';

const FriendList = ({ dmName, setDMName }) => {
    console.log('프렌드리스트 컴포넌트');

    const navigate = useNavigate();
    const { chatSocket } = useContext(SocketContext);

    const [newDM, setNewDM] = useState(false);
    const [sender, setSender] = useState('');

    // const friends = useRecoilValue<IFriendsState[]>(friendsState);
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        chatSocket.emit('ft_getfriendlist', (res: any) => {
            console.log('ft_getfriendlist emit: ', res);
            setFriends(res);
        });
        const messageHandler = (res: any) => {
            console.log('프렌드리스트 메세지 핸들러: ', res);
            setNewDM(true);
            setSender(res.username);
        };
        chatSocket.on('ft_dm', messageHandler);

        return () => {
            chatSocket.off('ft_dm', messageHandler);
        };
    }, []);

    useEffect(() => {
        chatSocket.on('ft_getfriendlist', (res: any) => {
            console.log('ft_getfriendlist on: ', res);
            setFriends(res);
        });
    }, [friends]);

    const onJoinDM = useCallback((username: any, status: number, receiver: string) => () => {
        if (status === 0) {
            alert(`${username}님이 오프라인 상태입니다.`);
        } else if (status === 1 || status === 2) {
            chatSocket.emit('join-dm', username, (response: any) => {
                if (response.success) {
                    localStorage.setItem('dm-username', username);
                    localStorage.setItem('dm-index', response.index);
                    navigate(`/dm/${response.index}`);
                }
            });
        } else if (status === 3) {
            alert(`${username}님이 채팅 중입니다.`);
        } else if (status === 4) {
            alert(`${username}님이 게임 중입니다.`);
        }
    }, [navigate]);

    return (
        <div style={{ border: '1px solid #000', padding: '10px' }}>
            <h2>친구 목록</h2>
            <ul style={{ textAlign: 'left' }}>

                {friends ? friends.map((friend: any) => (
                    <div key={friend.f_id}>
                        <li
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '5px',
                            }}
                        >
                            {friend.status ? (
                                <div style={{ alignItems: 'center' }}>
                                    <button
                                        style={{
                                            width: '15px',
                                            height: '15px',
                                            borderRadius: '50%',
                                            backgroundColor: 'green',
                                        }}
                                    ></button>
                                    {/* <span>게임 중</span> */}
                                </div>
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
                            <div>
                                {newDM && friend.username === sender ? (
                                    <button
                                        style={{
                                            width: '15px',
                                            height: '15px',
                                            borderRadius: '50%',
                                            backgroundColor: 'yellow',
                                        }}
                                    ></button>
                                ) : null}
                                <button onClick={onJoinDM(friend.username, friend.status, friend.receiver)}>DM</button>
                            </div>
                        </li>
                    </div>
                ))
                    : null}
            </ul>
        </div>
    );
};

export default FriendList;
