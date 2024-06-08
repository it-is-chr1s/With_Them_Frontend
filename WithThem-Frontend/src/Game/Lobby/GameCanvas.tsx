// GameCanvas.tsx
import React, { useRef, useEffect, useState } from "react";
import sprite1 from "/src/assets/sprites/characters/red/frame-1.png";
import sprite2 from "/src/assets/sprites/characters/red/frame-2.png";
import sprite3 from "/src/assets/sprites/characters/brown/frame-1.png";
import sprite4 from "/src/assets/sprites/characters/brown/frame-2.png";
import sprite5 from "/src/assets/sprites/characters/orange/frame-1.png";
import sprite6 from "/src/assets/sprites/characters/orange/frame-2.png";
import sprite7 from "/src/assets/sprites/characters/yellow/frame-1.png";
import sprite8 from "/src/assets/sprites/characters/yellow/frame-2.png";
import sprite9 from "/src/assets/sprites/characters/lime/frame-1.png";
import sprite10 from "/src/assets/sprites/characters/lime/frame-2.png";
import sprite11 from "/src/assets/sprites/characters/green/frame-1.png";
import sprite12 from "/src/assets/sprites/characters/green/frame-2.png";
import sprite13 from "/src/assets/sprites/characters/cyan/frame-1.png";
import sprite14 from "/src/assets/sprites/characters/cyan/frame-2.png";
import sprite15 from "/src/assets/sprites/characters/blue/frame-1.png";
import sprite16 from "/src/assets/sprites/characters/blue/frame-2.png";
import sprite17 from "/src/assets/sprites/characters/navy/frame-1.png";
import sprite18 from "/src/assets/sprites/characters/navy/frame-2.png";
import sprite19 from "/src/assets/sprites/characters/purple/frame-1.png";
import sprite20 from "/src/assets/sprites/characters/purple/frame-2.png";
import sprite21 from "/src/assets/sprites/characters/magenta/frame-1.png";
import sprite22 from "/src/assets/sprites/characters/magenta/frame-2.png";
import sprite23 from "/src/assets/sprites/characters/pink/frame-1.png";
import sprite24 from "/src/assets/sprites/characters/pink/frame-2.png";
import sprite25 from "/src/assets/sprites/characters/gray/frame-1.png";
import sprite26 from "/src/assets/sprites/characters/gray/frame-2.png";

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
const cavnasHeight = 9 * 4 * cellSize;
const cavnasWidth = 16 * 4 * cellSize;

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
  const colorToSpriteMap = {
    "#ff0000": [sprite1, sprite2],
    "#994C00": [sprite3, sprite4],
    "#ff8000": [sprite5, sprite6],
    "#ffff00": [sprite7, sprite8],
    "#80ff00": [sprite9, sprite10],
    "#1FA61A": [sprite11, sprite12],
    "#00ffff": [sprite13, sprite14],
    "#0080ff": [sprite15, sprite16],
    "#0000ff": [sprite17, sprite18],
    "#8000ff": [sprite19, sprite20],
    "#ff0080": [sprite21, sprite22],
    "#ff8080": [sprite23, sprite24],
    "#808080": [sprite25, sprite26],
  };
  const [sprites, setSprites] = useState({} as any);

  useEffect(() => {
    const loadedSprites = {} as any;
    Object.entries(colorToSpriteMap).forEach(([color, paths]) => {
      loadedSprites[color] = paths.map((path) => {
        const img = new Image();
        img.src = path;
        img.onload = () => console.log(`Sprite for ${color} loaded`);
        return img;
      });
    });
    setSprites(loadedSprites);
  }, []);

  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prevIndex) => (prevIndex + 1) % 2);
    }, 200);

    return () => clearInterval(interval);
  }, []);

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

      players.forEach((position, playerId) => {
        if (
          position.isAlive ||
          playerId === name ||
          (!position.isAlive && !players.get(name)?.isAlive)
        ) {
          const spriteWidth = cellSize;
          const spriteHeight = cellSize;
          let imageX = position.x * cellSize - spriteWidth / 2;
          let imageY = position.y * cellSize - spriteHeight / 2;

          if (!position.isAlive) {
            context.globalAlpha = 0.5;
          }

          const spritesForColor = sprites[position.color];
          if (spritesForColor && spritesForColor.length > frameIndex) {
            context.drawImage(
              spritesForColor[frameIndex],
              imageX,
              imageY,
              spriteWidth,
              spriteHeight
            );
          }

          context.globalAlpha = 1.0;
          context.fillStyle = position.color;
          context.font = "8px Arial";
          context.fillText(
            playerId,
            position.x * cellSize,
            (position.y - 0.5) * cellSize
          );
        }

        if (!position.isAlive) {
          context.strokeStyle = position.color;
          context.fillStyle = position.color;
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
      className="overflow-hidden"
      ref={canvasRef}
      width={cavnasWidth}
      height={cavnasHeight}
      style={{ border: "1px solid #000" }}
    ></canvas>
  );
};

export default GameCanvas;
