import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getJwtCookie } from '../api/cookies';

const fetchProfileData = async (userName) => 
  await axios.get(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/user/profile`, {
    params: {
      username: `${userName}`,
    },
    headers: {
      Authorization: `Bearer ${getJwtCookie('jwt')}`,
    },
  })

export default fetchProfileData;
