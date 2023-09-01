import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getJwtCookie } from '../../api/cookies';
import { useMutation, useQuery } from 'react-query';
import fetchProfileData from '../../components/fetchProfileData'
import { Button, Stack, Box, Typography, Switch, TextField } from '@mui/material';

import { ProfileHeader, ProfileGameHistory, ProfileAchievements } from '../../components/ProfileComponents'
import ModalRoomInvitationReceiver from '../../components/ModalRoomInvitationReceiver'
import { SocketContext } from '../../api/SocketContext';

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
  const [roomName, setRoomname] = useState('');
  const [sender, setSender] = useState('');
  const [openInvitation, setOpenInvitation] = useState(false);

  useEffect(() => {
    chatSocket.off('ft_getfriendlist');
    chatSocket.on('ft_invitechat', (res: any) => {
      console.log('ft_invitechat on: ', res);
      setRoomname(res.index);
      setSender(res.sender);
      setOpenInvitation(true);
  });
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
    {
      suspense: true,
      onError: (err: any) => {
        // 에러가 발생한 경우에 대한 처리
        if (err?.response?.status === 401) {
          // 인증 오류(401)인 경우 리다이렉션을 수행합니다.
          navigate('/login');
        } else {
          // 기타 다른 예외적인 상황에 대한 처리
          console.error('프로필 데이터 가져오기 오류:', err);
          // 추가적인 에러 핸들링 로직을 구현합니다.
        }
      },
    }
  );

  const [newUserInfo, setNewUserInfo] = useState(
    {
      nickname: userInfo?.username,
      two_factor_authentication_status: userInfo?.two_factor_authentication_status,
      image: ""
    }
  );

  const { mutateAsync: mutateUserName } = useMutation(fetchChangeNickName, {
    onSuccess: (res: any) => {
      setUsername(newUserInfo.nickname);
      remove();
      localStorage.setItem('username', newUserInfo.nickname);
      console.log('/user/nickname 요청 성공: ', res);
    },
    onError: (err: any) => {
      console.log('???? ', err);

      setNewUserInfo({ ...newUserInfo, nickname: userInfo.username });
      if (err?.response?.data?.statusCode === 400) {
        alert(err.response.data.message);
        // navigate('/')
      } else if (err?.response?.data?.statusCode === 500) {
        alert("잘못된 접근입니다.")
        navigate('/')
      }
      else if (err?.response?.data?.statusCode === 401) {
        navigate('/')
      }
      // alert('닉네임을 변경할 수 없습니다');
    }
  }
  );

  const { mutateAsync: mutateImage } = useMutation(fetchChangeImage, {
    onSettled: () => setNewUserInfo({ ...newUserInfo, image: '' }),
    onSuccess: () => remove(),
    onError: () => alert('이미지를 변경할 수 없습니다'),
  }
  )

  const { mutateAsync: mutateTwoFactorAuthenticationStatus } = useMutation(fetchChangeAuthentication, {
    onError: () => {
      setNewUserInfo({ ...newUserInfo, two_factor_authentication_status: userInfo.two_factor_authentication_status })
      alert('2차 인증을 변경할 수 없습니다');
    }
  }
  )

  const handleInputNameChange = (event) => {
    const input = event.target.value;
    const sanitizedInput = input.replace(/[^\w\s]/gi, '');
    setNewUserInfo({ ...newUserInfo, nickname: sanitizedInput });
  };

  const handleTwoFactorAuthenticationStatusChange = (event) => {
    setNewUserInfo({ ...newUserInfo, two_factor_authentication_status: event.target.checked });
  };

  const handleImageChange = (event) => {
    setNewUserInfo({ ...newUserInfo, image: event.target.files[0] });
  };

  const handleChangeClick = async () => {
    if (username !== newUserInfo.nickname)
      await mutateUserName(newUserInfo.nickname).catch((err) => console.log(err));

    if (newUserInfo.image) {
      const formData = new FormData();
      formData.append('image', newUserInfo.image);
      await mutateImage(formData).catch((err) => console.log(err));;
    }
    if (userInfo.two_factor_authentication_status !== newUserInfo.two_factor_authentication_status)
      await mutateTwoFactorAuthenticationStatus(newUserInfo.two_factor_authentication_status).catch((err) => console.log(err));;


    chatSocket.emit('ft_changenickname', (res: any) => {
      console.log('ft_changenickname emit: ', res);
    });
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

  const handleClose = () => {
    setOpenInvitation(false);
  };

  return (
    <>
      <ModalRoomInvitationReceiver isOpen={openInvitation} onClose={handleClose} title={'채팅방 초대'} roomName={roomName} sender={sender} />
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



export default MyPage;
