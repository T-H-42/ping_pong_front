import { Box, Button } from '@mui/material';
import React, { forwardRef } from 'react';
import { useNavigate } from 'react-router';
import { isOwnerState } from '../../api/atoms';
import { useSetRecoilState } from 'recoil';

const GameResultContainer = ({ open, setOpen, gameResult }, modalRef) => {
    const navigate = useNavigate();
    const RsetIsOwner = useSetRecoilState<boolean>(isOwnerState);

    const goBackMain = () => {
        navigate('/main');
    };
    return (
        <Box sx={{   
            position: 'absolute',
            top: '50%',
            left: '50%',
            padding: '24px',
            transform: 'translate(-50%, -50%)',
            width: '31.6vw',
            height: '11.8vw',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            border: '2px solid #000',
            borderRadius: '1.5em',
            boxShadow: '0px 1px 8px 0px rgba(0, 0, 0, 0.16)',
          }}
       ref={modalRef} tabIndex={-1}>
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
