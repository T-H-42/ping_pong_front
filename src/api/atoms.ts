import { atom } from 'recoil';

interface IUserName {
    default: string;
}

export interface IFriend {
    username: string;
}

export interface IFriendsState {
    friends: IFriend[];
}

interface IRoomNameState {
    default: string;
}

export const usernameState = atom<IUserName>({
    key: 'usernameState',
    default: { default: '' },
});

export const friendsState = atom<IFriendsState>({
    key: 'FriendsState',
    default: { friends: [] },
});

export const roomNameState = atom<string>({
    key: 'roomNameState',
    default: '',
});
