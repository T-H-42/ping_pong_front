import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { } from 'react-router-dom';
import { } from '../../api/atoms';
import { useSearchParams, useNavigate, Navigate } from 'react-router-dom';
import { roomNameState } from '../../api/atoms';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { SocketContext } from '../../api/SocketContext';

import ModalRoomInfo from '../../components/ModalRoomInfo';
import ModalAddFriend from '../../components/ModalAddFriend';
import ModalRoomInvitation from '../../components/ModalRoomInvitation';

import { Button, Modal, Box, Typography, TextField, Switch, FormControlLabel, Alert } from '@mui/material';

const ChatRoom: React.FC = () => {
    console.log('챗룸 컴포넌트');
    const { chatSocket } = useContext(SocketContext);
    const [openRoomInfo, setOpenRoomInfo] = useState(false);
    const [openRoomInvitation, setOpenRoomInvitation] = useState(false);
    const [chats, setChats] = useState([]);
    const [message, setMessage] = useState('');
    const [friends, setFriends] = useState([]);
    const [chatUsers, setChatUsers] = useState([]);
    const [right, setRight] = useState<number>(-1);
    const [showAddFriend, setShowAddFriend] = useState<boolean>(false);
    const chatContainerEl = useRef(null);
    const roomName = localStorage.getItem('room-name');
    const navigate = useNavigate();

    const [sender, setSender] = useState('');
    const [receiver, setReceiver] = useState('');

    const username = localStorage.getItem('username');

    useEffect(() => {
        chatSocket.emit('ft_isEmptyRoom', roomName, (res: any) => {
            console.log('ft_isEmptyRoom: ', res);
            if (res) {
                navigate('/main');
            }
        });

        chatSocket.on('ft_mute', (res: any) => {
            console.log('ft_mute on: ', res);

            const intervalId = setInterval(() => {
                console.log('setInterval');
                chatSocket.emit('ft_mute_check', { roomName, targetUser: username }, (response: any) => {
                    console.log('ft_mute_check: ', response);
                    if (response.success >= 1) {
                        console.log('clearInterval 실행');
                        clearInterval(intervalId); // 컴포넌트가 언마운트될 때 인터벌 정리
                    }
                });
            }, 6000);

        })

        return () => {
            chatSocket.emit('leave-room', roomName, () => {
                console.log('leave-room: ', roomName);
            });
        };
    }, []);

    useEffect(() => {
        if (!chatContainerEl.current) return;

        const chatContainer = chatContainerEl.current;
        const { scrollHeight, clientHeight } = chatContainer;

        if (scrollHeight > clientHeight) {
            chatContainer.scrollTop = scrollHeight - clientHeight;
        }
    }, [chats.length]);

    useEffect(() => {
        chatSocket.emit('ft_get_chat_log', { roomName }, (chat) => {
            console.log('ft_get_chat_log emit: ', chat);
            setChats(chat);
        });

        const messageHandler = (chat) => {
            console.log('ft_message: ', chat);
            setChats((prevChats) => [...prevChats, chat]);
        };

        chatSocket.on('ft_message', messageHandler);

        chatSocket.on('ft_kick', (res) => {
            console.log('ft_kick on: ', res);
            navigate('/main');
        });

        chatSocket.on('ft_addfriend', (response: any) => {
            console.log('ft_addfriend on: ', response);
            setSender(response.sender);
            setReceiver(response.receiver);
            setShowAddFriend(true);
        });

        return () => {
            // chatSocket.off('ft_message', messageHandler);
            setShowAddFriend(false);
        };
    }, []);

    const onChange = useCallback((e) => {
        setMessage(e.target.value);
    }, [message]);

    const onSendMessage = useCallback(async (e) => {
        e.preventDefault();
        if (message === '') return alert('메시지를 입력해 주세요.');

        await chatSocket.emit('ft_message', { message, roomName }, (chat) => {
            console.log('ft_message: ', chat);
            if (chat.success) {
                setChats((prevChats) => [...prevChats, chat]);
                setMessage('');
            } else {
                const error = { username: chat.username, message: chat.faillog }
                setChats((prevChats) => [...prevChats, error]);
                setMessage('');
            }
        });
    }, [message, roomName]);

    const onLeaveRoom = useCallback(() => {
        // chatSocket.emit('leave-room', roomName, () => {
        navigate('/main');
        // });
    }, [navigate, roomName]);

    const handleOpen = () => {
        chatSocket.on('ft_getUserListInRoom', (res) => {
            setChatUsers(res.userList);
            res.userList.forEach((user, index) => {
                if (user.username === localStorage.getItem('username')) {
                    console.log('ft_getUserListInRoom on: ', res);
                    setRight(user.right);
                }
            });
        });

        chatSocket.emit('ft_getUserListInRoom', roomName, (res: any) => {
            setChatUsers(res.userList);
            res.userList.forEach((user, index) => {
                if (user.username === localStorage.getItem('username')) {
                    console.log('ft_getUserListInRoom emit: ', res);
                    setRight(user.right);
                }
            });
        });

        setOpenRoomInfo(true);
    };

    const handleOpenInvitation = () => {
        chatSocket.emit('ft_getfriendlist', (res: any) => {
            console.log('ft_getfriendlist emit: ', res);
            setFriends(res);
        });
        setOpenRoomInvitation(true);
    }

    const handleCloseRoomInfo = () => {
        setOpenRoomInfo(false);
    };

    const handleCloseRoomInvitation = () => {
        setOpenRoomInvitation(false);
    };

    const handleAddFriendClose = () => {
        setShowAddFriend(false);
    };

    return (
        <>
            <div>
                <ModalAddFriend isOpen={showAddFriend} onClose={handleAddFriendClose} title={'친구 요청'} sender={sender} receiver={receiver} />
                <h2>채팅방 이름 : {roomName}</h2>
                <Box sx={{ display: 'flex', gap: '10px' }}>
                    <Button variant="contained" onClick={handleOpen}>채팅방 정보</Button>
                    <Button variant="contained" onClick={handleOpenInvitation}>채팅방 초대</Button>
                </Box>
                <ModalRoomInfo isOpen={openRoomInfo} onClose={handleCloseRoomInfo} title={'채팅방 정보'} chatUsers={chatUsers} right={right} chats={chats} setChats={setChats} />
                <ModalRoomInvitation isOpen={openRoomInvitation} onClose={handleCloseRoomInvitation} title={'채팅방 초대'} friends={friends} />
                <h2 />
                <div ref={chatContainerEl}>
                    {chats.map((chat, index) => (
                        <div key={index}>
                            <span style={{ fontWeight: 'bold', color: 'green' }}>{chat.username} : </span>
                            <span style={{ fontWeight: 'bold', color: 'black' }}>{chat.message}</span>

                            <div style={{ margin: '30px 0' }} />
                        </div>
                    ))}
                </div>
                <div>
                    <form onSubmit={onSendMessage}>
                        <input type="text" onChange={onChange} value={message} />
                        <button>Send</button>
                    </form>
                    <div>
                        <button onClick={onLeaveRoom} style={{ position: 'absolute', right: '12px', bottom: '35vh' }}>
                            나가기
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatRoom;
