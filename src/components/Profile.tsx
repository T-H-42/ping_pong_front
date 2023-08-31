import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, Modal } from '@mui/material';
import { useQuery } from 'react-query';
import { SocketContext } from '../api/SocketContext';
import  { removeJwtCookie}  from '../api/cookies';
import {ProfileHeader, ProfileGameHistory, ProfileAchievements} from "./ProfileComponents";
import fetchProfileData from "./fetchProfileData"

import ModalError from './ModalError';
import ModalTokenError from './ModalTokenError';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    height: '80vh',
    width: '60vw',
};

const Profile = ({ username, right, isOpen, onClose, roomName, chats, setChats }) => {
    const { chatSocket, gameSocket, pingpongSocket } = useContext(SocketContext);
    const { data: userInfo } = useQuery(['userInfo', username], () => fetchProfileData(username), {
        suspense: true,
        useErrorBoundary: true,
    });

    const [openError, setOpenError] = useState(false);
    const [message, setMessage] = useState('');
    const [openTokenError, setOpenTokenError] = useState(false);
    const navigate = useNavigate();

    const handleMuteClick = (e) => {
        chatSocket.emit('ft_mute', { roomName, targetUser: e }, (response: any) => {
            console.log('ft_mute: ');
            if (!response.success) {
                setOpenError(true);
                setMessage(response.faillog);
                return;
            }
            // console.log('ft_mute: ', response);
            ///-> nhwang: 테스트 해보니채팅방이 폭파되어도 계속호출되니, 제가 보낸 리턴값을 보고, clearInterval()을 아마 호출해야 될 것 같아요.
            // useEffect(() => {
            //   const intervalId = setInterval(() => {
            //     // 여기에 매 2분마다 실행할 코드 또는 함수를 작성합니다.
            //     console.log('특정 이벤트 발생');
            //   }, 120000); // 2분을 밀리초로 변환한 값

            //   return () => {
            //     clearInterval(intervalId); // 컴포넌트가 언마운트될 때 인터벌 정리
            //   };
            // }, []);
        });
    };

    const handleAddFriendClick = (e) => {
        chatSocket.emit('ft_addfriend', { receiver: e, roomName: roomName }, (response: any) => { //nhwang roomName추가하였슴다
            console.log('ft_addfriend emit: ', response);
            if (response.checktoken===false) {
                pingpongSocket.disconnect();
                chatSocket.disconnect();
                gameSocket.disconnect();
                removeJwtCookie('jwt');
                localStorage.clear();
                setOpenTokenError(true);
                return ;
            }
            if (!response.success) {
                setOpenError(true);
                setMessage(response.faillog);
                return;
            }
        });
    };

    const handleInviteGameClick = (e) => {
        gameSocket.emit('ft_invite_game', { guestName: e, roomName: roomName }, (response: any) => {
            console.log('ft_invite_game emit: ', response);
            if (response.checktoken===false) {
                pingpongSocket.disconnect();
                chatSocket.disconnect();
                gameSocket.disconnect();
                removeJwtCookie('jwt');
                localStorage.clear();
                setOpenTokenError(true);
                return ;
            }
            if (!response.success) {
                setOpenError(true);
                setMessage(response.faillog);
                return;
            }
        });
    };

    const handleKickClick = (e) => {
        chatSocket.emit('ft_kick', { roomName, targetUser: e }, (response: any) => {
            console.log('ft_kick emit: ', response);
            if (response.checktoken===false) {
                pingpongSocket.disconnect();
                chatSocket.disconnect();
                gameSocket.disconnect();
                removeJwtCookie('jwt');
                localStorage.clear();
                setOpenTokenError(true);
                return ;
            }
            if (!response.success) {
                setOpenError(true);
                setMessage(response.faillog);
                return;
            }
        });
    };

    const handleBanClick = (e) => {
        chatSocket.emit('ft_ban', { roomName, targetUser: e }, (response: any) => {
            console.log('ft_ban emit: ', response);
            if (response.checktoken===false) {
                pingpongSocket.disconnect();
                chatSocket.disconnect();
                gameSocket.disconnect();
                removeJwtCookie('jwt');
                localStorage.clear();
                setOpenTokenError(true);
                return ;
            }
            if (!response.success) {
                setOpenError(true);
                setMessage(response.faillog);
                return;
            }
        });
    };

    const handleBlockClick = (e) => {
        chatSocket.emit('ft_block', { roomName, targetUser: e }, (response: any) => {
            console.log('ft_block emit: ', response);
            if (response.checktoken===false) {
                pingpongSocket.disconnect();
                chatSocket.disconnect();
                gameSocket.disconnect();
                removeJwtCookie('jwt');
                localStorage.clear();
                setOpenTokenError(true);
                return ;
            }
            if (!response.success) {
                setOpenError(true);
                setMessage(response.faillog);
                return;
            }
        });
    };

    const handleHostClick = (e) => {
        chatSocket.emit('ft_addAdmin', { roomName, targetUser: e }, (response: any) => {
            console.log('ft_addAdmin emit: ', response);
            if (response.checktoken===false) {
                pingpongSocket.disconnect();
                chatSocket.disconnect();
                gameSocket.disconnect();
                removeJwtCookie('jwt');
                localStorage.clear();
                setOpenTokenError(true);
                return ;
            }
            if (!response.success) {
                setOpenError(true);
                setMessage(response.faillog);
                return;
            }
            setChats([...chats, response]);
        });
    };

    const handleClose = () => {
        setOpenError(false);
    };

    const handleTokenErrorClose = () => {
        setOpenTokenError(false);
    };

    return (
        <Modal open={isOpen} onClose={onClose} sx={{ overflow: 'auto' }}>
            <Stack spacing={5} direction="column" alignItems="center" sx={{ ...style, overflow: 'auto' }}>
            <ModalTokenError isOpen={openTokenError} onClose={handleTokenErrorClose} title={'토큰 에러'} message={"토큰이 만료되었습니다. 재로그인해주세요"} />
                <ModalError isOpen={openError} onClose={handleClose} title={'에러'} message={message} />
				<ProfileHeader imageUrl={ userInfo.image_url} userName={ username } ladderLv={userInfo.ladder_lv }></ProfileHeader>
                <Stack direction="column" spacing={6}>
                    <Stack direction="row" spacing={5}>
                        <Button variant="contained" onClick={() => handleAddFriendClick(username)}>
                            친구 추가
                        </Button>
                        <Button variant="contained" onClick={() => handleInviteGameClick(username)}>
                            게임 초대
                        </Button>
                    </Stack>

                    <Stack spacing={2}>
						<ProfileGameHistory username={username} history={userInfo.userGameHistory} />
						<ProfileAchievements achievements={userInfo.achievements} />
                    </Stack>

                    <Stack direction="column" spacing={1} alignItems="flex-start">
                        {(right === 1 || right === 2) && (
                            <>
                                <Button variant="text" onClick={() => handleMuteClick(username)}>
                                    음소거
                                </Button>
                                <Button variant="text" onClick={() => handleKickClick(username)}>
                                    강제 퇴장
                                </Button>
                                <Button variant="text" onClick={() => handleBanClick(username)}>
                                    채팅 접근 금지
                                </Button>
                                <Button variant="text" onClick={() => handleHostClick(username)}>
                                    Admin로 지정
                                </Button>
                            </>
                        )}
                        {/* {right === 2 && <Button variant="text" onClick={() => handleHostClick(username)}>Admin로 지정</Button>} */}

                        <Button variant="text" color="error" onClick={() => handleBlockClick(username)}>
                            사용자 차단
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Modal>
    );
};

export { Profile };
