import { useRecoilValue } from 'recoil';
import { SocketContext } from '../../api/SocketContext';
import React, { useContext, useEffect, useState } from 'react';
import { isOwnerState, settingRoomNameState } from '../../api/atoms';

const PaddleManager = ({ open }) => {
    const [keyPressed, setKeyPressed] = useState<number>(0);
    const { gameSocket } = useContext(SocketContext);
    const RsettingRoomName = useRecoilValue(settingRoomNameState);
    const RisOwner = useRecoilValue(isOwnerState);

    useEffect(() => {
        const movePaddle = (newKeyPressed) => {
            // if(!open){
            gameSocket.emit('ft_paddle_move', {
                roomName: RsettingRoomName,
                isOwner: RisOwner,
                paddleStatus: newKeyPressed,
            });
            // }
        };
        if (!open) {
            const handleKeyMove = async (event: KeyboardEvent) => {
                if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                    const newKeyPressed = event.key === 'ArrowUp' ? 1 : 2;
                    if (keyPressed !== newKeyPressed) {
                        setKeyPressed(newKeyPressed);
                        movePaddle(newKeyPressed);
                    }
                }
            };
            const handleKeyStopper = (event: KeyboardEvent) => {
                if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                    setKeyPressed(0);
                    movePaddle(0);
                }
            };
            window.addEventListener('keydown', handleKeyMove); //키가 눌릴 때 keydown이 발생하고 그거에 따라 윗 방향인지 아래 방향인지 감지
            window.addEventListener('keyup', handleKeyStopper); // 키가 떼지는 시점에 키 움직임을 0로 초기화 하는 함수

            return () => {
                window.removeEventListener('keydown', handleKeyMove);
                window.removeEventListener('keyup', handleKeyStopper);
            };
        }
    }, [open, gameSocket, keyPressed, RsettingRoomName, RisOwner]);
    return null; //얘 없애도 될듯?
};

export default PaddleManager;
