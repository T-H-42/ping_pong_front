import { Box, Button, Container } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router';
import styles from './gameRoom.module.css';
const GameResultContainer = ({ open, setOpen, gameResult }) => {
    const navigate = useNavigate();

    return (
        <Box className={styles.container}>
            <Box>
                <h2 style={{ textAlign: 'center', fontSize: '20px' }}>승리</h2>
                <Button
                    onClick={() => setOpen(false)}
                    style={{ position: 'absolute', top: '24px', right: '24px', textAlign: 'right' }}
                >
                    X
                </Button>
            </Box>
            <Box style={{ width: '100%', textAlign: 'center' }}>{gameResult}! 승리하셨습니다!</Box>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    style={{
                        borderRadius: '4px',
                        backgroundColor: '#3874CB',
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                    }}
                    onClick={() => navigate('/')}
                >
                    홈으로 돌아가기
                </Button>
            </Box>
        </Box>
    );
};

export default GameResultContainer;
