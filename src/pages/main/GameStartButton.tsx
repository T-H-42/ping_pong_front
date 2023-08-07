import { SocketContext } from '../../api/SocketContext';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { settingRoomNameState } from '../../api/atoms';

const GameStartButton = () => {
    const [initialGameState, setInitGameState] = useState(false);

    const { gameSocket } = useContext(SocketContext);
    const navigate = useNavigate();
    const RsetSettingRoomName = useSetRecoilState<string>(settingRoomNameState);

    const onGameStart = useCallback(() => {
        console.log('게임 소켓', gameSocket);

        setInitGameState((prev) => !prev);
        gameSocket.emit('ft_enter_match_queue', (response: any) => {
            if (!response.success) return alert(`ft_enter_match_queue : ${response.payload}`);
        });
        gameSocket.on('ft_match_success', (response: any) => {
            if (!response.success) return alert(`ft__match_success : ${response.payload}`);
            console.log('매치 성공 후 받은 res ', response);
            RsetSettingRoomName(response.roomName);
            navigate(`/setting-room/${response.roomName}`);
        });
    }, [navigate]);

    return <button onClick={onGameStart}>{initialGameState ? '매칭 중...' : '게임 시작'}</button>;
};

export default GameStartButton;
