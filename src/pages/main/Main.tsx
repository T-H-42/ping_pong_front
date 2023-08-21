import React, { useEffect, useState, useContext } from 'react';
import { getJwtCookie } from '../../api/cookies';
import axios from 'axios';
import ChatList from './ChatList';
import FriendList from './FriendList';
import DMList from './DMList';
import LogOutButton from '../../components/LogOutButton';
import { useRecoilValue, useRecoilState } from 'recoil';
import { IFriendsState, usernameState, friendsState } from '../../api/atoms';
import { SocketContext } from '../../api/SocketContext';
import GameStartButton from './GameStartButton';
import { isOwnerState, settingRoomNameState } from '../../api/atoms';

const Main = () => {
    const RisOwner = useRecoilValue(isOwnerState);

    console.log('!!!!!메인 컴포넌트 이즈 오너!!!!!!!!', RisOwner);
    const { pingpongSocket, chatSocket } = useContext(SocketContext);
    const [friends, setFriends] = useRecoilState<IFriendsState[]>(friendsState);
    const [dmName, setDMName] = useState<any>();

    useEffect(() => {
        axios
            .get(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/friend/allfriend`, {
                headers: {
                    Authorization: `Bearer ${getJwtCookie('jwt')}`,
                },
            })
            .then((res) => {
                console.log('/user/allfriend 요청 성공: ', res.data);
                setFriends(res.data);
            })
            .catch((err) => {
                console.log(`/user/allfriend 요청 실패: ${err}`);
            });
    }, []);

    useEffect(() => {
        if (!pingpongSocket) {
            return () => {
                console.log('핑퐁소켓 없음.');
            };
        }

        pingpongSocket.on('ft_connect', (respnose: any) => {
            console.log('ft_connect 입니다.', respnose);
            const updatedFriends: any = friends.map((friend: any) => {
                if (friend.username === respnose.status) {
                    return { ...friend, status: 1 };
                }
                return friend;
            });
            setFriends([...updatedFriends]);
        });

        pingpongSocket.on('ft_disconnect', (respnose: any) => {
            console.log('ft_disconnect 입니다.', respnose);
            const updatedFriends: any = friends.map((friend: any) => {
                if (friend.username === respnose.status) {
                    return { ...friend, status: 0 };
                }
                return friend;
            });
            setFriends([...updatedFriends]);
        });

        return () => {
            pingpongSocket.off('ft_connect');
            pingpongSocket.off('ft_disconnect');
        };
    }, [friends]);

    return (
        <div style={{ textAlign: 'center' }}>
            <GameStartButton />
            <LogOutButton />
            <h1> {localStorage.getItem('username')}의 메인 페이지</h1>
            {chatSocket ? <ChatList /> : null}
            <div style={{ margin: '30px 0' }} />
            {friends ? <FriendList dmName={dmName} setDMName={setDMName} /> : null}
            <div style={{ margin: '30px 0' }} />
            <DMList dmName={dmName} />
        </div>
    );
};

export default Main;
