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

type testSize = {
    width: number;
    height: number;
};
const layout = () => {
    const { gameSocket } = useContext(SocketContext);
    const RsettingRoomName = useRecoilValue(settingRoomNameState);
    const RisOwner = useRecoilValue(isOwnerState);
    const [keyPressed, setKeyPressed] = useState<number>(0);
    const [testSize, setTestSize] = useState<testSize>({ width: 600, height: 400 });
    const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth, height: window.innerHeight });
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
        if (what) setTestSize({ width: (height * 3) / 2, height: height });
        else setTestSize({ width: width, height: (width * 2) / 3 });
        // console.log('amazing', width, height);
    };

    // gameSocket.emit('ft_paddle_move');

    useEffect(() => {
        const handleResize = () => {
            setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);
        amazing(canvasSize.width, canvasSize.height);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [canvasSize]);

    // const handleKeyDown = (event) => {
    //     if (event.key === 'ArrowUp') {
    //       setIsArrowUpPressed(true);
    //     }
    //   };

    //   const handleKeyUp = (event) => {
    //     if (event.key === 'ArrowUp') {
    //       setIsArrowUpPressed(false);
    //     }
    //   };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowUp') {
                setKeyPressed(1);
                movePaddle();
            } else if (event.key === 'ArrowDown') {
                setKeyPressed(2);
                movePaddle();
            }
        };
        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                setKeyPressed(0);
                movePaddle();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        const movePaddle = () => {
            gameSocket.emit('ft_paddle_move', {
                roomName: RsettingRoomName,
                isOwner: RisOwner,
                paddleStatus: keyPressed,
            });
        };
        // window.addEventListener('keypress', handleKeyDown);

        // RisOwner ? setUserSelector(true) : setUserSelector(false);

        // return () => {
        //     window.removeEventListener('keyup', handleKeyUp);
        //     window.removeEventListener('keydown', handleKeyDown);
        // };
    }, [keyPressed]);

    // useEffect(() => {
    //     if (RisOwner) {
    //         if (keyPressed === 'ArrowUp') {
    //             gameSocket.emit('ft_paddle_move', RisOwner);
    //         }
    //         if (keyPressed === 'ArrowDown') {
    //             gameSocket.emit('ft_paddle_move');
    //         }
    //     } else {
    //         if (keyPressed === 'ArrowUp') {
    //             gameSocket.emit('ft_paddle_move');
    //         }
    //         if (keyPressed === 'ArrowDown') {
    //             gameSocket.emit('ft_paddle_move');
    //         }
    //     }
    // }, []);
    return (
        <>
            <h1>React Game</h1>
            <canvas ref={canvasRef} width={testSize.width} height={testSize.height} />
        </>
    );
};

export default layout;
