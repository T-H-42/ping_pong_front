import { Backdrop, Box, Button, Container, Typography } from '@mui/material';
import { SocketContext } from '../../api/SocketContext';
import { isOwnerState, settingRoomNameState } from '../../api/atoms';
import { createGameSocket } from '../../api/socket';
import React, { useCallback, useContext, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router';
import styles from '../../styles/setting-room/setting-room.module.css';
const OwnerPlayer = ({ onReady, guestReady }) => {
    const { gameSocket } = useContext(SocketContext);
    const RsettingRoomName = useRecoilValue(settingRoomNameState);
    const RisOwner = useRecoilValue(isOwnerState);
    const navigate = useNavigate();

    const initGameHandler = useCallback(() => {
        if (!onReady) {
            alert('상대방이 준비되지 않았습니다.');
            return;
        }
        if (!RsettingRoomName) {
            navigate('/');
            alert('잘못된 접근입니다.');
        }
        gameSocket.emit('ft_game_play', RsettingRoomName, (response: any) => {
            if (!response.success) return alert(response.payload);
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
                            <img
                                src="/images/profile.jpg"
                                alt="user_image"
                                style={{ borderRadius: '30%', width: '80px', height: '119.774px' }}
                            />
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
                                박댕댕
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
                                {/* <span>총 50판</span>
                            <span>20승 30패</span>
                            <span>승률 25%</span> */}
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography className={styles.RecentRecordComment}>2023-07-10 WIN</Typography>
                            <Typography className={styles.RecentRecordComment}>2023-07-10 WIN</Typography>
                            <Typography className={styles.RecentRecordComment}>2023-07-10 WIN</Typography>
                            <Typography className={styles.RecentRecordComment}>2023-07-10 WIN</Typography>
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
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="25"
                                    height="25"
                                    viewBox="0 0 25 25"
                                    fill="none"
                                >
                                    <path
                                        d="M16.2502 14.1468L16.2559 14.1371L16.6587 21.0377L16.6513 21.0365C16.7034 21.6734 16.2951 22.2763 15.6559 22.4476C15.2817 22.5478 14.9021 22.4805 14.5967 22.2915L10.4893 20.152L16.2522 14.1355L16.2502 14.1468Z"
                                        fill="#BC4141"
                                    />
                                    <path
                                        d="M10.8529 8.75446L10.8626 8.74874L3.96205 8.34595L3.96323 8.35328C3.32629 8.3012 2.72343 8.70953 2.55215 9.34875C2.45188 9.72295 2.51926 10.1026 2.70825 10.4079L4.84772 14.5154L10.8642 8.75242L10.8529 8.75446Z"
                                        fill="#BC4141"
                                    />
                                    <path
                                        d="M4.84342 14.489L10.5128 20.1583L9.6009 21.0702C9.21037 21.4607 8.57721 21.4607 8.18668 21.0702L3.93157 16.815C3.54104 16.4245 3.54104 15.7913 3.93157 15.4008L4.84342 14.489Z"
                                        fill="#4F4F4F"
                                    />
                                    <path
                                        d="M15.6715 3.67499C17.2336 2.11289 19.7662 2.11289 21.3283 3.67498C22.8904 5.23708 22.8904 7.76974 21.3283 9.33184L10.4977 20.1626L4.84082 14.5057L15.6715 3.67499Z"
                                        fill="#7BC1D1"
                                    />
                                    <path
                                        d="M5.35663 21.695C4.69269 22.3589 3.46603 22.6288 2.58755 22.4173C2.3753 21.5657 2.64595 20.3122 3.30988 19.6482C3.97382 18.9843 4.97022 18.9042 5.53541 19.4694C6.1006 20.0346 6.02056 21.031 5.35663 21.695Z"
                                        fill="#FAB507"
                                    />
                                    <path
                                        d="M15.5342 10.95C16.3626 10.95 17.0342 10.2784 17.0342 9.44995C17.0342 8.62152 16.3626 7.94995 15.5342 7.94995C14.7058 7.94995 14.0342 8.62152 14.0342 9.44995C14.0342 10.2784 14.7058 10.95 15.5342 10.95Z"
                                        fill="#D9D9D9"
                                    />
                                </svg>
                                <Typography
                                    sx={{
                                        color: 'var(--primary, #3874CB)',
                                        fontFamily: 'Pretendard',
                                        fontSize: '14px',
                                        fontStyle: 'normal',
                                        fontWeight: 500,
                                        lineHeight: '18px',
                                    }}
                                >
                                    초심자
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="25"
                                    height="25"
                                    viewBox="0 0 25 25"
                                    fill="none"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M13.2529 3.006C12.8678 2.34045 11.907 2.34045 11.5219 3.006L8.36596 8.45996L3.76326 7.14111C3.02171 6.92862 2.33372 7.61613 2.53285 8.37066L3.81213 13.218C3.81681 13.2468 3.82278 13.2758 3.83009 13.3047L5.45581 19.7448C5.56792 20.1889 5.96738 20.5 6.4254 20.5H18.3216C18.7738 20.5 19.1697 20.1966 19.2872 19.7599L21.0206 13.3199C21.0449 13.2294 21.0561 13.1391 21.0554 13.0509L22.2899 8.37338C22.489 7.61885 21.801 6.93135 21.0595 7.14383L16.417 8.47408L13.2529 3.006Z"
                                        fill="#FAB507"
                                    />
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M14.1689 14.3945C14.2583 14.2398 14.2583 14.0492 14.1689 13.8945L12.9328 11.7534C12.7404 11.4201 12.2592 11.4201 12.0668 11.7534L10.8307 13.8945C10.7413 14.0492 10.7413 14.2398 10.8307 14.3945L12.0668 16.5355C12.2592 16.8688 12.7404 16.8688 12.9328 16.5355L14.1689 14.3945Z"
                                        fill="#FA8A07"
                                    />
                                </svg>
                                <Typography
                                    sx={{
                                        color: 'var(--primary, #3874CB)',
                                        fontFamily: 'Pretendard',
                                        fontSize: '14px',
                                        fontStyle: 'normal',
                                        fontWeight: 500,
                                        lineHeight: '18px',
                                    }}
                                >
                                    인기쟁이
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                {/* 
                <Button
                    variant="outlined"
                    onClick={initGameHandler}
                    disabled={!RisOwner}
                    style={{
                        width: '395px',
                        height: '32px',
                        padding: '1 6px ',
                        backgroundColor: guestReady ? '#3874CB' : 'rgba(255, 255, 255)', // 대기중일 때 색상 제거
                        color: guestReady ? '#ffffff' : '#1976d2',
                        fontWeight: 'bold',
                    }}
                >
                    게임시작
                </Button> */}
                <Box sx={{ height: '32px' }}>
                    <Button
                        variant="outlined"
                        onClick={initGameHandler}
                        // disabled={!RisOwner}
                        style={{
                            width: '395px',
                            padding: '16px ',
                            backgroundColor: onReady ? '#3874CB' : 'rgba(255, 255, 255)', // 대기중일 때 색상 제거
                            color: onReady ? '#ffffff' : '#1976d2',
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
