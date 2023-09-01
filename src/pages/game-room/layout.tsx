import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';
import  { removeJwtCookie}  from '../../api/cookies';
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
    const { gameSocket , pingpongSocket, chatSocket} = useContext(SocketContext);
    const navigate = useNavigate();
    useEffect(() => {
        window.history.pushState(null, '', window.location.href);

        const confirmGoBack = (event) => {
            event.preventDefault();
            if (RisOwner) {
                RsetIsOwner(false);
            }
            gameSocket.emit('ft_leave_setting_room', (response: any) => {
                console.log('ft_leave_setting_room emit!!!!!!!');
                
                if (response.checktoken===false) {
                    // pingpongSocket.disconnect();
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
                // alert(`상대방이 나갔습니다.`);
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
            console.log("내 자신이 나가는 겁니다 !");
            
            //자신 나가는 로직
            if (!response) {
                return alert(`${response} 에러가 발생했습니다.`);
            }
            //FIX : 고민해야함
            removeJwtCookie('jwt');

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
            if (RisOwner) {
                RsetIsOwner(false);
            }
            // alert(`상대방이 나갔습니다.`);
            // setTimeout(() => {
                navigate('/');
            // }, 1000);
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
