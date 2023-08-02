import React, { useState, useCallback, useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { SocketContext } from '../../api/SocketContext';
import { useRecoilValue } from 'recoil';
import { settingRoomNameState } from '../../api/atoms';

interface ISelectedButtons {
    score: number;
    speed: number;
}

interface ISettingInformation {
    score: number;
    speed: number;
    roomName: string;
}

const GameSettingContainer = () => {
    const { gameSocket } = useContext(SocketContext);
    const RsettingRoomName = useRecoilValue(settingRoomNameState);
    const [settingInformation, setSettingInformaiton] = useState<ISettingInformation>({
        score: 0,
        speed: 100,
        roomName: RsettingRoomName,
    });
    const [modalStatus, setModalStatus] = useState(false);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: modalStatus ? 'background.paper' : 'white',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const settingBox = {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
    };

    const buttonContainer = {
        width: '100%',
        padding: '12px',
        display: 'flex',
        justifyContent: 'space-evenly',
    };

    const handleButtonClick = useCallback((buttonName: number, type: 'score' | 'speed') => {
        console.log('클릭값', buttonName);
        console.log('타입', type);

        if (type === 'score') {
            setSettingInformaiton((prevSelected) => ({ ...prevSelected, score: buttonName }));
        }
        if (type === 'speed') {
            setSettingInformaiton((prevSelected) => ({ ...prevSelected, speed: buttonName }));
        }
    }, []);

    const submitSelectedOptions = useCallback(() => {
        setSettingInformaiton({
            score: settingInformation.score,
            speed: settingInformation.speed,
            roomName: RsettingRoomName,
        });
        gameSocket.emit('ft_game_setting', settingInformation, (response: any) => {
            if (!response.success) return alert(response.payload);
        });
        gameSocket.on('ft_game_setting_success', (response: any) => {
            if (!response.success) return alert(response.payload);
            console.log('게임 성공!', response.success);
        });
        setModalStatus(true);
    }, [settingInformation.roomName, settingInformation.score, settingInformation.speed]);
    useEffect(() => {
        console.log('object being modified', settingInformation);
    }, [settingInformation]);
    return (
        !modalStatus && (
            <Box sx={style}>
                <Box sx={settingBox}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        점수 설정
                    </Typography>
                    <Box sx={buttonContainer}>
                        <Button
                            variant={settingInformation.score === 3 ? 'contained' : 'outlined'}
                            onClick={() => handleButtonClick(3, 'score')}
                        >
                            3
                        </Button>
                        <Button
                            variant={settingInformation.score === 7 ? 'contained' : 'outlined'}
                            onClick={() => handleButtonClick(7, 'score')}
                        >
                            7
                        </Button>
                        <Button
                            variant={settingInformation.score === 11 ? 'contained' : 'outlined'}
                            onClick={() => handleButtonClick(11, 'score')}
                        >
                            11
                        </Button>
                    </Box>
                </Box>
                <Box sx={settingBox}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        게임속도 설정
                    </Typography>
                    <Box sx={buttonContainer}>
                        <Button
                            variant={settingInformation.speed === 50 ? 'contained' : 'outlined'}
                            onClick={() => handleButtonClick(50, 'speed')}
                        >
                            보통
                        </Button>
                        <Button
                            variant={settingInformation.speed === 100 ? 'contained' : 'outlined'}
                            onClick={() => handleButtonClick(100, 'speed')}
                        >
                            빠르게
                        </Button>
                        <Button
                            variant={settingInformation.speed === 150 ? 'contained' : 'outlined'}
                            onClick={() => handleButtonClick(150, 'speed')}
                        >
                            매우 빠르게
                        </Button>
                    </Box>
                </Box>
                <Box sx={settingBox}>
                    <Button variant="contained" onClick={submitSelectedOptions}>
                        설정하기
                    </Button>
                </Box>
            </Box>
        )
    );
};

export default GameSettingContainer;
