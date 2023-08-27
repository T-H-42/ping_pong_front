import React, { useState, useRef } from 'react'
import axios from 'axios';
import { getJwtCookie } from '../../api/cookies';
import { QueryClient, useMutation, useQuery, useQueryClient } from 'react-query';
import { fetchProfileData, Achievements, GameHistory } from '../../components/Profile'
import { Button, Stack, Box, Typography, Modal, Switch, TextField, Input } from '@mui/material';
import styles from '../../styles/main/main.module.css'
import { query } from 'express';

const fetchChangeNickName = (nickname) => 
  axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/user/nickname`,
    { nickname },
    {
      withCredentials: true,
      headers: {
      Authorization: `Bearer ${getJwtCookie('jwt')}`,
      }
    },
  );

const fetchChangeAuthentication = (two_factor_authentication_status) =>
  axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/user/authentication`,
    { two_factor_authentication_status },
    {
    headers: {
      Authorization: `Bearer ${getJwtCookie('jwt')}`,
      },
    }
  )

const fetchChangeImage = (formData) => 
  axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/user/profile/upload`,
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${getJwtCookie('jwt')}`,
    },
  }
  );

const fetchUserInfo = async ({nickname, two_factor_authentication_status, image}) =>
{
  if (nickname !== localStorage.getItem('username'))
  {
    await fetchChangeNickName(nickname);
  }
  
  await fetchChangeAuthentication(two_factor_authentication_status);

  if (image)
  {
    const formData = new FormData();
    formData.append('image', image);
    await fetchChangeImage(formData);
  }
}

const UserProfile = () => {
  const username = localStorage.getItem('username');
  const { data: userInfo, remove } = useQuery(
    ['userInfo', username],
    () => fetchProfileData(username),
    { suspense: true, useErrorBoundary: true, },
    );
  const [newUserInfo, setNewUserInfo] = useState(
    {
      nickname: userInfo.username,
      two_factor_authentication_status: userInfo.two_factor_authentication_status,
      image: ""
    }
  );

  const {mutate: mutateUserName} = useMutation(fetchChangeNickName, {
    onSuccess: () => {
        remove();
        localStorage.setItem('username', newUserInfo.nickname);
      },
      onError: () => {
        setNewUserInfo({...newUserInfo, nickname: userInfo.username});
        alert('닉네임을 변경할 수 없습니다');
      }
    }
  );
    
  const {mutate: mutateImage} = useMutation(fetchChangeImage, {
      onSettled: () => setNewUserInfo({...newUserInfo, image: ''}),
      onSuccess: () => remove(),
      onError: () => alert('이미지를 변경할 수 없습니다'),
    }
  )
  
  const {mutate: mutateTwoFactorAuthenticationStatus} = useMutation(fetchChangeAuthentication, {
      onError: () => {
        setNewUserInfo({...newUserInfo, two_factor_authentication_status: userInfo.two_factor_authentication_status})
        alert('2차 인증을 변경할 수 없습니다');
      }
    }
  )
 
  const handleInputNameChange = (event) => {
    setNewUserInfo({...newUserInfo, nickname: event.target.value});
  };
  const handleTwoFactorAuthenticationStatusChange = (event) => {
    setNewUserInfo({...newUserInfo, two_factor_authentication_status: event.target.checked});
  };
  const handleImageChange = (event) => {
    setNewUserInfo({...newUserInfo, image: event.target.files[0]});
  };

  const handleClick = () => {
    if (username !== newUserInfo.nickname)
      mutateUserName(newUserInfo.nickname);
    if (newUserInfo.image)
    {
      const formData = new FormData();
      formData.append('image', newUserInfo.image);
      mutateImage(formData);
    }
    if (userInfo.two_factor_authentication_status !== newUserInfo.two_factor_authentication_status)
      mutateTwoFactorAuthenticationStatus(newUserInfo.two_factor_authentication_status);
  }

  return (
    <>
      <Box
          component="img"
          className={styles.sample}
          src={userInfo.image_url ? `http://${process.env.REACT_APP_IP_ADDRESS}:4000/${userInfo.image_url}` : "/images/profile.jpg"}
        ></Box>
        <Typography variant="h3">{userInfo.username}</Typography>
        {/* <Typography variant='body1'>등급 점수 : {userInfo.ladder_lv}</Typography>

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
      </Box> */}

      <Box>
        <Button component="label">
          이미지 변경
          <input hidden accept='image/*' type='file' onChange={handleImageChange}></input>
        </Button>
      </Box>

      <Box>
        <Typography>이름 변경</Typography>
        <TextField label="변경할 이름을 입력해주세요." type='text' value={newUserInfo.nickname} onChange={handleInputNameChange}></TextField>
      </Box>

      <Box>
        <p>2차 인증 설정</p>
        <Switch
          checked={newUserInfo.two_factor_authentication_status}
          onChange={handleTwoFactorAuthenticationStatusChange}
          inputProps={{ 'aria-label': 'controlled' }}
          // disabled={isLoading}
          />
      </Box>

      <Button variant='contained' onClick={handleClick}>변경</Button>
      <Button variant='contained'>취소</Button>
    </>
  )
}

export default UserProfile;
