import React, { useEffect } from 'react';

interface HeartBeatProps {
  gameId: string;
  name: string;
}
const apiUrl = import.meta.env.VITE_API_URL;

const HeartBeat: React.FC<HeartBeatProps> = ({
  gameId,
  name
}) => {
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`http://${apiUrl}:4000/heartbeat/${gameId}/${name}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to sand a heart beat");
        }
      })
      .catch((error) => {
        console.error("Error sanding heart beat:", error);
      });

    }, 10000); // Send heartbeat every 10 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return null; // This component doesn't render anything
};

export default HeartBeat;
