import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import GameCanvas from "./GameCanvas";
import PlayerControls from "./PlayerControls";

const GameComponent: React.FC = () => {
  const [connected, setConnected] = useState<boolean>(false);
  const [name, setName] = useState("");
  const stompClient = useRef<Client | null>(null);
  const [players, setPlayers] = useState<Map<string, { x: number; y: number }>>(
    new Map()
  );
  const [walls, setWalls] = useState([]);

  useEffect(() => {
    stompClient.current = new Client({
      brokerURL: "ws://localhost:4000/ws",
      onConnect: () => {
        setConnected(true);

        stompClient.current?.subscribe("/topic/mapLayout", (message) => {
          const wallPositions = JSON.parse(message.body);

          console.log("got wall positions: ", wallPositions);
          setWalls(wallPositions);
        });

        stompClient.current?.subscribe("/topic/position", (message) => {
          const positionUpdate = JSON.parse(message.body);
          console.log("Position update received:", positionUpdate.position);
          setPlayers((prevPlayers) =>
            new Map(prevPlayers).set(
              positionUpdate.playerId,
              positionUpdate.position
            )
          );
        });

        stompClient.current?.publish({
          destination: "/app/requestMap",
          body: "{}",
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

    // const handleKeyDown = (event: KeyboardEvent) => {
    //   if (!stompClient.current) {
    //     return;
    //   }

    //   let direction;
    //   switch (event.key) {
    //     case "w":
    //       direction = "NORTH";
    //       break;
    //     case "s":
    //       direction = "SOUTH";
    //       break;
    //     case "a":
    //       direction = "WEST";
    //       break;
    //     case "d":
    //       direction = "EAST";
    //       break;
    //     default:
    //       return;
    //   }

    //   stompClient.current.publish({
    //     destination: "/app/move",
    //     body: JSON.stringify({ name: name, direction }),
    //   });
    // };

    // document.addEventListener("keydown", handleKeyDown);

    // return () => {
    //   document.removeEventListener("keydown", handleKeyDown);
    //   if (stompClient.current) {
    //     stompClient.current.deactivate();
    //   }
    // };
  }, [name]);

  const handleMove = (direction: string) => {
    if (stompClient.current) {
      stompClient.current.publish({
        destination: "/app/move",
        body: JSON.stringify({ name, direction }),
      });
    }
  };

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

      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter player name"
      />

      <div>
        <PlayerControls onMove={handleMove} />
        <GameCanvas players={players} walls={walls} name={name} />
      </div>
    </div>
  );
};

export default GameComponent;
