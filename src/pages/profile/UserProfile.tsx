import React, { useState } from 'react'
import axios from 'axios';
import { getJwtCookie, removeJwtCookie } from '../../api/cookies';
import { fetchProfileData, Achievements, GameHistory } from '../../components/Profile'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Button, Stack, Box, Typography, Modal, Switch, TextField } from '@mui/material';
import styles from '../../styles/main/main.module.css'

const fetchTwoFactorAuthenticationStatus = async (two_factor_authentication_status) =>
  axios({
    method: 'post',
    url: `http://${process.env.REACT_APP_IP_ADDRESS}:4000/user/authentication`,
    data: { two_factor_authentication_status: !two_factor_authentication_status },
    headers: {
      Authorization: `Bearer ${getJwtCookie('jwt')}`,
    },
  }
);

const fetchNickName = async ({nickname}) => {
  const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/user/nickname`,
      { nickname },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${getJwtCookie('jwt')}`,
        }
      }
  );
  return res;
}

const UserProfile = () => {
  const queryClient = useQueryClient();
  const username = localStorage.getItem('username');
  const { data: userInfo } = useQuery(
    ['userInfo', username],
    () => fetchProfileData(username),
    { suspense: true, useErrorBoundary: true, },
  );
  const {isLoading, mutate} = useMutation(fetchTwoFactorAuthenticationStatus, {
    onSuccess: () => queryClient.invalidateQueries(['userInfo', username]),
    onError: () => {}
  });

  const {mutate: nicknameMutate} = useMutation(fetchNickName, {
    onSuccess: (res) => {
      console.log(`name = ${name}`);
      localStorage.setItem('username', name);
    },
    onError: () => {}
  });

  const [name, setName] = useState('');
      const handleInputNameChange = (event) => {
        setName(event.target.value);
      };

  return (
    <>
      <Box
          component="img"
          className={styles.sample}
          src={userInfo.image_url ? `http://${process.env.REACT_APP_IP_ADDRESS}:4000/${userInfo.image_url}` : "/images/profile.jpg"}
        ></Box>
        <Typography variant="h3">{userInfo.username}</Typography>
        <Typography variant='body1'>등급 점수 : {userInfo.ladder_lv}</Typography>

      <Box
        sx={{ width: 300, height: 300, p: 2, border: '1px solid black' }}
      >
        <Typography variant="h6">전적</Typography>
        <GameHistory
        username={username}
          history={userInfo.userGameHistory}
        />
      </Box>

      <Box
        sx={{ width: 300, height: 100, p: 2, border: '1px solid black' }}
      >
        <Typography variant="h6">업적</Typography>
        <Achievements achievements={userInfo.achievements} />
      </Box>

      <Box>
        <Typography>이름 변경</Typography>
        <TextField label="변경할 이름을 입력해주세요." type='text' value={name} onChange={handleInputNameChange}></TextField>
      </Box>

      <Box>
        <p>2차 인증 설정</p>
        <Switch
          checked={userInfo.two_factor_authentication_status}
          onChange={() => mutate(userInfo.two_factor_authentication_status)}
          inputProps={{ 'aria-label': 'controlled' }}
          disabled={isLoading}
          />
      </Box>

      <Button variant='contained' onClick={() => nicknameMutate({nickname: name})}>변경</Button>
      <Button variant='contained'>취소</Button>
    </>
  )
}

export default UserProfile
