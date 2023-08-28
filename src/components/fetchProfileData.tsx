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
    ).catch((res) => {
      console.log(res);
      return res;
    })
  return res.data;
};

export default fetchProfileData;