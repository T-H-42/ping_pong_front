import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router';

const GoHomeButton = () => {
    const navigate = useNavigate();
    const goHome = () => {
        navigate('/main');
    };
    return (
        <Box sx={{ width: '104px', height: '39px', display: 'flex' }}>
            <Button onClick={goHome}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="19" viewBox="0 0 12 19" fill="none">
                    <path
                        d="M3.5502 9.49999L10.9002 16.85C11.1502 17.1 11.271 17.3917 11.2627 17.725C11.2544 18.0583 11.1252 18.35 10.8752 18.6C10.6252 18.85 10.3335 18.975 10.0002 18.975C9.66686 18.975 9.3752 18.85 9.1252 18.6L1.4252 10.925C1.2252 10.725 1.0752 10.5 0.975195 10.25C0.875195 9.99999 0.825195 9.74999 0.825195 9.49999C0.825195 9.24999 0.875195 8.99999 0.975195 8.74999C1.0752 8.49999 1.2252 8.27499 1.4252 8.07499L9.1252 0.374988C9.3752 0.124988 9.67103 0.00415485 10.0127 0.0124882C10.3544 0.0208215 10.6502 0.149988 10.9002 0.399988C11.1502 0.649988 11.2752 0.941655 11.2752 1.27499C11.2752 1.60832 11.1502 1.89999 10.9002 2.14999L3.5502 9.49999Z"
                        fill="#6F6F6F"
                    />
                </svg>
            </Button>
        </Box>
    );
};

export default GoHomeButton;
