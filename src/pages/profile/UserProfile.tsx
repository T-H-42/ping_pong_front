import React from 'react'
import axios from 'axios';
import { getJwtCookie } from '../../api/cookies';
import { fetchProfileData, Achievements, GameHistory } from '../../components/Profile'
import { useQuery } from 'react-query';
import { Button, Stack, Box, Typography, Modal, Switch } from '@mui/material';
import styles from '../../styles/main/main.module.css'
import { useState } from 'react';


// const TwoFactorLoginToggle = ({userInfo, username}) => {
  
  
//   return (
    
//       )
// }

const UserProfile = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const username = localStorage.getItem('username');
  const { data: userInfo } = useQuery(
    ['userInfo', username],
    () => fetchProfileData(username),
    { suspense: true, useErrorBoundary: true },
  );
  const [twoFactAuth, setTwoFactAuth] = useState<boolean>(userInfo.two_factor_authentication_status)
  console.log(userInfo);
  const handleTwoFactorLogin = () => {
    const changeTwoFactor =  () => {
      setIsLoading(true);
      setTwoFactAuth(!twoFactAuth);
      axios({
        method: 'post',
        url: `http://${process.env.REACT_APP_IP_ADDRESS}:4000/user/authentication`,
        data: { two_factor_authentication_status: !userInfo.two_factor_authentication_status },
        headers: {
          Authorization: `Bearer ${getJwtCookie('jwt')}`,
        },
      }).then(() => { setIsLoading(false) })
    }
    if (!isLoading) {
      changeTwoFactor();
    }
  };

  return (
    <div>
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
    {/* <TwoFactorLoginToggle userInfo={userInfo} username={username} /> */}
      <div>
        <p>2차 인증 설정</p>
        <Switch
          checked={twoFactAuth}
          onChange={handleTwoFactorLogin}
          inputProps={{ 'aria-label': 'controlled' }}
          disabled={isLoading}
        />
      </div> 
    </div>
  )
}

export default UserProfile
