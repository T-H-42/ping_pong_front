import { Cookies } from 'react-cookie';

const Cookie = new Cookies();

export const jwtCookie = Cookie.get('jwt'); // import { jwtCookie } from '../api/cookies';

const getJwtCookie = (cookieName) => {
  return Cookie.get(cookieName);
}

export default getJwtCookie // import getJwtCookie from '../api/cookies';

export const removeJwtCookie = (cookieName) => {
  Cookie.remove(cookieName);
}