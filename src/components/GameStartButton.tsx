import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { Button } from '@mui/material';

import { settingRoomNameState, isOwnerState, settingState } from '../api/atoms';
import { SocketContext } from '../api/SocketContext';
import { removeJwtCookie } from '../api/cookies';

const GameStartButton = () => {
    const [initialGameState, setInitGameState] = useState(false);
    const { gameSocket, pingpongSocket, chatSocket } = useContext(SocketContext);
    const navigate = useNavigate();
    const RsetSettingRoomName = useSetRecoilState<string>(settingRoomNameState);
    const RsetIsOwner = useSetRecoilState<boolean>(isOwnerState);
    const RsettingName = useSetRecoilState<{}>(settingState);

    const onGameStart = useCallback(() => {
        if (initialGameState) {
            setInitGameState((prev) => !prev);
            gameSocket.emit('ft_exit_match_queue', (response: any) => {
                if (response.checktoken === false) {
                    pingpongSocket.disconnect();
                    chatSocket.disconnect();
                    gameSocket.disconnect();
                    removeJwtCookie('jwt');
                    localStorage.clear();
                    navigate('/');
                    return;
                }
                if (!response.success) {
                    alert('매치 취소에 실패하였습니다 : ');
                    return;
                }
            });
        } else {
            setInitGameState((prev) => !prev);
            gameSocket.emit('ft_enter_match_queue', (response: any) => {
                if (response.checktoken === false) {
                    pingpongSocket.disconnect();
                    chatSocket.disconnect();
                    gameSocket.disconnect();
                    removeJwtCookie('jwt');
                    localStorage.clear();
                    navigate('/');
                    return;
                }
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

            RsetSettingRoomName(response.roomName);
            RsettingName(response.usernames);
            if (response.isOwner === true) {
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