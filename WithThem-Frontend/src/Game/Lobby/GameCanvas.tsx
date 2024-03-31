import React, { useRef, useEffect } from "react";

interface PlayerPosition {
  x: number;
  y: number;
}

interface GameCanvasProps {
  players: Map<string, PlayerPosition>;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ players }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawGame = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (context) {
      if (canvas) context.clearRect(0, 0, canvas.width, canvas.height);

      players.forEach((position, playerId) => {
        context.beginPath();
        context.arc(position.x, position.y, 10, 0, 2 * Math.PI);
        context.fillText(playerId, position.x - 5, position.y - 15);
        context.fill();
      });
    }
  };

  useEffect(() => {
    drawGame();
  }, [players]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ border: "1px solid #000" }}
    ></canvas>
  );
};

export default GameCanvas;
