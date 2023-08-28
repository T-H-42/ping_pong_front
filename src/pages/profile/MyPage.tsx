import React, { useState } from 'react'
import axios from 'axios';
import { getJwtCookie } from '../../api/cookies';
import { useMutation, useQuery } from 'react-query';
import fetchProfileData from '../../components/fetchProfileData'
import { ProfileHeader, ProfileGameHistory, ProfileAchievements } from '../../components/ProfileComponents'
import { Button, Stack, Box, Typography, Switch, TextField} from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
  );

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

const MyPage = () => {
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
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

  const handleChangeClick = () => {
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

  const hadleCancelClick = () => navigate('/main')

  return (
    <>
      <ProfileHeader imageUrl={ userInfo.image_url} userName={ username } ladderLv={userInfo.ladder_lv }/>
      <ProfileGameHistory
      username={username}
        history={userInfo.userGameHistory}
      />
      <ProfileAchievements achievements={userInfo.achievements} />

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
        <Typography>2차 인증 설정</Typography>
        <Switch
          checked={newUserInfo.two_factor_authentication_status}
          onChange={handleTwoFactorAuthenticationStatusChange}
          inputProps={{ 'aria-label': 'controlled' }}
          />
      </Box>

      <Button variant='contained' onClick={handleChangeClick}>변경</Button>
      <Button variant='contained' onClick={hadleCancelClick}>취소</Button>
    </>
  )
}

export default MyPage;
