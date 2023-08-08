import { Backdrop, Box, Button, Container, Typography } from '@mui/material';
import { SocketContext } from '../../api/SocketContext';
import React, { useContext, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { settingRoomNameState } from '../../api/atoms';
import OwnerPlayer from './OwnerPlayer';
import GuestPlayer from './GuestPlayer';

const PlayerReadyStatus = ({ onReady, setOnReady, settingInformation }) => {
    const { gameSocket } = useContext(SocketContext);
    const RsettingRoomName = useRecoilValue(settingRoomNameState);
    const [initGame, setInitGame] = useState(false);
    const [backdrop, setBackdrop] = useState(false);
    const handleBackdropClose = () => {
        setBackdrop(false);
    };
    const handleBackdropOpen = () => {
        setBackdrop(true);
    };
    const onReadyToggle = () => {
        setOnReady((prev) => !prev);
        setBackdrop((prev) => !prev);
        console.log(`backdrop : ${backdrop}`);

        if (!onReady) {
            gameSocket.emit('ft_game_ready', RsettingRoomName, (response: any) => {
                if (!response.success) return alert(response.payload);
            });
        }
    };
    useEffect(() => {
        const handleGameReadySetting = (response) => {
            if (!response) return alert(response);
            alert(`${response.success} 게임 레디 완료.`);
            setInitGame(true);
        };

        gameSocket.on('ft_game_ready_success', handleGameReadySetting);

        return () => {
            gameSocket.off('ft_game_ready_success', handleGameReadySetting);
        };
    }, [gameSocket]);

    return (
        <>
            <OwnerPlayer onReady={onReady} />

            <GuestPlayer
                onReady={onReady}
                handleBackdropClose={handleBackdropClose}
                onReadyToggle={onReadyToggle}
                backdrop={backdrop}
            />
        </>
    );
};

export default PlayerReadyStatus;
