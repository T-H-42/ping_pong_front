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
            console.log('매치 취소기');

            setInitGameState((prev) => !prev);
            gameSocket.emit('ft_exit_match_queue', (response: any) => {
                if (response.checktoken === false) {
                    console.log('ft_exit_match_queue');
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
            console.log('매치 잡기');
            setInitGameState((prev) => !prev);
            gameSocket.emit('ft_enter_match_queue', (response: any) => {
                if (response.checktoken === false) {
                    console.log('ft_enter_match_queue');
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
            console.log('매치 성공 후 받은 res ', response);

            RsetSettingRoomName(response.roomName);
            RsettingName(response.usernames);
            if (response.isOwner === true) {
                console.log("나는 오너다 !");
                
                RsetIsOwner(true);
            }

            console.log("내가 받은 방번호다!@@@@!!", response.roomName)
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