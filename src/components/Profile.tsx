import React from 'react';
import axios from 'axios';
import { Button, Stack, Box, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import { getJwtCookie } from '../api/cookies';

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
    const gameDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
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

const Profile = (props) => {
  const { data: userInfo } = useQuery(
    ['userInfo', props.userName],
    () => fetchProfileData(props.username),
    { suspense: true, useErrorBoundary: true },
  );

  return (
    <>
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
            {(props.right === 1 || props.right === 2) && (
              <>
                <Button variant="text">음소거</Button>
                <Button variant="text">강제 퇴장</Button>
                <Button variant="text">채팅 접근 금지</Button>
              </>
            )}
            {props.right === 2 && <Button variant="text">호스트로 지정</Button>}

            <Button variant="text" color="error">
              사용자 차단
            </Button>
          </Stack>

        </Stack>

      </Stack>
    </>
  );
};

export default Profile;
