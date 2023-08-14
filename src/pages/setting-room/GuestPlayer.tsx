import { Backdrop, Box, Button, Container, Typography } from '@mui/material';
import { isOwnerState } from '../../api/atoms';
import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

const GuestPlayer = ({ onReady, handleBackdropClose, onReadyToggle, backdrop }) => {
    const RisOwner = useRecoilValue(isOwnerState);

    // useEffect(() => {}, []);
    return (
        <Container
            sx={{
                position: 'relative', // 추가된 스타일
                width: '60vw',
                height: '50vh',
                backgroundColor: 'darkgray',
                display: 'flex',
                justifyCcontent: ' center',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '90%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <Box sx={{ width: '100%', height: '15%', justifyContent: 'space-between', display: 'flex' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '15%', alignItems: 'center' }}>
                        <img
                            src="https://www.gravatar.com/avatar/HASH"
                            alt="user_image"
                            style={{ width: '30%', borderRadius: '50%' }}
                        />
                        <Typography variant="h6">김핑퐁</Typography>
                    </Box>
                    {!RisOwner && (
                        <Button
                            variant="contained"
                            onClick={onReadyToggle}
                            style={{
                                backgroundColor: onReady ? '' : 'lightgray', // 대기중일 때 색상 제거
                            }}
                        >
                            {onReady ? '준비 취소' : '준비'}
                        </Button>
                    )}
                </Box>
                <Box sx={{ width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'space-around' }}>
                    <Box
                        sx={{
                            width: '100%',
                            height: '60%',
                            backgroundColor: 'lightgray',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        {backdrop && (
                            <Backdrop
                                sx={{
                                    position: 'absolute', // 추가된 스타일
                                    top: 0, // 추가된 스타일
                                    left: 0, // 추가된 스타일
                                    width: '100%', // 수정된 스타일
                                    height: '100%', // 수정된 스타일
                                    color: '#fff',
                                    zIndex: (theme) => theme.zIndex.drawer + 1,
                                }}
                                open={backdrop}
                                onClick={handleBackdropClose}
                            >
                                <div>Ready</div>
                            </Backdrop>
                        )}
                        <Box sx={{ width: '80%', height: '90%', margin: '0 auto' }}>
                            <Typography variant="h6">전적</Typography>
                            <Box sx={{ width: '100%', display: 'flex', justifyCcontent: 'space-around' }}>
                                <p>23.07.10</p>
                                <p>WIN</p>
                                <p>김핑퐁</p>
                            </Box>
                            <Box sx={{ width: '100%', display: 'flex', justifyCcontent: 'space-around' }}>
                                <p>23.07.10</p>
                                <p>WIN</p>
                                <p>김핑퐁</p>
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            width: '100%',
                            height: '15%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: 'lightgray',
                        }}
                    >
                        <Box
                            sx={{
                                width: '80%',
                                height: '100%',
                                margin: '0 auto',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="h6" sx={{ width: '20%' }}>
                                업적
                            </Typography>
                            <Box sx={{ display: 'flex', width: '30%', height: '100%' }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        height: '100%',
                                    }}
                                >
                                    <img
                                        src="https://www.gravatar.com/avatar/HASH"
                                        alt="user_image"
                                        style={{ width: '30%', borderRadius: '50%', marginTop: '5px' }}
                                    />
                                    <p>수다의 신</p>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        height: '100%',
                                    }}
                                >
                                    <img
                                        src="https://www.gravatar.com/avatar/HASH"
                                        alt="user_image"
                                        style={{ width: '30%', borderRadius: '50%', marginTop: '5px' }}
                                    />
                                    <p>장사의 신</p>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default GuestPlayer;
