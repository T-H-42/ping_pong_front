import { atom } from 'recoil';

interface IUserName {
    default: string;
}

export interface IFriend {
    username: object;
}

export interface IFriendsState {
    f_id: number;
    id: number;
    username: string;
    socketid: string;
    email: string;
}

interface IRoomNameState {
    default: string;
}

export const usernameState = atom<IUserName>({
    key: 'usernameState',
    default: { default: '' },
});

export const friendsState = atom<IFriendsState[]>({
    key: 'FriendsState',
    default: [],
});

export const roomNameState = atom<string>({
    key: 'roomNameState',
    default: '',
});

export const dmNameState = atom<string>({
    key: 'dmNameState'
});

export const settingRoomNameState = atom<string>({
    key: 'settingRoomNameState',
    default: '',
});
