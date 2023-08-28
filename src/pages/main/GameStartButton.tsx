import { SocketContext } from '../../api/SocketContext';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { settingRoomNameState, isOwnerState, settingState } from '../../api/atoms';
import { Button } from '@mui/material';

const GameStartButton = () => {
    const [initialGameState, setInitGameState] = useState(false);
    const { gameSocket } = useContext(SocketContext);
    const navigate = useNavigate();
    const RsetSettingRoomName = useSetRecoilState<string>(settingRoomNameState);
    const RsetIsOwner = useSetRecoilState<boolean>(isOwnerState);
    const RsettingName = useSetRecoilState<{}>(settingState);

    const onGameStart = useCallback(() => {
        if (initialGameState) {
            console.log('매치 취소기');

            setInitGameState((prev) => !prev);
            gameSocket.emit('ft_exit_match_queue', (response: any) => {
                if (!response.success) {
                    alert('매치 취소에 실패하였습니다 : ');
                    return;
                }
            });
        } else {
            console.log('매치 잡기');
            setInitGameState((prev) => !prev);
            gameSocket.emit('ft_enter_match_queue', (response: any) => {
                if (!response.success) {
                    alert(`매칭에 실패하였습니다. ${response}`);
                    return;
                }
            });
        }
    }, [initialGameState, navigate]);

    useEffect(() => {
        const goToSettingsRoom = (response: any) => {
            if (!response.success) {
                alert(`ft__match_success : ${response.payload}`);
                return;
            }
            console.log('매치 성공 후 받은 res ', response);

            RsetSettingRoomName(response.roomName);
            RsettingName(response.userIds);
            if (response.isOwner) {
                RsetIsOwner(true);
            }
            navigate(`/setting-room/${response.roomName}`);
        };

        gameSocket.on('ft_match_success', goToSettingsRoom);
        return () => {
            // gameSocket.off('ft_match_success', goToSettingsRoom);
        };
    }, [gameSocket]);

    return (
        <Button variant="contained" onClick={onGameStart}>
            {initialGameState ? '매칭 중...' : '게임 시작'}
        </Button>
    );
};

export default GameStartButton; 