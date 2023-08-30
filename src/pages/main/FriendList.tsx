import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { IFriendsState, friendsState, dmNameState } from '../../api/atoms';
import { SocketContext } from '../../api/SocketContext';
import { removeJwtCookie } from '../../api/cookies';

import ModalError from '../../components/ModalError';
import ModalTokenError from '../../components/ModalTokenError';
import { Button } from '@mui/material';

const FriendList = ({ dmName, setDMName }) => {
    console.log('프렌드리스트 컴포넌트');

    const navigate = useNavigate();
    const { pingpongSocket, chatSocket, gameSocket } = useContext(SocketContext); ///gameSocket 추가 ,nhwang

    const [newDM, setNewDM] = useState(false);
    const [sender, setSender] = useState('');

    // const friends = useRecoilValue<IFriendsState[]>(friendsState);
    const [friends, setFriends] = useState([]);

    const [openError, setOpenError] = useState(false);
    const [openTokenError, setOpenTokenError] = useState(false);
    const [message, setMessage] = useState('');


    /* -> [in Game스테이터스를 위한 부분] scope는 어딘지 몰라서 일단 주석 추가했습니다. on은 game이고, emit은 chat의 소켓이라 의아하실수 있지만, 이게 맞을겁니다. - nhwang
        gameSocket.on('ft_trigger', (res: any) => {
            console.log('ft_trigger on: ', res);
            chatSocket.emit('ft_getfriendlist', (res: any) => { 
                console.log('ft_getfriendlist emit: ', res);
                setFriends(res);
            });
        });
    */
   

    useEffect(() => {
        chatSocket.on('ft_trigger', (res: any) => {
            console.log('ft_trigger chatsocket on: ', res);
            chatSocket.emit('ft_getfriendlist', (res: any) => {
                console.log('ft_getfriendlist emit: ', res);
                if (res.checktoken===false) {
                    console.log('ft_getfriendlist - scope-test');
                    pingpongSocket.disconnect();
                    chatSocket.disconnect();
                    gameSocket.disconnect();
                    removeJwtCookie('jwt');
                    localStorage.clear();
                    setOpenTokenError(true);
                    return ;
                }
                setFriends(res);
            });
        });

        gameSocket.on('ft_trigger', (res: any) => {
            console.log('ft_trigger gamesocket on: ', res);
            chatSocket.emit('ft_getfriendlist', (res: any) => { 
                console.log('ft_getfriendlist emit: ', res);
                setFriends(res);
            });
        });

        chatSocket.emit('ft_getfriendlist', (res: any) => {
            console.log('ft_getfriendlist emit: ', res);
            setFriends(res);
        });

        const messageHandler = (res: any) => {
            console.log('ft_dmAlert on: ', res);
            chatSocket.emit('ft_getfriendlist', (res: any) => {
                console.log('ft_getfriendlist emit: ', res);
                setFriends(res);
                setNewDM(true);
                setSender(res.username);
            });
        };
        chatSocket.on('ft_dmAlert', messageHandler);//ft_dm -> ft_dmAlert -nhwang

        /*
        chatSocket.emit('ft_getfriendlist', (res: any) => {
                console.log('ft_getfriendlist emit: ', res);
                setFriends(res);
            });
            const messageHandler = (res: any) => {
                console.log('프렌드리스트 메세지 핸들러: ', res);
                setNewDM(true);
                setSender(res.username);
            };
        */
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
        const data = {
            username,
        };////nhwang
        
        chatSocket.emit('join-dm', data, (response: any) => { //// nhwang
            console.log('join-dm: ', response);
            if (response.checktoken===false) {
                pingpongSocket.disconnect();
                chatSocket.disconnect();
                gameSocket.disconnect();
                removeJwtCookie('jwt');
                localStorage.clear();
                setOpenTokenError(true);
                // alert('Token');
                // navigate('/');
                return ;
            }
            
            if (response.success) {
                localStorage.setItem('dm-username', username);
                localStorage.setItem('dm-index', response.index);
                navigate(`/dm/${response.index}`);
            } else {
                setOpenError(true);
                setMessage(response.faillog);
            }
        });
        // if (status === 0) {
        //     alert(`${username}님이 오프라인 상태입니다.`);
        // } else if (status === 1 || status === 2) {
        //     chatSocket.emit('join-dm', username, (response: any) => {
        //         if (response.success) {
        //             localStorage.setItem('dm-username', username);
        //             localStorage.setItem('dm-index', response.index);
        //             navigate(`/dm/${response.index}`);
        //         }
        //     });
        // } else if (status === 3) {
        //     alert(`${username}님이 채팅 중입니다.`);
        // } else if (status === 4) {
        //     alert(`${username}님이 게임 중입니다.`);
        // }
    }, [navigate]);

    const handleClose = () => {
        setOpenError(false);
    };

    const handleReLoginClose = () => {
        setOpenTokenError(false);
        navigate('/');
    };

    return (
        <div style={{ border: '1px solid #000', padding: '10px' }}>
            <ModalError isOpen={openError} onClose={handleClose} title={'입장 불가'} message={message} />
            <ModalTokenError isOpen={openTokenError} onClose={handleClose} title={'토큰 에러'} message={"토큰이 만료되었습니다. 재로그인해주세요"} />
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

                            <button
                                style={{
                                    width: '15px',
                                    height: '15px',
                                    borderRadius: '50%',
                                    backgroundColor:
                                        friend.status === 0 ? "grey" :
                                            friend.status >= 1 && friend.status <= 3 ? "green" :
                                                friend.status === 4 ? "red" : "blue",
                                }}
                            ></button>{' '}

                            {friend.image_url &&
                                (<img src={friend.image_url ? `http://${process.env.REACT_APP_IP_ADDRESS}:4000/${friend.image_url}` : '/images/profile.jpg'} alt={`${friend.username}'s profile`}
                                    style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                                )
                            }
                            {' ' + friend.username + '(' +  friend.intra_id + ')'}
                            <div>
                                {friend.alert || (newDM && friend.username === sender) ? (
                                    <button
                                        style={{
                                            width: '15px',
                                            height: '15px',
                                            borderRadius: '50%',
                                            backgroundColor: 'yellow',
                                        }}
                                    ></button>
                                ) : null}
                                <Button onClick={onJoinDM(friend.username, friend.status, friend.receiver)}>DM</Button>
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
