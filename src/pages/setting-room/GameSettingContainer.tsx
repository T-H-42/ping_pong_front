import React, { useState, useCallback, useContext, useEffect, ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { SocketContext } from '../../api/SocketContext';
import { useRecoilValue } from 'recoil';
import { settingRoomNameState } from '../../api/atoms';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Slider } from '@mui/material';

// interface ISettingInformation {
//     score: number;
//     speed: number;
//     roomName: string;
// }

const GameSettingContainer = ({ open, handleClose, settingInformation, setSettingInformaiton }) => {
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
        flexDirection: 'row',
    };

    const buttonContainer = {
        width: '100%',
        padding: '12px',
        display: 'flex',
        justifyContent: 'space-evenly',
    };

    const { gameSocket } = useContext(SocketContext);
    const RsettingRoomName = useRecoilValue(settingRoomNameState);

    // const [settingInformation, setSettingInformaiton] = useState<ISettingInformation>({
    //     score: 5,
    //     speed: 100,
    //     roomName: RsettingRoomName,
    // });
    const marks = [
        {
            value: 0,
            label: '0.5',
        },
        {
            value: 33.33,
            label: '1.0',
        },
        {
            value: 66.66,
            label: '1.5',
        },
        {
            value: 100,
            label: '2.0',
        },
    ];
    const handleScoreChange = (event: ChangeEvent<HTMLInputElement>, newScore: string) => {
        setSettingInformaiton((prev) => ({ ...prev, score: parseInt(newScore, 10) }));
    };

    const valuetext = (value: number) => {
        const calculatedValue = (value / 100) * 1.5 + 0.5;

        return `${calculatedValue}°C`;
    };

    const handleSpeedChange = (event: Event, newValue: number | number[]) => {
        let newSpeed = ((newValue as number) / 100) * 1.5 + 0.5;
        if (newSpeed === 1.4999) {
            newSpeed = 1.5;
        }
        if (newSpeed === 0.99995) {
            newSpeed = 1.0;
        }
        setSettingInformaiton((prevSetting) => ({
            ...prevSetting,
            speed: newSpeed,
        }));
    };
    const submitSelectedOptions = useCallback(() => {
        setSettingInformaiton({
            score: settingInformation.score,
            speed: settingInformation.speed,
            roomName: RsettingRoomName,
        });
        gameSocket.emit('ft_game_setting', settingInformation, (response: any) => {
            if (!response.success) return alert(response.payload);
            console.log('게임 설정 요청', response);
        });
        console.log('게임 설정 로그');

        setModalStatus(true);
        handleClose();
    }, [settingInformation.roomName, settingInformation.score, settingInformation.speed]);

    return (
        !modalStatus && (
            <Box sx={style}>
                <Box sx={settingBox}>
                    <p id="modal-modal-title">점수 설정</p>
                    <Box sx={buttonContainer}>
                        <FormControl>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={settingInformation.score}
                                onChange={(event, value) => handleScoreChange(event, value)}
                            >
                                <FormControlLabel value="3" control={<Radio />} label="3 라운드" />
                                <FormControlLabel value="7" control={<Radio />} label="7 라운드" />
                                <FormControlLabel value="11" control={<Radio />} label="11 라운드" />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </Box>
                <Box sx={settingBox}>
                    <Typography id="modal-modal-title">게임속도 설정</Typography>
                    <Box sx={buttonContainer}>
                        <Box sx={{ width: 300 }}>
                            <Slider
                                aria-label="Custom marks"
                                defaultValue={33.33}
                                value={(settingInformation.speed - 0.5) * (100 / 1.5)}
                                onChange={handleSpeedChange}
                                getAriaValueText={valuetext}
                                step={null}
                                marks={marks}
                            />
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Box>
                        <Button sx={{ marginRight: '12px' }} onClick={submitSelectedOptions}>
                            취소
                        </Button>
                        <Button variant="contained" onClick={submitSelectedOptions}>
                            확인
                        </Button>
                    </Box>
                </Box>
            </Box>
        )
    );
};

export default GameSettingContainer;
