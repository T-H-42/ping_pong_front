import React, { useState, useCallback, useContext, useEffect, ChangeEvent, forwardRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { SocketContext } from '../../api/SocketContext';
import { useRecoilValue } from 'recoil';
import { settingRoomNameState } from '../../api/atoms';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Slider } from '@mui/material';

const GameSettingContainer = ({ open, handleClose, settingInformation, setSettingInformaiton }, modalRef) => {
    const [modalStatus, setModalStatus] = useState(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '432px',
        height: '202px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '24px',
        bgcolor: modalStatus ? 'background.paper' : 'white',
        boxShadow: '0px 1px 8px 0px rgba(0, 0, 0, 0.16)',
        borderRadius: '24px',
    };

    const settingBox = {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
    };

    const buttonContainer = {
        width: '397px',
        height: ' 27px',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        gap: '24px',
    };
    
    const { gameSocket } = useContext(SocketContext);
    const RsettingRoomName = useRecoilValue(settingRoomNameState);
    // const [settingInformation, setSettingInformaiton] = useState<ISettingInformation>({
    //     score: 5,
    //     speed: 100,
    //     roomName: RsettingRoomName,
    // });
    // const marks = [
    //     {
    //         value: 0,
    //         label: '0.5',
    //     },
    //     {
    //         value: 33.33,
    //         label: '1.0',
    //     },
    //     {
    //         value: 66.66,
    //         label: '1.5',
    //     },
    //     {
    //         value: 100,
    //         label: '2.0',
    //     },
    // ];
    const handleScoreChange = (event: ChangeEvent<HTMLInputElement>, newScore: string) => {
        setSettingInformaiton((prev) => ({ ...prev, score: parseInt(newScore, 10) }));
    };
    const handleModeChange = (event: ChangeEvent<HTMLInputElement>, speedMode: string) => {
        setSettingInformaiton((prev) => ({ ...prev, speedMode: parseInt(speedMode, 10) }));
    };
    const valuetext = (value: number) => {
        const calculatedValue = (value / 100) * 1.5 + 0.5;

        return `${calculatedValue}°C`;
    };

    // const handleSpeedChange = (event: Event, newValue: number | number[]) => {
    //     let newSpeed = ((newValue as number) / 100) * 1.5 + 0.5;
    //     if (newSpeed === 1.4999) {
    //         newSpeed = 1.5;
    //     }
    //     if (newSpeed === 0.99995) {
    //         newSpeed = 1.0;
    //     }
    //     setSettingInformaiton((prevSetting) => ({
    //         ...prevSetting,
    //         speed: newSpeed,
    //     }));
    // };
    const submitSelectedOptions = useCallback(() => {
        setSettingInformaiton({
            score: settingInformation.score,
            speedMode: settingInformation.speedMode,
            roomName: RsettingRoomName,
        });
        console.log(settingInformation);
        gameSocket.emit('ft_game_setting', settingInformation, (response: any) => {
            if (!response.success) 
                return
            alert(response.payload);
            console.log('게임 설정 요청', response);
        });
        console.log('게임 설정 로그');

        setModalStatus(true);
        handleClose();
    }, [settingInformation.roomName, settingInformation.score, settingInformation.speedMode]);

    return (
        <Box sx={style} tabIndex={-1} ref={modalRef}>

            <Box sx={settingBox}>

                <Box sx={{ ...settingBox, display: 'flex' }}>
                    <Typography
                        id="modal-modal-title"
                        style={{
                            color: 'var(--text-primary, #000)',
                            fontFamily: 'Pretendard',
                            fontSize: '16px',
                            fontStyle: 'normal',
                            fontWeight: '600',
                            lineHeight: '24px',
                        }}
                    >
                        점수 설정
                    </Typography>
                </Box>

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
                
                <Box sx={{ ...settingBox, display: 'flex' }}>
                    <Typography
                    id="modal-modal-title"
                    style={{
                        color: 'var(--text-primary, #000)',
                        fontFamily: 'Pretendard',
                        fontSize: '16px',
                        fontStyle: 'normal',
                        fontWeight: '600',
                        lineHeight: '24px',
                    }}
                    >
                    게임모드 설정
                    </Typography>
                </Box>

                <Box sx={buttonContainer}>
                    <FormControl>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={settingInformation.speedMode}
                            onChange={(event, value) => handleModeChange(event, value)}
                        >
                            <FormControlLabel value="0" control={<Radio />} label="일반모드" />
                            <FormControlLabel value="1" control={<Radio />} label="가속모드 " />
                        </RadioGroup>
                    </FormControl>
                </Box>

            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box>
                    <Button variant="contained" onClick={submitSelectedOptions}>
                        확인
                    </Button>
                    <Button sx={{ marginRight: '12px' }} onClick={submitSelectedOptions}>
                        취소
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default forwardRef(GameSettingContainer);