import { SocketContext } from '../../api/SocketContext';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { settingRoomNameState, isOwnerState } from '../../api/atoms';

const GameStartButton = () => {
    const [initialGameState, setInitGameState] = useState(false);
    const { gameSocket } = useContext(SocketContext);
    const navigate = useNavigate();
    const RsetSettingRoomName = useSetRecoilState<string>(settingRoomNameState);
    const RsetIsOwner = useSetRecoilState<boolean>(isOwnerState);

    const onGameStart = useCallback(() => {
        if (initialGameState) {
            console.log('매치 취소기', RsetIsOwner);

            setInitGameState((prev) => !prev);
            gameSocket.emit('ft_exit_match_queue', (response: any) => {
                if (!response.success) return alert(`ft_exit_queue : ${response.payload}`);
            });
        } else {
            console.log('매치 잡기', RsetIsOwner);
            setInitGameState((prev) => !prev);
            gameSocket.emit('ft_enter_match_queue', (response: any) => {
                if (!response.success) return alert(`ft_enter_match_queue : ${response.payload}`);
            });
        }
        gameSocket.on('ft_match_success', (response: any) => {
            if (!response.success) return alert(`ft__match_success : ${response.payload}`);
            console.log('매치 성공 후 받은 res ', response);
            RsetSettingRoomName(response.roomName);
            if (response.isOwner) {
                RsetIsOwner(true);
            }
            navigate(`/setting-room/${response.roomName}`);
        });
    }, [navigate, initialGameState]);

    return <button onClick={onGameStart}>{initialGameState ? '매칭 중...' : '게임 시작'}</button>;
};

export default GameStartButton;
