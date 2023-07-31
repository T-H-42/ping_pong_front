import { Cookies } from 'react-cookie';

const Cookie = new Cookies();

export const jwtCookie = Cookie.get('jwt'); // import { jwtCookie } from '../api/cookies';

export const getJwtCookie = (cookieName: any) => {
    return Cookie.get(cookieName);
};

export const removeJwtCookie = (cookieName: string) => {
    Cookie.remove(cookieName);
};
