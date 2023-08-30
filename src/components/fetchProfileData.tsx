import axios from 'axios';
import { getJwtCookie } from '../api/cookies';

const fetchProfileData = async (userName) => {
    const res = await axios.get(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/user/profile`, {
        params: {
            username: `${userName}`,
        },
        headers: {
            Authorization: `Bearer ${getJwtCookie('jwt')}`,
        },
      },
    ).catch((error) => {
      console.error('프로필 데이터 가져오기 오류:', error);
    throw error; // React Query에서 잡힐 수 있도록 에러를 다시 던집니다.
    })
  return res.data;
};

export default fetchProfileData;
