import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';

import PingPongContainer from './PingPongContainer';
import PaddleManager from './PaddleManager';
import ModalContainer from '../../components/ModalContainer';
import GameResultContainer from './GameResultContainer';
import { SocketContext } from '../../api/SocketContext';
import { useSetRecoilState } from 'recoil';
import { isOwnerState, settingRoomNameState } from '../../api/atoms';

const Layout = () => {
    const RsetIsOwner = useSetRecoilState<boolean>(isOwnerState);
    const RisOwner = useRecoilValue(isOwnerState);
    
    const { gameSocket } = useContext(SocketContext);
    const navigate = useNavigate();

    useEffect(() => {
        window.history.pushState(null, '', window.location.href);

        const confirmGoBack = (event) => {
            event.preventDefault();
            if(RisOwner)
            {
                RsetIsOwner(false)
            }
                console.log('백으로 에밋');
                gameSocket.emit('ft_leave_setting_room', (response: any) => {
                    if (!response.success) return alert(`설정 방 나가기 실패 :  ${response.payload}`);
                    alert(`${response.username}님이 나갔습니다.`);
                });
                navigate('/main');
        };
        window.addEventListener('popstate', confirmGoBack);

        return () => {
            window.removeEventListener('popstate', confirmGoBack);
        };
    }, []);

    useEffect(() => {
        const handleMyselfLeaveSettingRoom = (response : any) => { //자신 나가는 로직
            if (!response) {
                return alert(`${response} 에러가 발생했습니다.`);
            }
            // if(RisOwner)
            // {
            //     RsetIsOwner(false)
            // }
            navigate('/main');
        };
        const handleEnemyLeaveGameRoom = (response) => {
            if (!response) {
                return alert(`${response} 에러가 발생했습니다.`);
            }
            if(RisOwner)
            {
                RsetIsOwner(false)
            }
            alert(`${response.username}님이 나갔습니다.`);
            navigate('/');
        };
        gameSocket.on('ft_tomain', handleMyselfLeaveSettingRoom);
        gameSocket.on('ft_enemy_leave_room', handleEnemyLeaveGameRoom);

        return () => {
            gameSocket.off('ft_tomain', handleMyselfLeaveSettingRoom);
            gameSocket.off('ft_enemy_leave_room', handleEnemyLeaveGameRoom);
        };
    }, [gameSocket, navigate]);

    return (
        <>
            <PaddleManager />
            <PingPongContainer />
        </>
    );
};

export default Layout;
