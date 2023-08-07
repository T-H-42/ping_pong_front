import ModalContainer from '../../components/ModalContainer';
import React, { useContext, useEffect, useState } from 'react';
import GameSettingContainer from '../../pages/setting-room/GameSettingContainer';
import { SocketContext } from '../../api/SocketContext';
import { useRecoilValue } from 'recoil';
import { settingRoomNameState } from '../../api/atoms';
import { useNavigate } from 'react-router-dom';
import PlayerReadyStatus from './PlayerReadyStatus';
import { Backdrop, Button, CircularProgress } from '@mui/material';

interface ISettingInformation {
    score: number;
    speed: number;
    roomName: string;
}

const SettingRoomLayout = () => {
    const [open, setOpen] = useState(false);
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
            {onReady ? (
                <>
                    {/* <div>
                        <Button onClick={handleBackdropOpen}>Show backdrop</Button>

                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={backdrop}
                            onClick={handleBackdropClose}
                        >
                            <div>Ready</div>
                        </Backdrop>
                    </div> */}
                    <ModalContainer open={open} handleClose={handleClose}>
                        <>{/* <GameSettingContainer open={open} handleClose={handleClose} /> */}</>
                    </ModalContainer>
                    <PlayerReadyStatus
                        // handleBackdropOpen={handleBackdropOpen}
                        // backdrop={backdrop}
                        // setBackdrop={setBackdrop}
                        onReady={onReady}
                        setOnReady={setOnReady}
                        settingInformation={settingInformation}
                    />
                    {/* <PlayerReadyStatus
                        handleBackdropOpen={handleBackdropOpen}
                        backdrop={backdrop}
                        setBackdrop={setBackdrop}
                        onReady={onReady}
                        setOnReady={setOnReady}
                        settingInformation={settingInformation}
                    /> */}
                    {/* <PlayerReadyStatus /> */}
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
                        // handleBackdropOpen={handleBackdropOpen}
                        // backdrop={backdrop}
                        // setBackdrop={setBackdrop}
                        onReady={onReady}
                        setOnReady={setOnReady}
                        settingInformation={settingInformation}
                    />
                    {/* <PlayerReadyStatus
                        handleBackdropOpen={handleBackdropOpen}
                        backdrop={backdrop}
                        setBackdrop={setBackdrop}
                        onReady={onReady}
                        setOnReady={setOnReady}
                        settingInformation={settingInformation}
                    /> */}

                    {/* <PlayerReadyStatus /> */}
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
