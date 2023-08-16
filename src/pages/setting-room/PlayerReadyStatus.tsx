import { Backdrop, Box, Button, Container, Typography, rgbToHex } from '@mui/material';
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
    const [guestReady, setGuestReady] = useState(false);

    const onReadyToggle = () => {
        setOnReady((prev) => !prev);
        console.log('온레디 토글 :', onReady);

        if (!onReady) {
            gameSocket.emit('ft_game_ready', RsettingRoomName, (response: any) => {
                if (!response.success) return alert(response.payload);
            });
        }
    };
    useEffect(() => {
        const handleGameReadySetting = (response) => {
            if (!response) return alert(response);
            // alert(`${response.success} 게임 레디 완료.`);
            setGuestReady(true);
            setInitGame(true);
        };

        gameSocket.on('ft_game_ready_success', handleGameReadySetting);

        return () => {
            gameSocket.off('ft_game_ready_success', handleGameReadySetting);
        };
    }, [gameSocket]);

    return (
        <Container
            style={{ width: '90%', height: '85%', display: 'flex', backgroundColor: 'rgba(242, 242, 242, 0.5)' }}
        >
            <OwnerPlayer onReady={onReady} guestReady={guestReady} />
            {/* <OwnerPlayer onReady={onReady} /> */}

            <GuestPlayer onReady={onReady} onReadyToggle={onReadyToggle} />
        </Container>
    );
};

export default PlayerReadyStatus;
