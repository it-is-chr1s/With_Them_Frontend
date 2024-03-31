import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";

const GameComponent: React.FC = () => {
  const [connected, setConnected] = useState<boolean>(false);
  const stompClient = useRef<Client | null>(null);

  useEffect(() => {
    stompClient.current = new Client({
      brokerURL: "ws://localhost:4000/ws", // Make sure this matches your server URL
      onConnect: () => {
        setConnected(true);
        // Subscribe to position updates
        stompClient.current?.subscribe("/topic/position", (message) => {
          const positionUpdate = JSON.parse(message.body);
          console.log("Position update received:", positionUpdate);
          // Update player positions in your game view here
        });
      },
      onWebSocketError: (error: Event) => {
        console.error("Error with websocket", error);
      },
      onStompError: (frame: any) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    stompClient.current.activate();

    // Handle keyboard events for movement
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log("handlekeydown: ", event.key);
      if (!stompClient.current) {
        return;
      }
      console.log(stompClient.current);

      let direction;
      switch (event.key) {
        case "ArrowUp":
          direction = "NORTH";
          break;
        case "ArrowDown":
          direction = "SOUTH";
          break;
        case "ArrowLeft":
          direction = "WEST";
          break;
        case "ArrowRight":
          direction = "EAST";
          break;
        default:
          return; // Ignore other keys
      }

      console.log("sending movement!");

      stompClient.current.publish({
        destination: "/app/move",
        body: JSON.stringify({ name: "01", direction }),
      });
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, []);

  return (
    <div className="container">
      {connected ? (
        <button
          onClick={() => {
            stompClient.current?.deactivate();
            setConnected(false);
          }}
        >
          Disconnect
        </button>
      ) : (
        <button
          onClick={() => {
            if (stompClient.current) {
              stompClient.current.activate();
              setConnected(true);
            }
          }}
        >
          Connect
        </button>
      )}
    </div>
  );
};

export default GameComponent;
