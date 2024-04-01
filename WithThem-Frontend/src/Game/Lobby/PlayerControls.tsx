import React, { useEffect, useState } from "react";

interface PlayerControlsProps {
  onMove: (direction: string) => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ onMove }) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setPressedKeys((prev) => new Set(prev).add(event.key));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setPressedKeys((prev) => {
        const newKeys = new Set(prev);
        newKeys.delete(event.key);
        return newKeys;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const direction = determineDirection(Array.from(pressedKeys));
    if (direction) {
      onMove(direction);
    }
  }, [pressedKeys, onMove]);

  return null;
};

const determineDirection = (keys: string[]): string | null => {
  let direction = null;
  if (keys.includes("w") && keys.includes("a")) direction = "NORTHWEST";
  else if (keys.includes("w") && keys.includes("d")) direction = "NORTHEAST";
  else if (keys.includes("s") && keys.includes("a")) direction = "SOUTHWEST";
  else if (keys.includes("s") && keys.includes("d")) direction = "SOUTHEAST";
  else if (keys.includes("w")) direction = "NORTH";
  else if (keys.includes("s")) direction = "SOUTH";
  else if (keys.includes("a")) direction = "WEST";
  else if (keys.includes("d")) direction = "EAST";
  return direction;
};

export default PlayerControls;
