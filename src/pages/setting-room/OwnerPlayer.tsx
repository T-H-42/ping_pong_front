import { Backdrop, Box, Button, Container, Typography } from '@mui/material';
import { SocketContext } from '../../api/SocketContext';
import { isOwnerState, settingRoomNameState } from '../../api/atoms';
import { createGameSocket } from '../../api/socket';
import React, { useCallback, useContext, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router';

const OwnerPlayer = ({ onReady }) => {
    const { gameSocket } = useContext(SocketContext);
    const RsettingRoomName = useRecoilValue(settingRoomNameState);
    const RisOwner = useRecoilValue(isOwnerState);
    const navigate = useNavigate();
    const initGameHandler = useCallback(() => {
        if (!onReady) {
            if (!RsettingRoomName) {
                navigate('/');
                alert('잘못된 접근입니다.');
            }
            gameSocket.emit('ft_game_play', RsettingRoomName, (response: any) => {
                if (!response.success) return alert(response.payload);
            });
            navigate(`/game-room/${RsettingRoomName}`);
        }
        if (onReady) {
            alert('상대방이 준비되지 않았습니다.');
        }
    }, [onReady]);
    return (
        <Box sx={{ width: '50%', height: '100%' }}>
            <Box
                sx={{
                    width: '60%',
                    height: '100%',
                    display: 'flex',
                    margin: '0 auto',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        height: '40%',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        boxShadow: '0px 1px 8px 0px rgba(0, 0, 0, 0.10)',
                    }}
                >
                    <Box
                        sx={{
                            width: '90%',
                            height: '85%',
                            display: 'flex',
                            margin: '0 auto',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                height: '60%',
                                textAlign: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <img
                                src="https://www.gravatar.com/avatar/HASH"
                                alt="user_image"
                                style={{ borderRadius: '30%', width: '20%' }}
                            />
                            <h2>박댕댕</h2>
                        </Box>
                        <Box>안녕하세여안녕하세여안녕하세여안녕하세여안녕하세여</Box>
                    </Box>
                </Box>
                <Box
                    sx={{
                        width: '100%',
                        height: '30%',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        boxShadow: '0px 1px 8px 0px rgba(0, 0, 0, 0.10)',
                        borderRadius: '24px',
                    }}
                >
                    <Box
                        sx={{
                            width: '90%',
                            height: '90%',
                            margin: '0 auto',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-around',
                        }}
                    >
                        <Box>
                            <Box>전적</Box>
                            <Box>
                                <span>총 50판</span>
                                <span>20승 30패</span>
                                <span>승률 25%</span>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <span>2023-07-10 WIN</span>
                            <span>2023-07-10 WIN</span>
                            <span>2023-07-10 WIN</span>
                            <span>2023-07-10 WIN</span>
                        </Box>
                    </Box>
                </Box>
                <Box
                    sx={{
                        width: '100%',
                        height: '15%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        boxShadow: '0px 1px 8px 0px rgba(0, 0, 0, 0.10)',
                        borderRadius: '24px',
                    }}
                >
                    <Box sx={{ width: '90%', height: '100%', margin: '0 auto' }}>
                        <Box>
                            <p>업적</p>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                <img
                                    width={'30%'}
                                    src="https://www.gravatar.com/avatar/HASH"
                                    alt="user_image"
                                    style={{ borderRadius: '30%' }}
                                />
                                <p>초심자</p>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                <img
                                    width={'30%'}
                                    src="https://www.gravatar.com/avatar/HASH"
                                    alt="user_image"
                                    style={{ borderRadius: '30%' }}
                                />
                                <p>인기쟁이</p>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ height: '8%' }}>
                    {RisOwner && (
                        <Button
                            variant="outlined"
                            onClick={initGameHandler}
                            style={{
                                width: '100%',
                                backgroundColor: onReady ? '#3874CB' : 'rgba(255, 255, 255)', // 대기중일 때 색상 제거
                                color: onReady ? '#ffffff' : '#1976d2',
                                fontWeight: 'bold',
                            }}
                        >
                            게임시작
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default OwnerPlayer;
