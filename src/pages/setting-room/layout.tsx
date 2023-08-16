import ModalContainer from '../../components/ModalContainer';
import React, { useContext, useEffect, useState } from 'react';
import GameSettingContainer from './GameSettingContainer';
import { SocketContext } from '../../api/SocketContext';
import { useRecoilValue } from 'recoil';
import { settingRoomNameState } from '../../api/atoms';
import { useNavigate } from 'react-router-dom';
import PlayerReadyStatus from './PlayerReadyStatus';
import { useBeforeunload } from 'react-beforeunload';
import { Beforeunload } from 'react-beforeunload';
import history from '../../api/history';
import { useLocation } from 'react-router-dom';
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
    // const [value, setValue] = useState('');
    // useBeforeunload(gameSocket !== null ? (event) => event.preventDefault() : null);
    const navigate = useNavigate();

    // useEffect(() => {
    //     console.log('얘는 잘 되나 @? @? @ ?@ ?');

    //     const listenBackEvent = () => {
    //         console.log('1@? @? @ ?@ ?');

    //         if (window.confirm('페이지를 벗어나면 사진이 사라집니다. 정말 페이지를 나가시겠습니까?')) {
    //             // photoHandler.reshootingHandler();
    //             // photoHandler.countResetHandler();
    //         } else {
    //             navigate('/shoot');
    //         }
    //     };
    //     const historyEvent = history.listen(({ action }) => {
    //         console.log('22222222@? @? @ ?@ ?');

    //         if (action === 'POP') {
    //             listenBackEvent();
    //         }
    //     });
    //     return historyEvent;
    // }, []);

    // useEffect(() => {
    //     const handlePopState = (event: PopStateEvent) => {
    //         const confirmationMessage = 'Are you sure you want to go back?';
    //         if (!window.confirm(confirmationMessage)) {
    //             history.replaceState(null, '', location.href);
    //         }
    //     };

    //     window.addEventListener('popstate', handlePopState);

    //     return () => {
    //         window.removeEventListener('popstate', handlePopState);
    //     };
    // }, []);
    // window.addEventListener('popstate', (event) => {
    //     console.log('히스토리는 : ', window.history);
    //     alert('Back button pressed');
    // });
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
            {/* <input onChange={(event) => setValue(event.target.value)} value={value} /> */}
            {/* <Beforeunload onBeforeunload={() => 'why not'} /> */}
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
            {/* <Beforeunload /> */}
        </>
    );
};

export default SettingRoomLayout;
