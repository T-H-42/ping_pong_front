import { Box, Button, Container } from '@mui/material';
import React, { forwardRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import styles from './gameRoom.module.css';
import { isOwnerState } from '../../api/atoms';
import { useSetRecoilState } from 'recoil';

const GameResultContainer = ({ open, setOpen, gameResult }, modalRef) => {
    const navigate = useNavigate();
    const RsetIsOwner = useSetRecoilState<boolean>(isOwnerState);

    const goBackMain = () => {
        navigate('/');
    };
    return (
        <Box className={styles.container} ref={modalRef} tabIndex={-1}>
            <Box style={{ width: '100%', textAlign: 'center' }}>
                {gameResult ? '방장이' : '도전자가'} 승리하셨습니다!
            </Box>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    style={{
                        borderRadius: '4px',
                        backgroundColor: '#3874CB',
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                    }}
                    onClick={goBackMain}
                >
                    홈으로 돌아가기
                </Button>
            </Box>
        </Box>
    );
};

export default forwardRef(GameResultContainer);
