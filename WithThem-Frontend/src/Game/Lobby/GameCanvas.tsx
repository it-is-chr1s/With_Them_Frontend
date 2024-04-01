import React, { useRef, useEffect } from "react";

interface PlayerPosition {
  x: number;
  y: number;
}

interface WallPosition {
  x: number;
  y: number;
}

interface GameCanvasProps {
  players: Map<string, PlayerPosition>;
  walls: WallPosition[];
  name: string;
}

const cellSize = 30;
const gridSize = 20;
const GameCanvas: React.FC<GameCanvasProps> = ({ players, walls, name }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawGame = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const currentPlayerPosition = players.get(name);

    if (context && canvas && currentPlayerPosition) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const playerX = currentPlayerPosition.x * cellSize;
      const playerY = currentPlayerPosition.y * cellSize;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();

      // center camera on player position
      context.translate(centerX / 1 - playerX, centerY / 1 - playerY);

      // Draw walls
      context.fillStyle = "black";
      walls.forEach((wall) => {
        context.fillRect(
          wall.x * cellSize + cellSize / 2,
          wall.y * cellSize + cellSize / 2,
          cellSize,
          cellSize
        );
      });

      // Draw players
      players.forEach((position, playerId) => {
        context.fillStyle = "red";
        context.beginPath();
        context.arc(
          position.x * cellSize + cellSize / 2,
          position.y * cellSize + cellSize / 2,
          10,
          0,
          2 * Math.PI
        );
        context.fillText(
          playerId,
          position.x * cellSize,
          position.y * cellSize - 5
        );
        context.fill();
      });

      context.restore();
    }
  };

  useEffect(() => {
    drawGame();
  }, [players, walls, name]);

  return (
    <canvas
      ref={canvasRef}
      width={gridSize * cellSize}
      height={gridSize * cellSize}
      style={{ border: "1px solid #000" }}
    ></canvas>
  );
};

export default GameCanvas;
