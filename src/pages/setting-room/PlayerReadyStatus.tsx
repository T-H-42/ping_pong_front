import { Box } from '@mui/material';
import { SocketContext } from '../../api/SocketContext';
import React, { useContext, useEffect, useState , useCallback} from 'react';
import { useRecoilValue } from 'recoil';
import { settingRoomNameState } from '../../api/atoms';
import OwnerPlayer from './OwnerPlayer';
import GuestPlayer from './GuestPlayer';

const PlayerReadyStatus = ({ onReady, setOnReady, settingInformation }) => {
    const { gameSocket } = useContext(SocketContext);
    const RsettingRoomName = useRecoilValue(settingRoomNameState);
    const [initGame, setInitGame] = useState(false);
    const [guestReady, setGuestReady] = useState(false);

    
    // const getPlayerReady = useCallback((response) =>{
    //     if (!response) {
    //         return alert(`${response} 에러가 발생했습니다.`);
    //     }
    //     console.log("겟레디");
        
    //     setGuestReady(true);
    // },[guestReady])


    const onReadyToggle = useCallback(() => {
        setOnReady((prev) => !prev);
        setGuestReady((prev) => !prev);
        console.log('게스트 상태', guestReady);
        
        // if (!onReady) {
          gameSocket.emit('ft_game_ready', RsettingRoomName, guestReady ,(response: any) => {
            if (!response.success) return alert(response.payload);
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
                width: '1360px',
                height: '864px',
                display: 'flex',
                backgroundColor: 'rgba(242, 242, 242, 0.5)',
            }}
        >
            <OwnerPlayer onReady={onReady}onReadyToggle={onReadyToggle}  guestReady={guestReady} />
            <GuestPlayer onReady={onReady} onReadyToggle={onReadyToggle} />
        </Box>
    );
};

export default PlayerReadyStatus;
