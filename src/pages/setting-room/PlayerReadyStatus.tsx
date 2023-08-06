import { Box, Button, Container, Typography } from '@mui/material';
import React from 'react';

const PlayerReadyStatus = () => {
    return (
        <Container
            sx={{
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
                    <Button variant="contained">준비</Button>
                </Box>
                <Box
                    sx={{
                        width: '100%',
                        height: '60%',
                        backgroundColor: 'lightgray',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
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
                        justifyContent: 'space-between',
                        backgroundColor: 'lightgray',
                    }}
                >
                    <Box
                        sx={{
                            width: '80%',
                            height: '90%',
                            margin: '0 auto',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="h6">업적</Typography>
                        <Box sx={{ display: 'flex' }}>
                            <p>수다의 신</p>
                            <p>장사의 신</p>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default PlayerReadyStatus;
