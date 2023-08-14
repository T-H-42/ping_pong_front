import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Button, Stack, Box, Typography, Modal } from '@mui/material';
import { useQuery } from 'react-query';
import { getJwtCookie } from '../api/cookies';
import { SocketContext } from '../api/SocketContext';

const fetchProfileData = async (userName) => {
  const res = (
    await axios.get(
      `http://${process.env.REACT_APP_IP_ADDRESS}:4000/user/profile`,
      {
        params: {
          username: `${userName}`,
        },
        headers: {
          Authorization: `Bearer ${getJwtCookie('jwt')}`,
        },
      },
    )
  );
  return res.data;
};

const Achievements = ({ achievements }) => {
  return achievements.map((achievement) => (
    <Typography key={achievement}>{achievement}</Typography>
  ));
};

const GameHistory = ({ userName, history }) => {
  return history.map((data) => {
    const date = new Date(data.time);
    const gameDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    return (
      <>
        <Typography key={gameDate} variant="body1">
          {gameDate}
          {userName === data.winner ? (
            ' WIN '
          ) : (
            ' LOOSE '
          )}
          {data.winner}
        </Typography>
      </>
    );
  });
};

const Profile = ({ username, right, isOpen, onClose, roomName, chats, setChats }) => {
  const { chatSocket } = useContext(SocketContext);
  const { data: userInfo } = useQuery(
    ['userInfo', username],
    () => fetchProfileData(username),
    { suspense: true, useErrorBoundary: true },
  );

  const handleMuteClick = (e) => {
    chatSocket.emit('ft_mute', { roomName, targetUser: e }, (response: any) => {
      console.log('ft_mute: ', response);

      setInterval(() => {
        console.log('특정 이벤트 발생');
        chatSocket.emit('ft_mute_check', { roomName, targetUser: e }, (response: any) => {
          console.log('ft_mute_check: ', response);
        });
      }, 2000);
    });
  };

  const handleKickClick = (e) => {

  };

  const handleBanClick = (e) => {
    chatSocket.emit('ft_ban', { roomName, targetUser: e }, (response: any) => {
      console.log('ft_ban: ', response);
    });
  };

  const handleBlockClick = (e) => {
    chatSocket.emit('ft_block', { roomName, targetUser: e }, (response: any) => {
      console.log('ft_block: ', response);
    });
  };

  const handleHostClick = (e) => {
    chatSocket.emit('ft_addAdmin', { roomName, targetUser: e }, (response: any) => {
      console.log('ft_addAdmin: ', response);
      if (!response.success) {
        return;
      }
      setChats([...chats, response]);
    });
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      BackdropProps={{
        sx: { backgroundColor: 'rgba(255, 255, 255, 1)' },
      }}>
      <Stack spacing={5} direction="column" alignItems="center">
        <Box
          component="img"
          sx={{
            height: 233,
            width: 350,
            maxHeight: { xs: 233, md: 167 },
            maxWidth: { xs: 350, md: 250 },
          }}
          src={userInfo.image_url}
        ></Box>

        <Typography variant="h3">{userInfo.username}</Typography>

        <Stack direction="column" spacing={6}>
          <Stack direction="row" spacing={5}>
            <Button variant="contained">친구 추가</Button>
            <Button variant="contained">메세지</Button>
            <Button variant="contained">게임 초대</Button>
          </Stack>

          <Stack spacing={2}>
            <Box
              sx={{ width: 300, height: 300, p: 2, border: '1px solid black' }}
            >
              <Typography variant="h6">전적</Typography>
              <GameHistory
                userName={userInfo.username}
                history={userInfo.userGameHistory}
              />
            </Box>

            <Box
              sx={{ width: 300, height: 100, p: 2, border: '1px solid black' }}
            >
              <Typography variant="h6">업적</Typography>
              <Achievements achievements={userInfo.achievements} />
            </Box>
          </Stack>

          <Stack direction="column" spacing={1} alignItems="flex-start">
            {(right === 1 || right === 2) && (
              <>
                <Button variant="text" onClick={() => handleMuteClick(username)}>음소거</Button>
                <Button variant="text" onClick={() => handleKickClick(username)}>강제 퇴장</Button>
                <Button variant="text" onClick={() => handleBanClick(username)}>채팅 접근 금지</Button>
              </>
            )}
            {right === 2 && <Button variant="text" onClick={() => handleHostClick(username)}>호스트로 지정</Button>}

            <Button variant="text" color="error" onClick={() => handleBlockClick(username)}>
              사용자 차단
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default Profile;

