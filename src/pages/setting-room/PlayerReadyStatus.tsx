import { Box } from '@mui/material';
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
        console.log('ready 상태', onReady);

        if (!onReady) {
            gameSocket.emit('ft_game_ready', RsettingRoomName, (response: any) => {
                if (!response.success) return alert(response.payload);
            });
        }
    };
    useEffect(() => {
        const handleGameReadySetting = (response) => {
            if (!response) return alert(response);
            setGuestReady(true);
            setInitGame(true);
        };

        gameSocket.on('ft_game_ready_success', handleGameReadySetting);

        return () => {
            gameSocket.off('ft_game_ready_success', handleGameReadySetting);
        };
    }, [gameSocket]);

    return (
        <Box
            style={{
                width: '1360px',
                height: '864px',
                display: 'flex',
                backgroundColor: 'rgba(242, 242, 242, 0.5)',
            }}
        >
            <OwnerPlayer onReady={onReady} guestReady={guestReady} />
            {/* <OwnerPlayer onReady={onReady} /> */}

            <GuestPlayer onReady={onReady} onReadyToggle={onReadyToggle} />
        </Box>
    );
};

export default PlayerReadyStatus;
