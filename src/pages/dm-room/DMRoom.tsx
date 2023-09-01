import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { } from 'react-router-dom';
import { } from '../../api/atoms';
import { useSearchParams, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { dmNameState } from '../../api/atoms';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { SocketContext } from '../../api/SocketContext';

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

const DMRoom = () => {
    const { chatSocket } = useContext(SocketContext);
    const [chats, setChats] = useState([]);
    const [message, setMessage] = useState('');
    const chatContainerEl = useRef(null);
    const index = localStorage.getItem('dm-index');
    const receiver = localStorage.getItem('dm-username');
    const navigate = useNavigate();

    useEffect(() => {
        if (!chatContainerEl.current) return;

        const chatContainer = chatContainerEl.current;
        const { scrollHeight, clientHeight } = chatContainer;

        if (scrollHeight > clientHeight) {
            chatContainer.scrollTop = scrollHeight - clientHeight;
        }
    }, [chats.length]);

    useEffect(() => {
        setMessage('');
        const data = {
            roomName: index
        }; // { roomName: index }
        chatSocket.emit('ft_get_dm_log', data, (chat) => {
            setChats(chat);
        });

        const messageHandler = (chat: any) => {
            setChats((prevChats) => [...prevChats, chat]);
        };

        chatSocket.on('ft_dm', messageHandler);

        chatSocket.on('ft_tomain', (res: any) => {
            if (res) {
                navigate('/main');
            }
        });

        return () => {
            chatSocket.emit('leave-dm', data, () => {
            });
        };
    }, []);

    const onChange = useCallback((e) => {
        setMessage(e.target.value);
    }, [message]);

    const onSendMessage = useCallback(
        async (e) => {
            e.preventDefault();

            if (message === '') return alert('메시지를 입력해 주세요.');
            const data = {
                roomName: index,
                message,
                receiver,
            };
            await chatSocket.emit('ft_dm', data, (chat) => {
                setChats((prevChats) => [...prevChats, chat]);
                setMessage('');
            });
        },
        [index, message],
    );

    const onLeaveRoom = useCallback(() => {
        navigate('/main');
    }, [navigate]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <h2>{receiver}님과의 DM</h2>
            </AppBar>
            <div ref={chatContainerEl} style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                {chats.map((chat, index) => (
                    <div key={index}>
                        <span style={{ fontWeight: 'bold', color: 'green' }}>{chat.username} : </span>
                        <span style={{ fontWeight: 'bold', color: 'black' }}>{chat.message}</span>
                        <div style={{ margin: '10px 0' }} />
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

export default DMRoom;
