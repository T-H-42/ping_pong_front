import React from 'react';
import PingPongContainer from './PingPongContainer';
import PaddleManager from './PaddleManager';

const layout = () => {
    return (
        <>
            <PaddleManager />
            <PingPongContainer />
        </>
    );
};

export default layout;
