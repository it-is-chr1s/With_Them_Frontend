// GameCanvas.tsx
import React, { useRef, useEffect } from "react";

interface PlayerPositionAndColor {
  x: number;
  y: number;
  color: string;
  isAlive: boolean;
}

interface Position {
  x: number;
  y: number;
}

interface TaskPosition {
  x: number;
  y: number;
  taskType: string;
  id: number;
}

interface StateOfTasks {
  [id: number]: string;
}

interface GameCanvasProps {
  players: Map<string, PlayerPositionAndColor>;
  walls: Position[];
  tasks: TaskPosition[];
  meeting: Position;
  stateOfTasks: StateOfTasks;
  height: number;
  width: number;
  name: string;
}

type IdColors = {
  [key: number]: string;
};

const cellSize = 30;
const cavnasHeight = 9 * 3;
const cavnasWidth = 16 * 3;

const idColors = {} as IdColors;

const GameCanvas: React.FC<GameCanvasProps> = ({
  players,
  walls,
  tasks,
  meeting,
  stateOfTasks,
  name,
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

      console.log("meeting position: ", meeting.x, meeting.y);

      //Draw meeting
      context.fillStyle = "red";

      if (meeting.x != -1 && meeting.y != -1) {
        context.fillRect(
          meeting.x * cellSize + cellSize / 2,
          meeting.y * cellSize + cellSize / 2,
          cellSize,
          cellSize
        );
      }

      // Draw tasks
      tasks.forEach((task) => {
        if (task.id in stateOfTasks) {
          if (stateOfTasks[task.id] === "available") {
            context.fillStyle = "red";
          } else if (stateOfTasks[task.id] === "active") {
            context.fillStyle = "rgb(255, 109, 31)";
          }
        } else {
          context.fillStyle = "rgb(31, 255, 42)";
        }
        context.fillRect(
          task.x * cellSize + cellSize / 2,
          task.y * cellSize + cellSize / 2,
          cellSize,
          cellSize
        );

        context.fillStyle = idColors[task.id];
        context.fillRect(
          task.x * cellSize + cellSize / 2,
          task.y * cellSize + cellSize / 2,
          cellSize,
          cellSize / 5
        );
        context.fillRect(
          task.x * cellSize + cellSize / 2,
          task.y * cellSize + (cellSize * 13) / 10,
          cellSize,
          cellSize / 5
        );

        context.fillStyle = "black";
        context.textAlign = "center";
        context.textBaseline = "middle";
        const fontSize = 6;
        context.font = "6px Arial";
        const textX = (task.x + 1) * cellSize;
        const textY = (task.y + 1.1) * cellSize;

        const lines = task.taskType.split(" ");

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
        context.fillStyle = position.color;
        if (!position.isAlive) {
          context.fillStyle = "black";
        }
        context.beginPath();
        context.arc(
          position.x * cellSize + cellSize / 2,
          position.y * cellSize + cellSize / 2,
          10,
          0,
          2 * Math.PI
        );
        context.font = "8px Arial";
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
  }, [players, walls, name]);

  useEffect(() => {
    tasks.forEach((task) => {
      if (!(task.id in idColors)) {
        idColors[task.id] = getRandomColor();
      }
    });
  }, [tasks]);

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

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
