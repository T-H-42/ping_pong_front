import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { } from 'react-router-dom';
import { } from '../../api/atoms';
import { useSearchParams, useNavigate, Navigate } from 'react-router-dom';
import { roomNameState } from '../../api/atoms';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { SocketContext } from '../../api/SocketContext';

import ModalError from '../../components/ModalError';
import ModalRoomInfo from '../../components/ModalRoomInfo';
import ModalAddFriend from '../../components/ModalAddFriend';
import ModalRoomInvitation from '../../components/ModalRoomInvitation';
import ModalGameInvitationReceiver from '../../components/ModalGameInvitationReceiver';

import {
    Button,
    Modal,
    Box,
    Typography,
    TextField,
    Switch,
    FormControlLabel,
    Alert,
    AppBar,
    Stack,
} from '@mui/material';
import { getJwtCookie, removeJwtCookie } from '../../api/cookies';
import ModalTokenError from '../../components/ModalTokenError';

import { Cookies } from 'react-cookie';

const Cookie = new Cookies();

const ChatRoom: React.FC = () => {
    const { chatSocket, gameSocket, pingpongSocket } = useContext(SocketContext);
    const [openRoomInfo, setOpenRoomInfo] = useState(false);
    const [openRoomInvitation, setOpenRoomInvitation] = useState(false);
    const [chats, setChats] = useState([]);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [friends, setFriends] = useState([]);
    const [chatUsers, setChatUsers] = useState([]);
    const [right, setRight] = useState<number>(-1);
    const [showAddFriend, setShowAddFriend] = useState<boolean>(false);
    const chatContainerEl = useRef(null);
    const roomName = localStorage.getItem('room-name');
    const navigate = useNavigate();

    const [openTokenError, setOpenTokenError] = useState(false);

    const [sender, setSender] = useState('');
    const [receiver, setReceiver] = useState('');

    const username = localStorage.getItem('username');

    const [openGameInvitation, setOpenGameInvitation] = useState(false);
    const [openError, setOpenError] = useState(false);

    const [intraId, setIntraId] = useState('');

    useEffect(() => {
        chatSocket.on('ft_tomain', (res: any) => {
            if (res.success) {
                navigate('/main');
            }
        });

        const data = {
            roomName,
        };
        chatSocket.emit('ft_isEmptyRoom', data, (res: any) => {
            if (res) {
                navigate('/main');
            }
        });

        chatSocket.on('ft_mute', (res: any) => {
            const intervalId = setInterval(() => {
                chatSocket.emit('ft_mute_check', { roomName, targetUser: username }, (response: any) => {
                    if (response.success >= 1) {
                        clearInterval(intervalId);
                    }
                });
            }, 6000);
        });

        return () => {
            chatSocket.emit('leave-room', data, () => {
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
        const data = {
            roomName,
        }; // { roomName } -> data nhwang
        chatSocket.emit('ft_get_chat_log', data, (chat) => {
            setChats(chat);
        });

        const messageHandler = (chat) => {
            setChats((prevChats) => [...prevChats, chat]);
        };

        chatSocket.on('ft_message', messageHandler);

        chatSocket.on('ft_kick', (res) => {
            navigate('/main');
        });
        chatSocket.on('ft_addfriend', (response: any) => {
            setSender(response.sender);
            setReceiver(response.receiver);
            setShowAddFriend(true);
        });

        gameSocket.on('ft_invite_game', (response: any) => {
            setSender(response.sender);
            setOpenGameInvitation(true);
        });

        gameSocket.on('ft_invite_game_result', (res: any) => {
            if (!res.success) {
                setOpenError(true);
                setErrorMessage(res.faillog);
                return;
            }
        });

        return () => {
            setShowAddFriend(false);
        };
    }, []);

    const onChange = useCallback(
        (e) => {
            setMessage(e.target.value);
        },
        [message],
    );

    const onSendMessage = useCallback(
        async (e) => {
            e.preventDefault();
            if (message === '') return alert('메시지를 입력해 주세요.');
            const data = {
                message,
                roomName,
            };
            await chatSocket.emit('ft_message', data, (chat) => {
                if (chat.success) {
                    setChats((prevChats) => [...prevChats, chat]);
                    setMessage('');
                } else {
                    const error = { username: chat.username, message: chat.faillog };
                    setChats((prevChats) => [...prevChats, error]);
                    setMessage('');
                }
            });
        },
        [message, roomName],
    );

    const onLeaveRoom = useCallback(() => {
        navigate('/main');
    }, [navigate]);

    const handleOpen = () => {
        chatSocket.on('ft_getUserListInRoom', (res) => {
            setChatUsers(res.userList);
            res.userList.forEach((user, index) => {
                if (user.username === localStorage.getItem('username')) {
                    setRight(user.right);
                    setIntraId(user.intra_id);                    
                }
            });
        });
        const data = {
            roomName,
        };
        chatSocket.emit('ft_getUserListInRoom', data, (res: any) => {
            setChatUsers(res.userList);
            res.userList.forEach((user, index) => {
                if (user.username === localStorage.getItem('username')) {
                    setRight(user.right);
                }
            });
        });
        setOpenRoomInfo(true);
    };

    const handleOpenInvitation = () => {
        chatSocket.emit('ft_getfriendlist', (res: any) => {
            if (res.checktoken === false) {
                removeJwtCookie('jwt');
                pingpongSocket.disconnect();
                chatSocket.disconnect();
                gameSocket.disconnect();
                localStorage.clear();
                setOpenTokenError(true);
                return;
            }
            setFriends(res);
        });
        setOpenRoomInvitation(true);
    };

    const handleCloseRoomInfo = () => {
        setOpenRoomInfo(false);
    };

    const handleCloseRoomInvitation = () => {
        setOpenRoomInvitation(false);
    };

    const handleAddFriendClose = () => {
        setShowAddFriend(false);
    };

    const handleCloseGameInvitation = () => {
        setOpenGameInvitation(false);
    };

    const handleCloseError = () => {
        setOpenError(false);
    };

    const handleClose = () => {
        setOpenTokenError(false);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <ModalError isOpen={openError} onClose={handleCloseError} title={'에러'} message={errorMessage} />
            <ModalTokenError isOpen={openTokenError} onClose={handleClose} title={'토큰 에러'} message={"토큰이 만료되었습니다. 재로그인해주세요"} />
            <ModalAddFriend
                isOpen={showAddFriend}
                onClose={handleAddFriendClose}
                title={'친구 요청'}
                sender={sender}
                receiver={receiver}
            />
            <ModalRoomInfo
                isOpen={openRoomInfo}
                onClose={handleCloseRoomInfo}
                title={'채팅방 정보'}
                chatUsers={chatUsers}
                right={right}
                chats={chats}
                setChats={setChats}
                intraId={intraId}
            />
            <ModalRoomInvitation
                isOpen={openRoomInvitation}
                onClose={handleCloseRoomInvitation}
                title={'채팅방 초대'}
                friends={friends}
            />
            <ModalGameInvitationReceiver
                isOpen={openGameInvitation}
                onClose={handleCloseGameInvitation}
                title={'게임 초대'}
                roomName={roomName}
                sender={sender}
            />
            <AppBar position="static">
                <Stack direction="column" spacing={2}>
                    <h2>채팅방 이름 : {roomName}</h2>
                    <Box sx={{ display: 'flex', gap: '10px' }}>
                        <Button variant="contained" onClick={handleOpen}>
                            채팅방 정보
                        </Button>
                        <Button variant="contained" onClick={handleOpenInvitation}>
                            채팅방 초대
                        </Button>
                    </Box>
                </Stack>
            </AppBar>
            <div style={{ margin: '30px 0' }} />
            <div ref={chatContainerEl} style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                {chats.map((chat, index) => (
                    <div key={index}>
                        <div style={{ margin: '20px 0' }} />
                        <span style={{ fontWeight: 'bold', color: 'green' }}>{chat.username} : </span>
                        <span style={{ fontWeight: 'bold', color: 'black' }}>{chat.message}</span>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <form onSubmit={onSendMessage}>
                    <input type="text" onChange={onChange} value={message} />
                    <button>Send</button>
                </form>

                <button onClick={onLeaveRoom} style={{ marginLeft: '10px' }}>
                    나가기
                </button>
            </div>
        </Box>
    );
};

export default ChatRoom;
