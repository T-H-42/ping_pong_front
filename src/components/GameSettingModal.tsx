import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const settingBox = {
    display: 'flex',
    'align-items': 'center',
    'flex-direction': 'column',
};

const buttonContainer = {
    width: '80%',
    display: 'flex',
    'justify-content': 'space-evenly',
};

export default function GameSettingModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button onClick={handleOpen}>Open modal</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box sx={settingBox}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            점수 설정
                        </Typography>
                        <Box sx={buttonContainer}>
                            <Button variant="contained">3</Button>
                            <Button variant="contained">7</Button>
                            <Button variant="contained">11</Button>
                        </Box>
                    </Box>
                    <Box sx={settingBox}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            게임속도 설정
                        </Typography>
                        <Box sx={buttonContainer}>
                            <Button variant="contained">보통</Button>
                            <Button variant="contained">빠르게</Button>
                            <Button variant="contained">매우 빠르게</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
