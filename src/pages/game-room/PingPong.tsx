import { useEffect, RefObject, useState } from 'react';

interface Paddle {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Score {
    left: number;
    right: number;
}

interface Ball {
    x: number;
    y: number;
    radius: number;
}

// interface Ball {
//     x: number;
//     y: number;
//     radius: number;
//     speed: number;
//     velocityX: number;
//     velocityY: number;
//     color: string;
// }

interface Net {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
}

const PingPong = (canvasRef: RefObject<HTMLCanvasElement>, gameElement): void => {
    if (!canvasRef.current) return;

    const cvs = canvasRef.current;

    const ctx = cvs.getContext('2d'); // 캔버스의 속성 중 하나인 2D 렌더링 컨텍스트(CanvasRenderingContext2D)를 가져오는 역할을 한다.
    if (!ctx) return;

    const net: Net = {
        x: cvs.width / 2 - 1,
        y: 0,
        width: 2,
        height: 10,
        color: 'WHITE',
    };

    const leftPaddle: Paddle = {
        x: (gameElement.leftPaddle.x * cvs.width) / 100,
        y: (gameElement.leftPaddle.y * cvs.height) / 100,
        width: (gameElement.leftPaddle.width * cvs.width) / 100,
        height: (gameElement.leftPaddle.height * cvs.height) / 100,
    };

    const rightPaddle: Paddle = {
        x: (gameElement.rightPaddle.x * cvs.width) / 100,
        y: (gameElement.rightPaddle.y * cvs.height) / 100,
        width: (gameElement.rightPaddle.width * cvs.width) / 100,
        height: (gameElement.rightPaddle.height * cvs.height) / 100,
    };

    const ball: Ball = {
        x: (gameElement.ball.x * cvs.width) / 100,
        y: (gameElement.ball.y * cvs.height) / 100,
        radius: (gameElement.ball.radius * ((cvs.width + cvs.height) / 2)) / 100,
    };

    const drawPaddle = (x: number, y: number, width: number, height: number, color: string): void => {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    };

    const drawScore = (score: number | undefined, x: number, y: number, color: string): void => {
        ctx.fillStyle = color;
        ctx.font = '45px Arial';
        ctx.fillText(score.toString(), x, y);
    };

    const drawNet = (): void => {
        for (let i = 0; i < cvs.height; i += 15) {
            drawPaddle(net.x, net.y + i, net.width, net.height, net.color);
        }
    };

    const drawBall = (x: number, y: number, radius: number, color: string): void => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
    };

    const render = (): void => {
        drawPaddle(0, 0, cvs.width, cvs.height, 'BLACK');
        drawScore(gameElement.score.left, cvs.width / 4, cvs.height / 5, 'WHITE');
        drawScore(gameElement.score.right, (3 * cvs.width) / 4, cvs.height / 5, 'WHITE');
        drawNet();
        drawPaddle(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, 'WHITE');
        drawPaddle(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, 'WHITE');
        drawBall(ball.x, ball.y, ball.radius, 'WHITE');
    };
    const game = (): void => {
        render();
    };

    game();
};

export default PingPong;
