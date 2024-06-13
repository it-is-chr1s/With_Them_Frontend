import React, { useRef, useEffect } from "react";

const Minimap = ({ walls, tasks, playerPosition, width, height }) => {
  const canvasRef = useRef(null);

  const drawMinimap = (ctx) => {
    ctx.clearRect(0, 0, width, height); // Clear the canvas
    ctx.fillStyle = "gray";
    walls.forEach((wall) => {
      ctx.fillRect(wall.x * 2, wall.y * 2, 2, 2); // Scale down wall positions
    });
    ctx.fillStyle = "blue";
    tasks.forEach((task) => {
      ctx.fillRect(task.x * 2, task.y * 2, 2, 2); // Scale down task positions
    });
    // Draw the player
    ctx.fillStyle = "red";
    ctx.fillRect(playerPosition.x * 2, playerPosition.y * 2, 4, 4); // Emphasize player position
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    drawMinimap(context);
  }, [walls, tasks, playerPosition]);

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
