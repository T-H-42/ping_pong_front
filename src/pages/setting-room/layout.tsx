import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SocketContext } from '../../api/SocketContext';

import GameSettingContainer from './GameSettingContainer';
import ModalContainer from '../../components/ModalContainer';
import PlayerReadyStatus from './PlayerReadyStatus';

import { useRecoilValue } from 'recoil';
import { settingRoomNameState } from '../../api/atoms';

interface ISettingInformation {
    score: number;
    speed: number;
    roomName: string;
}

const SettingRoomLayout = () => {
    const [open, setOpen] = useState(false);
    const [guestOnReady, setGuestOnReady] = useState(false);
    const [onReady, setOnReady] = useState(false);
    const RsettingRoomName = useRecoilValue(settingRoomNameState);
    const { gameSocket } = useContext(SocketContext);
    const [settingInformation, setSettingInformaiton] = useState<ISettingInformation>({
        score: 5,
        speed: 100,
        roomName: RsettingRoomName,
    });
    const navigate = useNavigate();

    const onReadyToggle = () => {
        setOnReady((prev) => !prev);
    };
    const handleClose = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleExit = () => {
        gameSocket.emit('ft_leave_setting_room', RsettingRoomName, (response: any) => {
            if (!response.success) return alert(`설정 방 나가기 실패 :  ${response.payload}`);
        });
        navigate('/');
    };
    useEffect(() => {
        const handleEnemyLeaveSettingRoom = (response) => {
            if (!response) return alert(`${response}`);
            navigate('/');
            alert(`${response.username}님이 나갔습니다.`);
        };

        gameSocket.on('ft_enemy_leave_setting_room', handleEnemyLeaveSettingRoom);

        return () => {
            gameSocket.off('ft_enemy_leave_setting_room', handleEnemyLeaveSettingRoom);
        };
    }, [gameSocket, navigate]);

    useEffect(() => {
        const handleGameSettingSuccess = (response: any) => {
            if (!response.success) return alert(response.payload);
        };

        gameSocket.on('ft_game_setting_success', handleGameSettingSuccess);

        return () => {
            gameSocket.off('ft_game_setting_success', handleGameSettingSuccess);
        };
    }, [gameSocket]);

    useEffect(() => {
        const handleInitSuccess = (response: any) => {
            if (!response.success) return alert(response.payload);
            navigate(`/game-room/${RsettingRoomName}`);
        };

        gameSocket.on('ft_game_play_success', handleInitSuccess);
        return () => {
            gameSocket.off('ft_game_play_success', handleInitSuccess);
        };
    }, [gameSocket]);
    return (
        <>
            {onReady ? (
                <>
                    <ModalContainer open={open} handleClose={handleClose}>
                        <>{/* <GameSettingContainer open={open} handleClose={handleClose} /> */}</>
                    </ModalContainer>
                    <PlayerReadyStatus
                        onReady={onReady}
                        setOnReady={setOnReady}
                        settingInformation={settingInformation}
                    />
                    <button onClick={handleClose}>게임 설정</button>
                    <button onClick={handleExit}>게임 나가기</button>
                    {open && (
                        <ModalContainer open={open} handleClose={handleClose}>
                            <>
                                <GameSettingContainer
                                    open={open}
                                    handleClose={handleClose}
                                    settingInformation={settingInformation}
                                    setSettingInformaiton={setSettingInformaiton}
                                />
                            </>
                        </ModalContainer>
                    )}
                </>
            ) : (
                <>
                    <ModalContainer open={open} handleClose={handleClose}>
                        <>
                            <GameSettingContainer
                                open={open}
                                handleClose={handleClose}
                                settingInformation={settingInformation}
                                setSettingInformaiton={setSettingInformaiton}
                            />
                        </>
                    </ModalContainer>
                    <PlayerReadyStatus
                        onReady={onReady}
                        setOnReady={setOnReady}
                        settingInformation={settingInformation}
                    />
                    <button onClick={handleClose}>게임 설정</button>
                    <button onClick={handleExit}>게임 나가기</button>
                    {open && (
                        <ModalContainer open={open} handleClose={handleClose}>
                            <>
                                <GameSettingContainer
                                    open={open}
                                    handleClose={handleClose}
                                    settingInformation={settingInformation}
                                    setSettingInformaiton={setSettingInformaiton}
                                />
                            </>
                        </ModalContainer>
                    )}
                </>
            )}
        </>
    );
};

export default SettingRoomLayout;
