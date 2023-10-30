import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';
import { removeJwtCookie } from '../../api/cookies';
import PingPongContainer from './PingPongContainer';
import PaddleManager from './PaddleManager';
import ModalContainer from '../../components/ModalContainer';
import GameResultContainer from './GameResultContainer';
import { SocketContext } from '../../api/SocketContext';
import { useSetRecoilState } from 'recoil';
import { isOwnerState, settingRoomNameState } from '../../api/atoms';

const Layout = () => {
    const [open, setOpen] = useState(false);
    const RsetIsOwner = useSetRecoilState<boolean>(isOwnerState);
    const RisOwner = useRecoilValue(isOwnerState);
    const [gameResult, setGameResult] = useState(false);
    const { gameSocket, pingpongSocket, chatSocket } = useContext(SocketContext);
    const navigate = useNavigate();
    useEffect(() => {
        window.history.pushState(null, '', window.location.href);

        const confirmGoBack = (event) => {
            event.preventDefault();
            if (RisOwner) {
                RsetIsOwner(false);
            }
            gameSocket.emit('ft_leave_setting_room', (response: any) => {
                if (response.checktoken === false) {
                    chatSocket.disconnect();
                    gameSocket.disconnect();
                    removeJwtCookie('jwt');
                    localStorage.clear();
                    return;
                }
                if (!response.success) {
                    alert(`설정 방 나가기 실패 :  ${response.payload}`);
                    return;
                }
            });
            navigate('/main');
        };
        window.addEventListener('popstate', confirmGoBack);

        return () => {
            RsetIsOwner(false);
            window.removeEventListener('popstate', confirmGoBack);
        };
    }, []);

    useEffect(() => {
        const handleMyselfLeaveSettingRoom = (response: any) => {
            if (!response) {
                return alert(`${response} 에러가 발생했습니다.`);
            }
            removeJwtCookie('jwt');
            navigate('/main');
        };
        const handleEnemyLeaveGameRoom = (response) => {

            if (!response) {
                return alert(`${response} 에러가 발생했습니다.`);
            }
            if (RisOwner) {
                RsetIsOwner(false);
            }
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
            <PaddleManager open={open} />
            <PingPongContainer open={open} setOpen={setOpen} />
        </>
    );
};

export default Layout;
