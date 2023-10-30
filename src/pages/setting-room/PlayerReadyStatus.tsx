import { Box } from '@mui/material';
import { SocketContext } from '../../api/SocketContext';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { settingRoomNameState } from '../../api/atoms';
import OwnerPlayer from './OwnerPlayer';
import GuestPlayer from './GuestPlayer';
import  { removeJwtCookie}  from '../../api/cookies';

const PlayerReadyStatus = ({ onReady, setOnReady, settingInformation }) => {
    const { gameSocket, pingpongSocket, chatSocket} = useContext(SocketContext);
    const RsettingRoomName = useRecoilValue(settingRoomNameState);
    const [initGame, setInitGame] = useState(false);
    const [guestReady, setGuestReady] = useState(false);

    const onReadyToggle = useCallback(() => {
        setOnReady((prev) => !prev);
        setGuestReady((prev) => !prev);

        // if (!onReady) {
        gameSocket.emit('ft_game_ready', RsettingRoomName, guestReady, (response: any) => {
            if (response.checktoken===false) {
                pingpongSocket.disconnect();
                chatSocket.disconnect();
                gameSocket.disconnect();
                removeJwtCookie('jwt');
                localStorage.clear();
                // setOpenTokenError(true);
                return ;
            }
            if (!response.success) {
                alert(response.payload);
                return;
            }
        });
        // }
        // else{
        //     gameSocket.emit('ft_game_ready', RsettingRoomName, guestReady, (response: any) => {
        //         if (!response.success) return alert(response.payload);
        //       });
        // }
    }, [guestReady, onReady]);

    useEffect(() => {
        const getGuestReadyStatus = (response: any) => {
            if (!response) {
                return alert(`${response} 에러가 발생했습니다.`);
            }
            setGuestReady(!response.roomName[1]);
        };
        gameSocket.on('ft_game_ready_success', getGuestReadyStatus);

        return () => {
            gameSocket.off('ft_game_ready_success', getGuestReadyStatus);
        };
    }, [gameSocket]);

    useEffect(() => {
        const handleGameReadySetting = (response) => {
            if (!response) return alert(response);
        };

        gameSocket.on('ft_game_ready_success', handleGameReadySetting);

        return () => {
            gameSocket.off('ft_game_ready_success', handleGameReadySetting);
        };
    }, [gameSocket]);

    return (
        <Box
            style={{
                width: '70vw',
                height: '95vh',
                display: 'flex',
                backgroundColor: 'rgba(242, 242, 242, 0.5)',
            }}
        >
            <OwnerPlayer onReady={onReady} onReadyToggle={onReadyToggle} guestReady={guestReady} />
            <GuestPlayer onReady={onReady} onReadyToggle={onReadyToggle} />
        </Box>
    );
};

export default PlayerReadyStatus;
