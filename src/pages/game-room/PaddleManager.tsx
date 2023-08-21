import { useRecoilValue } from 'recoil';
import { SocketContext } from '../../api/SocketContext';
import React, { useContext, useEffect, useState } from 'react';
import { isOwnerState, settingRoomNameState } from '../../api/atoms';

const PaddleManager = () => {
    console.log('paddle update');
    const [keyPressed, setKeyPressed] = useState<number>(0);
    const { gameSocket } = useContext(SocketContext);
    const RsettingRoomName = useRecoilValue(settingRoomNameState);
    const RisOwner = useRecoilValue(isOwnerState);

    const movePaddle = (newKeyPressed) => {
        gameSocket.emit('ft_paddle_move', {
            roomName: RsettingRoomName,
            isOwner: RisOwner,
            paddleStatus: newKeyPressed,
        });
    };

    useEffect(() => {
        const handleKeyDown = async (event: KeyboardEvent) => {
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                const newKeyPressed = event.key === 'ArrowUp' ? 1 : 2;
                if (keyPressed !== newKeyPressed) {
                    setKeyPressed(newKeyPressed);
                    movePaddle(newKeyPressed);
                }
                //     if (keyPressed !== 1) {
                //         setKeyPressed(1);
                //         movePaddle(1);
                //     }
                // } else if (event.key === 'ArrowDown') {
                //     if (keyPressed !== 2) {
                //         setKeyPressed(2);
                //         movePaddle(2);
                //     }
                // console.log('ArrowDown key pressed');
            }
        };
        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                setKeyPressed(0);
                movePaddle(0);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    return <></>; //얘 없애도 될듯?
};

export default PaddleManager;
