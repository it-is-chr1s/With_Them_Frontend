// GameCanvas.tsx
import React, { useRef, useEffect } from "react";

interface PlayerPositionAndColor {
  x: number;
  y: number;
  color: string;
  isAlive: boolean;
  deathX: number;
  deathY: number;
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

interface GameCanvasProps {
  players: Map<string, PlayerPositionAndColor>;
  walls: Position[];
  tasks: TaskPosition[];
  meeting: Position;
  stateOfTasks: any;
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
      context.fillStyle = "black";
      for (let x = -13; x < width + 13; x++) {
        for (let i = 0; i < 10; i++) {
          context.fillRect(
            x * cellSize,
            -(1 + i) * cellSize,
            cellSize,
            cellSize
          );
          context.fillRect(
            x * cellSize,
            (height + i) * cellSize,
            cellSize,
            cellSize
          );
        }
      }
      for (let y = 0; y < height; y++) {
        for (let i = 0; i < 13; i++) {
          context.fillRect(
            (1 + i) * -cellSize,
            y * cellSize,
            cellSize,
            cellSize
          );
          context.fillRect(
            (width + i) * cellSize,
            y * cellSize,
            cellSize,
            cellSize
          );
        }
      }

      // Draw walls
      context.fillStyle = "black";
      walls.forEach((wall) => {
        context.fillRect(
          wall.x * cellSize,
          wall.y * cellSize,
          cellSize,
          cellSize
        );
      });

      //Draw meeting
      context.fillStyle = "red";

      if (meeting.x != -1 && meeting.y != -1) {
        context.fillRect(
          meeting.x * cellSize,
          meeting.y * cellSize,
          cellSize,
          cellSize
        );
      }

      // Draw tasks
      tasks.forEach((task) => {
        let task_index = -1;
        for (let i = 0; i < stateOfTasks.length; i++) {
          if (stateOfTasks[i].id == task.id) {
            task_index = i;
          }
        }
        if (task_index != -1) {
          if (stateOfTasks[task_index].state === "available") {
            context.fillStyle = "red";
          } else if (stateOfTasks[task_index].state === "active") {
            context.fillStyle = "rgb(255, 109, 31)";
          }
        } else {
          context.fillStyle = "rgb(31, 255, 42)";
        }
        context.fillRect(
          task.x * cellSize,
          task.y * cellSize,
          cellSize,
          cellSize
        );

        context.fillStyle = idColors[task.id];
        context.fillRect(
          task.x * cellSize,
          task.y * cellSize,
          cellSize,
          cellSize / 5
        );
        context.fillRect(
          task.x * cellSize,
          task.y * cellSize + (cellSize * 4) / 5,
          cellSize,
          cellSize / 5
        );

        context.fillStyle = "black";
        context.textAlign = "center";
        context.textBaseline = "middle";
        const fontSize = 6;
        context.font = "6px Arial";
        const textX = (task.x + 0.5) * cellSize;
        const textY = (task.y + 0.6) * cellSize;

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
        //console.log("player position: ", position.x, position.y);
        const currentPlayer = players.get(name);
        const isCurrentPlayer = playerId === name;

        context.fillStyle = position.color;
        if (
          position.isAlive ||
          isCurrentPlayer ||
          (currentPlayer && !currentPlayer.isAlive && !position.isAlive)
        ) {
          if (!position.isAlive) {
            context.fillStyle = "gray";
          }
          context.beginPath();
          context.arc(
            position.x * cellSize,
            position.y * cellSize,
            10,
            0,
            2 * Math.PI
          );
          context.fill();
          context.font = "8px Arial";
          context.fillText(
            playerId,
            position.x * cellSize,
            (position.y - 0.5) * cellSize
          );
          context.fill();
        }
        if (!position.isAlive) {
          context.strokeStyle = position.color;
          context.beginPath();
          context.lineWidth = 3;
          context.moveTo(
            position.deathX * cellSize - cellSize / 4,
            position.deathY * cellSize - cellSize / 4
          );
          context.lineTo(
            position.deathX * cellSize + cellSize / 4,
            position.deathY * cellSize + cellSize / 4
          );
          context.moveTo(
            position.deathX * cellSize + cellSize / 4,
            position.deathY * cellSize - cellSize / 4
          );
          context.lineTo(
            position.deathX * cellSize - cellSize / 4,
            position.deathY * cellSize + cellSize / 4
          );
          context.stroke();
          context.font = "8px Arial";
          context.fillText(
            playerId,
            position.deathX * cellSize,
            (position.deathY - 0.5) * cellSize
          );
        }

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
