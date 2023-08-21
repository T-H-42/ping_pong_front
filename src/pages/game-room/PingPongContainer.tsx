import React, { useContext, useEffect, useRef, useState } from 'react';
import PingPong from './PingPong';
import { SocketContext } from '../../api/SocketContext';
import { useRecoilValue } from 'recoil';
import { isOwnerState, settingRoomNameState } from '../../api/atoms';
import ModalContainer from '../../components/ModalContainer';
import GameResultContainer from './GameResultContainer';

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
    const [gameResult, setGameResult] = useState(false);
    const [open, setOpen] = useState(false);

    const { gameSocket } = useContext(SocketContext);
    const RsettingRoomName = useRecoilValue(settingRoomNameState);
    const RisOwner = useRecoilValue(isOwnerState);
    // const [keyPressed, setKeyPressed] = useState<number>(0);
    const [canvasSize, setCanvasSize] = useState<canvasSize>({ width: 600, height: 400 });
    const [innerSize, setInnerSize] = useState({ width: window.innerWidth * 0.8, height: window.innerHeight * 0.8 });
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const modalRef = useRef();

    const handleClose = () => {
        setOpen(true);
    };

    useEffect(() =>{
        const positionUpdateHandler = (response) => {
            const gameElement = {
                leftPaddle: response.GameElement.leftPaddle,
                rightPaddle: response.GameElement.rightPaddle,
                ball: response.GameElement.ball,
                score: response.GameElement.score,
            };
            // Back에서 받아온 객체 정보를 화면에 랜더링하는 함수
            PingPong(canvasRef, gameElement); //위에서 받아온 canvasRef와 gameElement를 인자로 받아 변경된 캔버스의 값에 따라 그려준다.
        };
        
        const checkGameOver = (response) => {
            if (!response) return alert(`${response} : 에러가 발생했습니다.`);
            setOpen(true);
            console.log('게임 결과로 넘어온', response);
            
            response.isOwnerWin ? setGameResult(true) : setGameResult(false);
        };
        
        const checkErrorOver = (response) => {
            if (!response) return alert(`${response} : 에러가 발생했습니다.`); //1 세팅룸 2 게임룰
            setOpen(true);
            response.isOwner ? setGameResult(true) : setGameResult(false);
        };
        gameSocket.on('ft_finish_game', checkGameOver); // 게임 종료 이벤트
        gameSocket.on('ft_position_update', positionUpdateHandler); // 게임 좌표 업데이트 해주는 이벤트
        gameSocket.on('ft_enemy_leave_room', checkErrorOver);
        
        return (() => {
            gameSocket.off('ft_finish_game', checkGameOver); // 게임 종료 이벤트
            gameSocket.off('ft_position_update', positionUpdateHandler); // 게임 좌표 업데이트 해주는 이벤트
            gameSocket.off('ft_enemy_leave_room', checkErrorOver);
        })
    }, [gameSocket])

    const reRenderCanvasSize = (width, height) => {
        const what = width * 2 > height * 3 ? true : false;
        if (what) setCanvasSize({ width: (height * 3) / 2, height: height });
        else setCanvasSize({ width: width, height: (width * 2) / 3 }); // 동적인 비율로 캔버스를 width, height를 설정해준다.
    };

    useEffect(() => {
        // 화면의 리사이징이 발생할 때마다 캔버스의 크기를 조정해준다.
        const handleResize = () => {
            setInnerSize({ width: window.innerWidth * 0.8, height: window.innerHeight * 0.8 });
        };
        window.addEventListener('resize', handleResize);
        reRenderCanvasSize(innerSize.width, innerSize.height);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [innerSize.width, innerSize.height]);

    return (
        <>
            {open && (
                <ModalContainer open={open} handleClose={handleClose}>
                    <GameResultContainer open={open} setOpen={setOpen} gameResult={gameResult} ref={modalRef} />
                </ModalContainer>
            )}

            <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} />
        </>
    );
};

export default PingPongContainer;
