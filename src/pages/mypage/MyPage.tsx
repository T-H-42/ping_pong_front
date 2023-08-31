import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getJwtCookie } from '../../api/cookies';
import { useMutation, useQuery } from 'react-query';
import fetchProfileData from '../../components/fetchProfileData'
import { ProfileHeader, ProfileGameHistory, ProfileAchievements } from '../../components/ProfileComponents'
import { Button, Stack, Box, Typography, Switch, TextField } from '@mui/material';
import { SocketContext } from '../../api/SocketContext';
import { ErrorBoundary } from 'react-error-boundary';

// const fetchChangeNickName = (nickname) =>
//   axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/user/nickname`,
//     { nickname },
//     {
//       withCredentials: true,
//       headers: {
//         Authorization: `Bearer ${getJwtCookie('jwt')}`,
//       }
//     },
//   ).then((res) => {
//     console.log('/user/nickname 요청 성공: ', res);
//     chatSocket.emit('ft_changenickname', (res: any) => {
//       console.log('ft_changenickname emit: ', res);
//     });
//   })
//     .catch((err) => {
//       console.log(`/user/nickname 요청 실패: ${err}`);
//     });

const fetchChangeAuthentication = (two_factor_authentication_status) =>
  axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/user/authentication`,
    { two_factor_authentication_status },
    {
      headers: {
        Authorization: `Bearer ${getJwtCookie('jwt')}`,
      },
    }
  ).then((res) => {
    console.log('/user/authentication 요청 성공: ', res);
  })
    .catch((err) => {
      console.log(`/user/authentication 요청 실패: ${err}`);
    });

const fetchChangeImage = (formData) =>
  axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/user/profile/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${getJwtCookie('jwt')}`,
      },
    }
  )
    .then((res) => {
      console.log('/user/profile/upload 요청 성공: ', res);

    })
    .catch((err) => {
      console.log(`/user/profile/upload 요청 실패: ${err}`);
    });


const MyPage = () => {
  const navigate = useNavigate();
  const { pingpongSocket, chatSocket, gameSocket } = useContext(SocketContext);

  useEffect(()=>{
    chatSocket.off('ft_getfriendlist');
  })

  const fetchChangeNickName = (nickname) =>
  axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/user/nickname`,
    { nickname },
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${getJwtCookie('jwt')}`,
      }
    },
  )
  // .then((res) => {
  //   console.log('/user/nickname 요청 성공: ', res);
  //   chatSocket.emit('ft_changenickname', (res: any) => {
  //     console.log('ft_changenickname emit: ', res);
  //   });
  // })
    // .catch((err) => {
    //   console.log(`/user/nickname 요청 실패: ${err}`);
    //   console.log(err);
    //   if(err?.response?.status === 400){
    //     alert("닉네임 수정에 실패하였습니다.")
    //     navigate('/')
    //   }else if(err?.response?.status === 500)
    //     alert("잘못된 접근입니다.")
    //     navigate('/')
    // }
    // );

  const [username, setUsername] = useState(localStorage.getItem('username'));

  const { data: userInfo, remove } = useQuery(
    ['userInfo', username],
    () => fetchProfileData(username),

    { suspense: true, useErrorBoundary: true, 
      onError: (err : any) => {
      // 에러가 발생한 경우에 대한 처리
      if (err?.response?.status === 401) {
        // 인증 오류(401)인 경우 리다이렉션을 수행합니다.
        navigate('/login');
      } else {
        // 기타 다른 예외적인 상황에 대한 처리
        console.error('프로필 데이터 가져오기 오류:', err);
        // 추가적인 에러 핸들링 로직을 구현합니다.
      }},}
  );
  
  const [newUserInfo, setNewUserInfo] = useState(
    {
      nickname: userInfo?.username,
      two_factor_authentication_status: userInfo?.two_factor_authentication_status,
      image: ""
    }
  );
  
  const { mutate: mutateUserName } = useMutation(fetchChangeNickName, {
    onSuccess: (res : any) => {
      setUsername(newUserInfo.nickname);
      remove();
      localStorage.setItem('username', newUserInfo.nickname);
      console.log('/user/nickname 요청 성공: ', res);
    chatSocket.emit('ft_changenickname', (res: any) => {
      console.log('ft_changenickname emit: ', res);
    });
    },
    onError: (err : any) => {
      setNewUserInfo({ ...newUserInfo, nickname: userInfo.username });
      if(err?.response?.status === 400){
        alert(err.response.data.message);
      }else if(err?.response?.status === 500){
        alert("잘못된 접근입니다.")
        navigate('/')
      }
      else if(err?.response?.status === 401)
      {
        navigate('/')
      }
      // alert('닉네임을 변경할 수 없습니다');
    }
  }
  );

  const { mutate: mutateImage } = useMutation(fetchChangeImage, {
    onSettled: () => setNewUserInfo({ ...newUserInfo, image: '' }),
    onSuccess: () => remove(),
    onError: () => alert('이미지를 변경할 수 없습니다'),
  }
  )

  const { mutate: mutateTwoFactorAuthenticationStatus } = useMutation(fetchChangeAuthentication, {
    onError: () => {
      setNewUserInfo({ ...newUserInfo, two_factor_authentication_status: userInfo.two_factor_authentication_status })
      alert('2차 인증을 변경할 수 없습니다');
    }
  }
  )

  const handleInputNameChange = (event) => {
    setNewUserInfo({ ...newUserInfo, nickname: event.target.value });
  };

  const handleTwoFactorAuthenticationStatusChange = (event) => {
    setNewUserInfo({ ...newUserInfo, two_factor_authentication_status: event.target.checked });
  };

  const handleImageChange = (event) => {
    setNewUserInfo({ ...newUserInfo, image: event.target.files[0] });
  };

  const handleChangeClick = () => {
    if (username !== newUserInfo.nickname)
      mutateUserName(newUserInfo.nickname);

    if (newUserInfo.image) {
      const formData = new FormData();
      formData.append('image', newUserInfo.image);
      mutateImage(formData);
    }
    if (userInfo.two_factor_authentication_status !== newUserInfo.two_factor_authentication_status)
      mutateTwoFactorAuthenticationStatus(newUserInfo.two_factor_authentication_status);

    navigate('/main');
  }

  const handleCancelClick = () => {
    pingpongSocket.disconnect();
    chatSocket.disconnect();
    gameSocket.disconnect();

    pingpongSocket.auth = { token: `${getJwtCookie('jwt')}` };
    pingpongSocket.connect();
    chatSocket.auth = { token: `${getJwtCookie('jwt')}` };
    chatSocket.connect();
    gameSocket.auth = { token: `${getJwtCookie('jwt')}` };
    gameSocket.connect();

    navigate('/main');
  }

  return (
    <>
      <ProfileHeader imageUrl={userInfo.image_url} userName={username} ladderLv={userInfo.ladder_lv} />
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
      <Button variant='contained' onClick={handleCancelClick}>닫기</Button>
    </>
  )
}




// 예시 에러 바운더리


const MyPageWithErrorBoundary = () => {
  return (
    <ErrorBoundary fallback={<div>MyPage 컴포넌트에서 오류 발생</div>}>
      <MyPage />
    </ErrorBoundary>
  );
};

export {MyPageWithErrorBoundary, MyPage} ;
