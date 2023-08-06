import ModalContainer from '../../components/ModalContainer';
import React, { useContext, useState } from 'react';
import GameSettingContainer from '../../pages/setting-room/GameSettingContainer';
import { SocketContext } from '../../api/SocketContext';
import { useRecoilValue } from 'recoil';
import { settingRoomNameState } from '../../api/atoms';
import { useNavigate } from 'react-router-dom';
import PlayerReadyStatus from './PlayerReadyStatus';

const SettingRoomLayout = () => {
    const [open, setOpen] = useState(false);
    const RsettingRoomName = useRecoilValue(settingRoomNameState);
    const { gameSocket } = useContext(SocketContext);
    const navigate = useNavigate();

    const handleClose = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const handleExit = () => {
        console.log('나갑니다 ~');
        console.log('아니야', RsettingRoomName);

        gameSocket.emit('ft_leave_setting_room', RsettingRoomName, (response: any) => {
            if (!response.success) return alert(response.payload);
            console.log('리브 세팅룸', response);
        });

        gameSocket.on('ft_enemy_leave_setting_room', (response: any) => {
            if (!response.success) return alert(response.payload);
            console.log('적이 나갔습니다', response);

            navigate('/');
        });
    };
    return (
        <>
            <PlayerReadyStatus />
            {/* <PlayerReadyStatus /> */}
            <button onClick={handleClose}>게임 설정</button>
            <button onClick={handleExit}>게임 나가기</button>
            {open && (
                <ModalContainer open={open} handleClose={handleClose}>
                    <>
                        <GameSettingContainer />
                    </>
                </ModalContainer>
            )}
        </>
    );
};

export default SettingRoomLayout;
