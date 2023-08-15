import React, { useState } from 'react';
import PingPongContainer from './PingPongContainer';
import PaddleManager from './PaddleManager';
import ModalContainer from '../../components/ModalContainer';
import GameResultContainer from './GameResultContainer';

const Layout = () => {
    return (
        <>
            <PaddleManager />
            <PingPongContainer />
        </>
    );
};

export default Layout;
