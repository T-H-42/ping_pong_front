import React, { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from '../../api/SocketContext';
import { useRecoilValue } from 'recoil';
import { settingRoomNameState } from '../../api/atoms';
import { Navigate, useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { isOwnerState } from '../../api/atoms';
import { useSetRecoilState } from 'recoil';
import  { removeJwtCookie}  from '../../api/cookies';

import ModalContainer from '../../components/ModalContainer';
import GameSettingContainer from './GameSettingContainer';
import PlayerReadyStatus from './PlayerReadyStatus';

interface ISettingInformation {
    score: number;
    speedMode: number;
    roomName: string;
}

const SettingRoomLayout = () => {
    const RsetIsOwner = useSetRecoilState<boolean>(isOwnerState);
    const [open, setOpen] = useState(false);
    const [guestOnReady, setGuestOnReady] = useState(false);
    const [onReady, setOnReady] = useState(false);
    const RsettingRoomName = useRecoilValue(settingRoomNameState);
    const { gameSocket, chatSocket, pingpongSocket } = useContext(SocketContext);
    const RisOwner = useRecoilValue(isOwnerState);

    const [settingInformation, setSettingInformaiton] = useState<ISettingInformation>({
        score: 5,
        speedMode: 0,
        roomName: RsettingRoomName,
    });
    const navigate = useNavigate();
    const modalRef = useRef();

    // 새로고침 이벤트는  beforeunload, popstate는 새로 고침

    useEffect(() => {
        console.log("hello1");
        gameSocket.off('ft_trigger');
        chatSocket.off('ft_trigger');
        chatSocket.off('ft_getfriendlist');
        console.log("hello2");

        window.history.pushState(null, '', window.location.href);
        const confirmGoBack = (event: any) => {
            event.preventDefault();

            gameSocket.emit('ft_leave_setting_room', (response: any) => {
                if (response.checktoken===false) {
                    pingpongSocket.disconnect();
                    chatSocket.disconnect();
                    gameSocket.disconnect();
                    removeJwtCookie('jwt');
                    localStorage.clear();
                    // setOpenTokenError(true);
                    return ;
                }
                if (!response.success) {
                    alert(`설정 방 나가기 실패 :  ${response.payload}`);
                    return;
                }
                alert(`상대방이 나갔습니다.`);
            });
            navigate('/main');
        };

        window.addEventListener('popstate', confirmGoBack);

        return () => {
            window.removeEventListener('popstate', confirmGoBack);
        };
    }, []);

    const onReadyToggle = () => {
        setOnReady((prev) => !prev);
    };
    const handleClose = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    useEffect(() => {
        const handleMyselfLeaveSettingRoom = (response: any) => {
            //자신 나가는 로직
            if (!response) {
                return alert(`${response} 에러가 발생했습니다.`);
            }
            // gameSocket.emit('ft_leave_setting_room', (response: any) => {
            //     if (!response.success){
            //         alert(`설정 방 나가기 실패 :  ${response.payload}`);
            //         return
            //     }
            // });
            navigate('/');
        };

        const handleEnemyLeaveSettingRoom = (response: any) => {
            // console.log("나갔습니다!@#!@#!@$!$!$@!@$@!$!@$!@$!@$!@$!@$@!$!@$!@$!$@!$");
            
            if (!response) {
                return alert(`${response} 에러가 발생했습니다.`);
            }
            if (RisOwner) {
                RsetIsOwner(false);
            }
            alert(`상대방이 나갔습니다.`);
            navigate('/');
        };

        gameSocket.on('ft_tomain', handleMyselfLeaveSettingRoom);
        gameSocket.on('ft_enemy_leave_room', handleEnemyLeaveSettingRoom);

        return () => {
            gameSocket.off('ft_tomain', handleMyselfLeaveSettingRoom);
            gameSocket.off('ft_enemy_leave_room', handleEnemyLeaveSettingRoom);
        };
    }, [gameSocket, navigate]);

    useEffect(() => {
        const handleGameSettingSuccess = (response: any) => {
            // if (!response.success) return alert(response.payload);
        };

        gameSocket.on('ft_game_setting_success', handleGameSettingSuccess);

        return () => {
            gameSocket.off('ft_game_setting_success', handleGameSettingSuccess);
        };
    }, [gameSocket]);

    useEffect(() => {
        const handleInitSuccess = (response: any) => {
            if (!response.success) {
                alert(response.payload);
                return;
            }
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
                    width: '70vw',
                    height: '5vh',
                    justifyContent: 'flex-end',
                }}
            >
                <Button variant="outlined" disabled={!RisOwner} onClick={handleClose}>
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
        </>
    );
};

export default SettingRoomLayout;
