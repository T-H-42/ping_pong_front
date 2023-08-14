import React, { useContext, useEffect, useRef, useState } from 'react';
import PingPong from './PingPong';
import { SocketContext } from '../../api/SocketContext';
import { useRecoilValue } from 'recoil';
import { isOwnerState, settingRoomNameState } from '../../api/atoms';

interface IGameElement {
    leftPaddle: Paddle;
    rightPaddle: Paddle;
    ball: Ball;
    score: Score;
}

interface Paddle {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Ball {
    x: number;
    y: number;
    radius: number;
}

interface Score {
    left: number;
    right: number;
}

type canvasSize = {
    width: number;
    height: number;
};
const PingPongContainer = () => {
    console.log('레이아웃 업데이트');

    const [test, setTest] = useState(0);
    const { gameSocket } = useContext(SocketContext);
    const RsettingRoomName = useRecoilValue(settingRoomNameState);
    const RisOwner = useRecoilValue(isOwnerState);
    // const [keyPressed, setKeyPressed] = useState<number>(0);
    const [canvasSize, setCanvasSize] = useState<canvasSize>({ width: 600, height: 400 });
    const [innerSize, setInnerSize] = useState({ width: window.innerWidth * 0.8, height: window.innerHeight * 0.8 });
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const cvs = canvasRef.current;

    // const cvs = canvasRef.current;
    // // console.log('에쓰씨비', cvs);

    // const ctx = cvs.getContext('2d');

    const positionUpdateHandler = (response) => {
        // console.log('positionUpdateHandler 호출 완료');
        const gameElement = {
            leftPaddle: response.GameElement.leftPaddle,
            rightPaddle: response.GameElement.rightPaddle,
            ball: response.GameElement.ball,
            score: response.GameElement.score,
        };
        // Back에서 받아온 객체 정보를 화면에 랜더링하는 함수
        PingPong(canvasRef, gameElement);
    };
    gameSocket.on('ft_position_update', positionUpdateHandler);


    // PingPong(canvasRef, gameElement);
    useEffect(() => {
        const handleResize = () => {
            setInnerSize({ width: window.innerWidth * 0.8, height: window.innerHeight * 0.8 });
        };
        window.addEventListener('resize', handleResize);
        amazing(innerSize.width, innerSize.height);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [innerSize.width, innerSize.height]);

    const amazing = (width, height) => {
        const what = width * 2 > height * 3 ? true : false;
        if (what) setCanvasSize({ width: (height * 3) / 2, height: height });
        else setCanvasSize({ width: width, height: (width * 2) / 3 });
        // console.log('amazing', width, height);
    };

    return (
        <>
            <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} />
        </>
    );
};

export default PingPongContainer;
