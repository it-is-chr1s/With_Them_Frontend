// GameCanvas.tsx
import React, { useRef, useEffect } from "react";

interface PlayerPosition {
  x: number;
  y: number;
}

interface WallPosition {
  x: number;
  y: number;
}

interface TaskPosition {
  x: number;
  y: number;
  taskType: string
}

interface GameCanvasProps {
  players: Map<string, PlayerPosition>;
  walls: WallPosition[];
  tasks: TaskPosition[];
  height: number;
  width: number;
  name: string;
  selectedColor: string; // New prop for selected color
}

const cellSize = 30;
const cavnasHeight = 9 * 3;
const cavnasWidth = 16 * 3;

const GameCanvas: React.FC<GameCanvasProps> = ({
  players,
  walls,
  tasks,
  name,
  selectedColor, // Receive selected color as a prop
  height,
  width,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawGame = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const currentPlayerPosition = players.get(name);

    if (context && canvas && currentPlayerPosition) {
      const zoomLevel = 2;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const playerX = currentPlayerPosition.x * cellSize;
      const playerY = currentPlayerPosition.y * cellSize;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();

      // Apply zoom
      context.scale(zoomLevel, zoomLevel);

      context.translate(
        centerX / zoomLevel - playerX,
        centerY / zoomLevel - playerY
      );

      // Draw map borders
      context.fillStyle = "#000";
      for (let x = 0; x <= width; x++) {
        context.fillRect(
          x * cellSize - cellSize,
          -cellSize,
          cellSize + cellSize,
          cellSize
        );
        context.fillRect(x * cellSize, height * cellSize, cellSize, cellSize);
      }
      for (let y = 0; y <= height; y++) {
        context.fillRect(-cellSize, y * cellSize, cellSize, cellSize);
        context.fillRect(width * cellSize, y * cellSize, cellSize, cellSize);
      }

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

      // Draw tasks
      tasks.forEach((task) => {
        context.fillStyle = "red";
        context.fillRect(
          task.x * cellSize + cellSize / 2,
          task.y * cellSize + cellSize / 2,
          cellSize,
          cellSize
        );
        context.fillStyle = "black";
        context.textAlign = "center";
        context.textBaseline = "middle";
        const fontSize = 6;
        context.font = '6px Arial';
        const textX = (task.x + 1) * cellSize;
        const textY = (task.y + 1.1) * cellSize;

        const lines = task.taskType.split(' ');

        const lineHeight = fontSize * 1.2;
        const totalHeight = lines.length * lineHeight;

        let adjustedTextY = textY - totalHeight / 2;

        lines.forEach((line, index) => {
            const lineY = adjustedTextY + index * lineHeight;
            context.fillText(line, textX, lineY);
        });
        
      });

      // Draw players
      players.forEach((position, playerId) => {
        context.fillStyle = selectedColor; // Use selected color
        context.beginPath();
        context.arc(
          position.x * cellSize + cellSize / 2,
          position.y * cellSize + cellSize / 2,
          10,
          0,
          2 * Math.PI
        );
        context.font = '8px Arial';
        context.fillText(
          playerId,
          (position.x + 0.5) * cellSize,
          position.y * cellSize - 5
        );
        context.fill();
      });

      context.restore();
    }
  };

  useEffect(() => {
    drawGame();
  }, [players, walls, name, selectedColor]); // Update when selected color changes

  return (
    <canvas
      ref={canvasRef}
      width={cavnasWidth * cellSize}
      height={cavnasHeight * cellSize}
      style={{ border: "1px solid #000" }}
    ></canvas>
  );
};

export default GameCanvas;
