import React, { useEffect, useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getJwtCookie } from '../../api/cookies';
import axios from 'axios';
import ChatList from './ChatList';
import FriendList from './FriendList';
import LogOutButton from '../../components/LogOutButton';
import { useRecoilValue, useRecoilState } from 'recoil';

import { SocketContext } from '../../api/SocketContext';
import { isOwnerState, settingRoomNameState } from '../../api/atoms';
import { removeJwtCookie } from '../../api/cookies';

import ModalTokenError from '../../components/ModalTokenError';
import GameStartButton from '../../components/GameStartButton';
import ModalRoomInvitationReceiver from '../../components/ModalRoomInvitationReceiver';

import { Button, Box, Typography } from '@mui/material';

const Main = () => {
    const RisOwner = useRecoilValue(isOwnerState);

    const { pingpongSocket, chatSocket, gameSocket } = useContext(SocketContext);
    const [friends, setFriends] = useState([]);
    const [openInvitation, setOpenInvitation] = useState(false);
    const [roomName, setRoomname] = useState('');
    const [sender, setSender] = useState('');

    const [openTokenError, setOpenTokenError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!getJwtCookie('jwt')) {
            navigate('/');
        }
        chatSocket.on('ft_invitechat', (res: any) => {
            setRoomname(res.index);
            setSender(res.sender);
            setOpenInvitation(true);
        });

        return (() => {
            gameSocket.emit('ft_exit_match_queue', (response: any) => {
                if (response.checktoken === false) {
                    pingpongSocket.disconnect();
                    chatSocket.disconnect();
                    gameSocket.disconnect();
                    removeJwtCookie('jwt');
                    localStorage.clear();
                    setOpenTokenError(true);
                    return;
                }

                if (!response.success) {
                    alert("매치 취소에 실패하였습니다 : ");
                    return
                }
            });
        })
    }, []);

    useEffect(() => {
        pingpongSocket.on('ft_connect', (respnose: any) => {
            if (!respnose.checktoken) {
                pingpongSocket.disconnect();
                chatSocket.disconnect();
                gameSocket.disconnect();
                removeJwtCookie('jwt');
                localStorage.clear();
                // setOpenTokenError(true);
                return;
            }

            const updatedFriends: any = friends.map((friend: any) => {
                if (friend.username === respnose.status) {
                    return { ...friend, status: 1 };
                }
                return friend;
            });
            setFriends([...updatedFriends]);
        });

        pingpongSocket.on('ft_disconnect', (respnose: any) => {
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

    const handleClose = () => {
        setOpenInvitation(false);
    };

    const handleTokenErrorClose = () => {
        setOpenTokenError(false);
    };

    const handleClickMyPage = () => {
        axios.get(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/user/profile`, {
            params: {
                username: localStorage.getItem('username'),
            },
            headers: {
                Authorization: `Bearer ${getJwtCookie('jwt')}`,
            },
        })
            .then(() => {
                navigate('/mypage');
            })
            .catch((error) => {
                pingpongSocket.disconnect();
                chatSocket.disconnect();
                gameSocket.disconnect();
                removeJwtCookie('jwt');
                localStorage.clear();
                setOpenTokenError(true);
            });
    };



    return (
        <div style={{ textAlign: 'center' }}>
            <ModalTokenError isOpen={openTokenError} onClose={handleTokenErrorClose} title={'토큰 에러'} message={"토큰이 만료되었습니다. 재로그인해주세요"} />
            <ModalRoomInvitationReceiver isOpen={openInvitation} onClose={handleClose} title={'채팅방 초대'} roomName={roomName} sender={sender} />
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <GameStartButton />
                <LogOutButton />
            </Box>
            <div style={{ margin: '30px 0' }} />
            <Typography variant="h3" component="h3">
                <Button onClick={handleClickMyPage}>
                    {localStorage.getItem('username')}
                </Button>
                의 메인 페이지
            </Typography>
            <div style={{ margin: '30px 0' }} />
            <ChatList />
            <div style={{ margin: '30px 0' }} />
            <FriendList />
            <div style={{ margin: '30px 0' }} />
        </div>
    );
};

export default Main;
