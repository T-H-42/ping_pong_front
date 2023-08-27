import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Button, Stack, Box, Typography, Modal } from '@mui/material';
import { useQuery } from 'react-query';
import { getJwtCookie } from '../api/cookies';
import { SocketContext } from '../api/SocketContext';
import styles from '../styles/main/main.module.css';
import stylesP from '../styles/profile.module.css'

import ModalError from './ModalError';

const fetchProfileData = async (userName) => {
    const res = await axios.get(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/user/profile`, {
        params: {
            username: `${userName}`,
        },
        headers: {
            Authorization: `Bearer ${getJwtCookie('jwt')}`,
        },
      },
    ).catch((res) => {
      console.log(res);
      return res;
    })
  return res.data;
};

const Achievements = ({ achievements }) => {
    return achievements.map((achievement) => <Typography key={achievement}>{achievement}</Typography>);
};

const GameHistory = ({ username, history }) => {
  return (
    <div>
      <table cellPadding={10} cellSpacing={10} className={stylesP.centeredTable}>
    <tr>
      <td>결과</td>
      <td>winner</td>
      {/* <td>loser</td> */}
      <td>플레이 날짜</td>
    </tr>
    {history.map((data) => {
      const date = new Date(data.time);
      const gameDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      return (
        <tr key={ gameDate }>
          <td>
          {username === data.winuser ? (
            ' WIN '
            ) : (
              ' LOOSE '
              )}
          </td>
          <td>
          {data.winuser}
          </td>
          {/* <td>
          {data.loseuser}
          </td> */}
          <td>
        <Typography variant="body1">
          {gameDate}
        </Typography>
          </td>

      </tr>
    );
  })}
  </table>
  </div>)
};

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
    const { chatSocket, gameSocket } = useContext(SocketContext);
    const { data: userInfo } = useQuery(['userInfo', username], () => fetchProfileData(username), {
        suspense: true,
        useErrorBoundary: true,
    });

    const [openError, setOpenError] = useState(false);
    const [message, setMessage] = useState('');

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
        chatSocket.emit('ft_addfriend', { receiver: e }, (response: any) => {
            console.log('ft_addfriend emit: ', response);
            if (!response.success) {
                setOpenError(true);
                setMessage(response.faillog);
                return;
            }
        });
    };

    const handleInviteGameClick = (e) => {
        gameSocket.emit('ft_invite_game', { guestName: e, roomName: roomName }, (response: any) => {
            console.log('ft_invite_game: ', response);
            if (!response.success) {
                setOpenError(true);
                setMessage(response.faillog);
                return;
            }
        });
    };

    const handleKickClick = (e) => {
        chatSocket.emit('ft_kick', { roomName, targetUser: e }, (response: any) => {
            console.log('ft_kick: ', response);
            if (!response.success) {
                setOpenError(true);
                setMessage(response.faillog);
                return;
            }
        });
    };

    const handleBanClick = (e) => {
        chatSocket.emit('ft_ban', { roomName, targetUser: e }, (response: any) => {
            console.log('ft_ban: ', response);
            if (!response.success) {
                setOpenError(true);
                setMessage(response.faillog);
                return;
            }
        });
    };

    const handleBlockClick = (e) => {
        chatSocket.emit('ft_block', { roomName, targetUser: e }, (response: any) => {
            console.log('ft_block: ', response);
            if (!response.success) {
                setOpenError(true);
                setMessage(response.faillog);
                return;
            }
        });
    };

    const handleHostClick = (e) => {
        chatSocket.emit('ft_addAdmin', { roomName, targetUser: e }, (response: any) => {
            console.log('ft_addAdmin: ', response);
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

    return (
        <Modal open={isOpen} onClose={onClose} sx={{ overflow: 'auto' }}>
            <Stack spacing={5} direction="column" alignItems="center" sx={{ ...style, overflow: 'auto' }}>
                <ModalError isOpen={openError} onClose={handleClose} title={'에러'} message={message} />
                <Box
                    component="img"
                    className={styles.sample}
                    src={userInfo.image_url ? `http://${process.env.REACT_APP_IP_ADDRESS}:4000/${userInfo.image_url}` : "/images/profile.jpg"}
                ></Box>

                <Typography variant="h3">{userInfo.username}</Typography>

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
                        <Box sx={{ width: 300, height: 300, p: 2, border: '1px solid black' }}>
                            <Typography variant="h6">전적</Typography>
                            <GameHistory username={username} history={userInfo.userGameHistory} />
                        </Box>

                        <Box sx={{ width: 300, height: 100, p: 2, border: '1px solid black' }}>
                            <Typography variant="h6">업적</Typography>
                            <Achievements achievements={userInfo.achievements} />
                        </Box>
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

export { fetchProfileData, Achievements, GameHistory, Profile };
