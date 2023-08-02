import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import {} from 'react-router-dom';
import {} from '../../api/atoms';
import { useSearchParams, useNavigate, Navigate } from 'react-router-dom';
import { roomNameState } from '../../api/atoms';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { SocketContext } from '../../api/SocketContext';

const DMRoom = () => {
    const { chatSocket } = useContext(SocketContext);
    const [chats, setChats] = useState([]);
    const [message, setMessage] = useState('');
    const chatContainerEl = useRef(null);
    const RroomName = useRecoilValue(roomNameState);
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
        const messageHandler = (chat) => {
            setChats((prevChats) => [...prevChats, chat]);
        };
        chatSocket.on('ft_message', messageHandler);
        return () => {
            console.log('message off');
            chatSocket.off('ft_message', messageHandler);
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
            console.log('send message');
            await chatSocket.emit('ft_message', { message, roomName: RroomName }, (chat) => {
                setChats((prevChats) => [...prevChats, chat]);
                setMessage('');
            });
        },
        [message, RroomName],
    );

    const onLeaveRoom = useCallback(() => {
        chatSocket.emit('leave-room', RroomName, () => {
            navigate('/main');
        });
    }, [navigate, RroomName]);

    // 뒤로가기
    // useEffect(() => {
    //     return () => {
    //         onLeaveRoom()
    //     }
    // }, [onLeaveRoom])

    return (
        <>
            <div>
                <h2>채팅방 이름 : {RroomName}</h2>
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

export default DMRoom;
