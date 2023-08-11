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
    const [gameElement, setGameElement] = useState<IGameElement | null>({
        leftPaddle: { x: 0, y: 0, width: 0, height: 0 },
        rightPaddle: { x: 0, y: 0, width: 0, height: 0 },
        ball: { x: 0, y: 0, radius: 0 },
        score: { left: 0, right: 0 },
    });

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const cvs = canvasRef.current;
    PingPong(canvasRef, gameElement);

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

    useEffect(() => {
        const positionUpdateHandler = (response) => {
            setGameElement((prev) => ({
                ...prev,
                leftPaddle: response.GameElement.leftPaddle,
                rightPaddle: response.GameElement.rightPaddle,
                ball: response.GameElement.ball,
                score: response.GameElement.score,
            }));
        };
        gameSocket.on('ft_position_update', positionUpdateHandler);
    }, [gameElement]);

    /* react에서 마우스 움직임 감지
    //마우스 위치가 바뀔 때마다 실행되는 함수
    //커서 위치가 패들보다 높거나 낮으면 emit 이벤트 발생
    //커서 위치가 패들보다 높으면 paddleUP = true, 낮으면 false */
    // const movePaddle = (event: KeyboardEvent): void => {
    //     const rect = cvs.getBoundingClientRect();
    //     const root: HTMLElement | null = document.documentElement;
    //     const mouseY: number = event.clientY - rect.top - root.scrollTop;
    //     gameElement.leftPaddle.y = mouseY - gameElement.leftPaddle.height / 2;
    // };

    // const handleKeyUp = (event: KeyboardEvent) => {
    //     setKeyPressed(event.key);
    // };
    // const handleKeyDown = (event: KeyboardEvent) => {
    //     setKeyPressed(event.key);
    // };
    // const movePaddle = (event: MouseEvent): void => {
    //     // const rect = cvs.getBoundingClientRect();
    //     const root: HTMLElement | null = document.documentElement;
    //     const mouseY: number = event.clientY - rect.top - root.scrollTop;
    //     gameElement.leftPaddle.y = mouseY - gameElement.leftPaddle.height / 2;
    // };

    const amazing = (width, height) => {
        const what = width * 2 > height * 3 ? true : false;
        if (what) setCanvasSize({ width: (height * 3) / 2, height: height });
        else setCanvasSize({ width: width, height: (width * 2) / 3 });
        // console.log('amazing', width, height);
    };

    // gameSocket.emit('ft_paddle_move');

    // const movePaddle = (newKeyPressed) => {
    //     gameSocket.emit('ft_paddle_move', {
    //         roomName: RsettingRoomName,
    //         isOwner: RisOwner,
    //         paddleStatus: newKeyPressed,
    //     });
    // };

    // useEffect(() => {
    //     setTest(test + 1);
    //     const handleKeyDown = async (event: KeyboardEvent) => {
    //         if (event.key === 'ArrowUp') {
    //             if (keyPressed !== 1) {
    //                 setKeyPressed(1);
    //                 movePaddle(1);
    //             }
    //         } else if (event.key === 'ArrowDown') {
    //             if (keyPressed !== 2) {
    //                 setKeyPressed(2);
    //                 movePaddle(2);
    //             }
    //             // console.log('ArrowDown key pressed');
    //         }
    //     };
    //     const handleKeyUp = (event: KeyboardEvent) => {
    //         if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    //             setKeyPressed(0);
    //             movePaddle(0);
    //         }
    //     };

    //     window.addEventListener('keydown', handleKeyDown);
    //     window.addEventListener('keyup', handleKeyUp);

    //     // console.log('키 이벤트 발생 !', test);
    //     // return () => {
    //     //     window.removeEventListener('keyup', handleKeyUp);
    //     //     window.removeEventListener('keydown', handleKeyDown);
    //     // };
    // }, [keyPressed]);

    return (
        <>
            <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} />
        </>
    );
};

export default PingPongContainer;
