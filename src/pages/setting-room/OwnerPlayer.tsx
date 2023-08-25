import { Backdrop, Box, Button, Container, Typography } from '@mui/material';
import { SocketContext } from '../../api/SocketContext';
import { isOwnerState, settingRoomNameState } from '../../api/atoms';
import { createGameSocket } from '../../api/socket';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router';
import styles from '../../styles/setting-room/setting-room.module.css';
import { getJwtCookie } from '../../api/cookies';
import axios from 'axios';
import UserInfo from '../../types/UserInfo';

const OwnerPlayer = ({ onReady, guestReady, onReadyToggle }) => {
    const { gameSocket } = useContext(SocketContext);
    const RsettingRoomName = useRecoilValue(settingRoomNameState);
    const RisOwner = useRecoilValue(isOwnerState);
    const navigate = useNavigate();
    const [userInformation, setUserInformation] = useState<UserInfo | null>();
    const queryParams = { username: localStorage.getItem('username') };
    //방장이랑 게스트 네임 둘 다 받아와야 함

    useEffect(() => {
        axios
            .get(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/user/profile`, {
                params: queryParams,
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${getJwtCookie('jwt')}`,
                },
            })
            .then((response) => {
                setUserInformation(response.data);
            })
            .catch((err) => {
                alert(`방장 정보를 불러오는데 실패하였습니다. : ${err}`);
            });
    }, []);
    console.log('user if', userInformation);

    const initGameHandler = useCallback(() => {
        if (!guestReady) {
            alert('상대방이 준비되지 않았습니다.');
            return;
        }
        if (!RsettingRoomName) {
            navigate('/');
            alert('잘못된 접근입니다.');
        }
        gameSocket.emit('ft_game_play', RsettingRoomName, (response: any) => {
            if (!response.success) {
                alert(response.payload);
                return;
            }
            alert('에밋컬');
        });
        navigate(`/game-room/${RsettingRoomName}`);
    }, [onReady, guestReady]);

    return (
        <Box sx={{ width: '680px', height: '864px' }} display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    margin: '0 auto',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                }}
            >
                <Box className={styles.ProfileContainer}>
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
                            {userInformation?.image_url ? (
                                <img
                                    src={userInformation.image_url}
                                    alt="user_image"
                                    style={{ borderRadius: '30%', width: '80px', height: '119.774px' }}
                                />
                            ) : (
                                <img
                                    src="/images/profile.jpg"
                                    alt="user_image"
                                    style={{ borderRadius: '30%', width: '80px', height: '119.774px' }}
                                />
                            )}

                            <Typography
                                sx={{
                                    color: 'var(--text-primary, #000)',
                                    fontFamily: 'Pretendard',
                                    fontSize: '20px',
                                    fontStyle: 'normal',
                                    fontWeight: 700,
                                    lineHeight: '26px',
                                    marginTop: '16px',
                                }}
                            >
                                {userInformation ? userInformation.username : '정보 없음'}
                            </Typography>
                        </Box>
                        <Typography
                            sx={{
                                color: 'var(--text-primary, #000)',
                                fontFamily: 'Pretendard',
                                fontSize: '16px',
                                fontStyle: 'normal',
                                fontWeight: 500,
                                lineHeight: '24px',
                            }}
                        >
                            안녕하세여안녕하세여안녕하세여안녕하세여안녕하세여
                        </Typography>
                    </Box>
                </Box>
                <Box className={styles.RecordContainer}>
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            padding: '16px 24px',
                            gap: '16px',
                            margin: '0 auto',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-around',
                        }}
                    >
                        <Box>
                            <Box
                                sx={{
                                    color: 'var(--text-primary, #000)',
                                    fontFamily: 'Pretendard',
                                    fontSize: '16px',
                                    fontStyle: 'normal',
                                    fontWeight: 600,
                                    lineHeight: '24px',
                                }}
                            >
                                전적
                            </Box>
                            <Box>
                                <Typography
                                    sx={{
                                        color: 'var(--text-primary, #000)',
                                        fontFamily: 'Pretendard',
                                        fontSize: '16px',
                                        fontStyle: 'normal',
                                        fontWeight: 500,
                                        lineHeight: '24px',
                                    }}
                                >
                                    총 50판 20승 30패 승률 25%
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            {userInformation?.userGameHistory.length === 0 ? (
                                <Typography>최근 게임 기록 없음</Typography>
                            ) : (
                                userInformation?.userGameHistory.map((item) => (
                                    <Typography className={styles.RecentRecordComment} key={item.time}>
                                        {item.time}
                                    </Typography>
                                ))
                            )}
                        </Box>
                    </Box>
                </Box>
                <Box className={styles.ArchvimentsContainer}>
                    <Box sx={{ width: '90%', height: '100%', margin: '0 auto' }}>
                        <Box>
                            <Typography
                                sx={{
                                    color: 'var(--text-primary, #000)',
                                    fontFamily: 'Pretendard',
                                    fontSize: '16px',
                                    fontStyle: 'normal',
                                    fontWeight: 600,
                                    lineHeight: '24px',
                                }}
                            >
                                업적
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                {userInformation?.achievements.length === 0 ? (
                                    <Typography>업적 없음</Typography>
                                ) : (
                                    userInformation?.achievements.map((item) => (
                                        <Typography className={styles.RecentRecordComment} key={item.time}>
                                            {item.time}
                                        </Typography>
                                    ))
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ height: '32px' }}>
                    <Button
                        variant="outlined"
                        onClick={initGameHandler}
                        disabled={!RisOwner}
                        style={{
                            width: '395px',
                            padding: '16px ',
                            backgroundColor: guestReady ? '#3874CB' : 'rgba(255, 255, 255)', // 대기중일 때 색상 제거
                            color: guestReady ? '#ffffff' : '#1976d2',
                            fontWeight: 'bold',
                        }}
                    >
                        게임시작
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default OwnerPlayer;
