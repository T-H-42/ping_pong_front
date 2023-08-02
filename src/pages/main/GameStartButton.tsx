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
        // if (initialGameState) {
        gameSocket.emit('ft_enter_match_queue', (response: any) => {
            if (!response.success) return alert(`ft_enter_match_queue : ${response.payload}`);
            // console.log('받은 res ', response);
            // navigate(`/setting-room/${response.payload}`);
        });
        gameSocket.on('ft_match_success', (response: any) => {
            if (!response.success) return alert(`ft__match_success : ${response.payload}`);
            console.log('받은 res ', response);
            RsetSettingRoomName(response.roomName);
            navigate(`/setting-room/${response.roomName}`);
        });
        // } else {
        //     gameSocket.emit('ft_exit_match_queue', (response: any) => {
        //         if (!response.success) return alert(response.payload);
        //         console.log('받은 res ', response);
        //     });
        // }
    }, [navigate]);

    return <button onClick={onGameStart}>{initialGameState ? '매칭 중...' : '게임 시작'}</button>;
};

export default GameStartButton;
