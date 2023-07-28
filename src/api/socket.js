import io from 'socket.io-client';
import getJwtCookie from './cookies';
// import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { friendsState, chatSocketState } from '../api/atoms';

export const createChatSocket = () => {
	// if (getJwtCookie('jwt')) {
	const chatSocket = io(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/chat`, {
		transports: ['websocket'],
		auth: { token: getJwtCookie('jwt') },
		autoConnect: false
	})
	// chatSocket.on('connect', () => {
	// 	console.log('chatSocket connection established successfully!');
	// })
	return chatSocket
	// }
	// console.log("chat socket not connected");
	// return null
}

export const createPingpongSocket = () => {
	// if (getJwtCookie('jwt')) {
		const pingpongSocket = io(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/ping_pong`, {
			transports: ['websocket'],
			auth: { token: getJwtCookie('jwt') },
			autoConnect: false
		})
		// pingpongSocket.on('connect', () => {
		// 	console.log('pingpongSocket connection established successfully!');
		// })
		return pingpongSocket
	// }
	// console.log("ping-pong socket not connected");
	// return null
}
