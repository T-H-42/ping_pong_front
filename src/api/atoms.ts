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

export const roomFriendsState = atom<[]>({
    key: 'RoomFriendsState',
    default: [],
});

export const roomNameState = atom<string>({
    key: 'roomNameState',
    default: '',
});

export const dmNameState = atom<string>({
    key: 'dmNameState',
});

export const settingRoomNameState = atom<string>({
    key: 'settingRoomNameState',
    default: '',
});

export const isOwnerState = atom<boolean>({
    key: 'isOwnerState',
    default: false,
});

export const settingState = atom<{
    guestName: string;
    ownerName: string; // Add properties like ownerName
    // Add other properties as needed
  }>({
    key: 'settingState',
    default: {
      ownerName: '', 
      guestName : '',
      // Provide default values for properties
      // Provide default values for other properties as needed
    },
    
  });