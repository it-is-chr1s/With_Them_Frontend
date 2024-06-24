import React, { useRef, useEffect } from "react";

const Minimap = ({
  walls,
  tasks,
  playerPosition,
  width,
  height,
  scaleFactor = 1,
}) => {
  const canvasRef = useRef(null);

  const drawMinimap = (ctx) => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "gray";
    walls.forEach((wall) => {
      ctx.fillRect(
        wall.x * scaleFactor,
        wall.y * scaleFactor,
        scaleFactor,
        scaleFactor
      );
    });
    ctx.fillStyle = "blue";
    tasks.forEach((task) => {
      ctx.fillRect(
        task.x * scaleFactor,
        task.y * scaleFactor,
        scaleFactor,
        scaleFactor
      );
    });
    ctx.fillStyle = "red";
    ctx.fillRect(
      playerPosition.x * scaleFactor - 4 / 2,
      playerPosition.y * scaleFactor - 4 / 2,
      4,
      4
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    drawMinimap(context);
  }, [walls, tasks, playerPosition, scaleFactor]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ backgroundColor: "#000" }}
    />
  );
};

export default Minimap;
