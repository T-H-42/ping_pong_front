import { Link, Box, Button, Typography } from '@mui/material';
import { isOwnerState, settingState } from '../../api/atoms';
import React, { useContext, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { SocketContext } from '../..//api/SocketContext';
import { useNavigate } from 'react-router';
import styles from '../../styles/setting-room/setting-room.module.css';
import axios from 'axios';
import { getJwtCookie } from '../../api/cookies';
import UserInfo from '../../types/UserInfo';
import {ProfileGameHistory} from '../../components/ProfileComponents'

const GuestPlayer = ({ onReady, onReadyToggle }) => {
    const RisOwner = useRecoilValue(isOwnerState);
    const { gameSocket } = useContext(SocketContext);
    const navigate = useNavigate();
    const [guestInformation, setGuestInformation] = useState<UserInfo | null>(null);
    const settingInfo = useRecoilValue(settingState);

    useEffect(() => {
        if (settingInfo?.guestName) {

        axios
            .get(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/user/profile`, {
                params: {
                    username: settingInfo.guestName,
                },
                headers: {
                    Authorization: `Bearer ${getJwtCookie('jwt')}`,
                },
            })
            .then((response) => {
                console.log(response);
                setGuestInformation(response.data);
            })
            .catch((err) => {
                alert(`게스트 정보를 불러오는데 실패하였습니다. : ${err}`);
            });
    }
}, []);
    const handleExit = () => {
        gameSocket.emit('ft_leave_setting_room', (response: any) => {
            if (!response.success) {
                alert(`설정 방 나가기 실패 :  ${response.payload}`);
                return;
            }
        });
        navigate('/');
    };
    console.log("체크해 값", guestInformation);
    
    return (
        <Box className={styles.GuestContainer}>
            {!guestInformation && <h2>Loading</h2>}
            { guestInformation && <Box
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
                                src={guestInformation?.image_url ? `http://${process.env.REACT_APP_IP_ADDRESS}:4000/${guestInformation.image_url}` : '/images/profile.jpg'}
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
                                {guestInformation ? guestInformation.username : '정보 없음'}
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
                            {/* 안녕하세여안녕하세여안녕하세여안녕하세여안녕하세여 */}
                        </Typography>
                    </Box>
                </Box>
                <Box className={styles.RecordContainer}>
                    {/* <Box
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
                    > */}
                        <Box>
                            {/* <Box
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
                            </Box> */}
                            {/* <Box>
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
                            </Box> */}
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {!(guestInformation?.userGameHistory.length) ? (
  <Typography sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
    최근 게임 기록 없음
  </Typography>
) : (
      <ProfileGameHistory username={guestInformation.username} history={guestInformation.userGameHistory } />
)}

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
                                <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                    {!(guestInformation?.achievements.length) ? (
                                        <Typography>업적 없음</Typography>
                                        ) : (
                                        // {console.log(guestInformation);}
                                        guestInformation?.achievements?.map((item, idx) => (
                                            <Typography className={styles.RecentRecordComment} key={idx}>
                                                {item}
                                            </Typography>
                                        ))
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ width: '80%', height: '32px' }}>
                    <Button
                        variant="outlined"
                        onClick={onReadyToggle}
                        disabled={RisOwner}
                        style={{
                            width: '100%',
                            padding: '16px ',
                            backgroundColor: onReady ? '#9BD3F2' : '#fff', // 대기중일 때 색상 제거
                            color: onReady ? '#ffffff' : '#9BD3F2',
                            fontWeight: 'bold',
                        }}
                    >
                        준비
                    </Button>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Link sx={{}} component="button" variant="body2" onClick={handleExit}>
                            게임 나가기
                        </Link>
                    </Box>
                </Box>
            </Box>}
        </Box>
    
    );
};

export default GuestPlayer;
