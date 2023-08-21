import ModalContainer from '../../components/ModalContainer';
import React, { useContext, useEffect, useRef, useState } from 'react';
import GameSettingContainer from './GameSettingContainer';
import { SocketContext } from '../../api/SocketContext';
import { useRecoilValue } from 'recoil';
import { settingRoomNameState } from '../../api/atoms';
import { useNavigate } from 'react-router-dom';
import PlayerReadyStatus from './PlayerReadyStatus';
import GoHomeButton from '../../components/GoHomeButton';
import { Box, Button } from '@mui/material';

interface ISettingInformation {
    score: number;
    speedMode: number;
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
        speedMode: 0,
        roomName: RsettingRoomName,
    });
    const navigate = useNavigate();
    const modalRef = useRef();

    // useEffect(() => {
    //     const preventGoBack = (event) => {
    //         event.preventDefault();
    //         alert('종료하기를 눌러주세요 :D');
    //     };
    //     console.log('이펙트 발동!');
    //     console.log('++', window.history);

    //     window.history.pushState(null, '', window.location.href);

    //     window.addEventListener('popstate', function (event) {
    //         event.preventDefault();
    //         gameSocket.emit('ft_leave_setting_room', (response: any) => {
    //             if (!response.success) return alert(`설정 방 나가기 실패 :  ${response.payload}`);
    //         });
    //     });
    //     window.addEventListener('beforeunload', preventGoBack);
    //     return () => {
    //         window.removeEventListener('popstate', preventGoBack);
    //         // window.removeEventListener('beforeunload', preventGoBack);
    //     };
    // }, []);

    // 새로고침 이벤트는  beforeunload, popstate는 새로 고침
    useEffect(() => {
        window.history.pushState(null, '', window.location.href);

        const confirmRefresh = (event) => {
            event.preventDefault();
            event.returnValue = '';
            console.log('새로고침 에밋');

            gameSocket.emit('ft_leave_setting_room', (response: any) => {
                if (!response.success) return alert(`설정 방 나가기 실패 :  ${response.payload}`);
            });
        };
        const confirmGoBack = (event) => {
            event.preventDefault();
            const result = window.confirm('Are you sure you want to go back?');
            if (result) {
                console.log('백으로 에밋');
                gameSocket.emit('ft_leave_setting_room', (response: any) => {
                    if (!response.success) return alert(`설정 방 나가기 실패 :  ${response.payload}`);
                });
                navigate('/main');
            }
        };
        window.addEventListener('popstate', confirmGoBack);
        window.addEventListener('beforeunload', confirmRefresh);

        return () => {
            window.removeEventListener('beforeunload', confirmRefresh);
            window.removeEventListener('popstate', confirmGoBack);
        };
    }, []);

    const onReadyToggle = () => {
        setOnReady((prev) => !prev);
    };
    const handleClose = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    // const handleExit = () => {
    //     gameSocket.emit('ft_leave_setting_room', (response: any) => {
    //         if (!response.success) return alert(`설정 방 나가기 실패 :  ${response.payload}`);
    //     });
    //     navigate('/');
    // };

    useEffect(() => {
        const handleEnemyLeaveSettingRoom = (response) => {
            if (!response) {
                return alert(`${response} 에러가 발생했습니다.`);
            }
            alert(`${response.username}님이 나갔습니다.`);
            navigate('/');
        };

        gameSocket.on('ft_enemy_leave_room', handleEnemyLeaveSettingRoom);

        return () => {
            gameSocket.off('ft_enemy_leave_room', handleEnemyLeaveSettingRoom);
        };
    }, [gameSocket, navigate]);

    useEffect(() => {
        const handleGameSettingSuccess = (response: any) => {
            console.log('게임 설정 성공', response);
            // if (!response.success) return alert(response.payload);
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
            <Box
                sx={{
                    display: 'flex',
                    width: '1360px',
                    height: '40px',
                    justifyContent: 'space-between',
                    marginBottom: '32px',
                }}
            >
                <GoHomeButton />
                <Button variant="outlined" onClick={handleClose}>
                    게임 설정
                </Button>
            </Box>
            <ModalContainer open={open} handleClose={handleClose}>
                <GameSettingContainer
                    open={open}
                    handleClose={handleClose}
                    settingInformation={settingInformation}
                    setSettingInformaiton={setSettingInformaiton}
                    ref={modalRef}
                />
            </ModalContainer>
            <PlayerReadyStatus onReady={onReady} setOnReady={setOnReady} settingInformation={settingInformation} />
            {/* <Button onClick={handleClose}>게임 설정</Button> */}
        </>
    );
};

export default SettingRoomLayout;
