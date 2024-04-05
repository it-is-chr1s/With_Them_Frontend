import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import GameCanvas from "./GameCanvas";
import PlayerControls from "./PlayerControls";
import { useLocation } from "react-router-dom";
import ButtonComponent from "../../components/ButtonComponent";
import ChooseColorPopup from "../../components/ChooseCollorPopup";
import InGameButton from "./InGameButton";
import Popup from "../../components/Popup";
import ConnectingWires from "./ConnectingWires";

const GameComponent: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<string>("gray");

  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const [connected, setConnected] = useState<boolean>(false);
  const location = useLocation();
  const username = location.state?.username;
  const [name] = useState(username);
  const stompClientMap = useRef<Client | null>(null);
  const stompClientTasks = useRef<Client | null>(null)
  const [players, setPlayers] = useState<Map<string, { x: number; y: number }>>(
    new Map()
  );
  const [useEnabled, setUseEnabled] = useState<boolean>(false);
  const [walls, setWalls] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stateOfTasks, setStateOfTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [mapHeight, setMapHeight] = useState(0);
  const [mapWidth, setMapWidth] = useState(0);

  const lobbyId = "123";

  useEffect(() => {
    stompClientTasks.current = new Client({
      brokerURL: 'ws://localhost:4001/ws',
      onConnect: () => {
        console.log("Connected to tasks websocket");
        stompClientTasks.current?.subscribe("/topic/tasks/stateOfTasks", (message) => {
          setStateOfTasks(JSON.parse(message.body));
          //setAvailableTasks(availableTasksWithOverhead.map((obj: any) => obj.id));
        })

        stompClientTasks.current?.subscribe("/topic/tasks/currentTask/" + name, (message) => {
          setCurrentTask(JSON.parse(message.body));
          console.log("Current task: ", message.body);
        })

        stompClientTasks.current?.publish({
          destination: "/app/tasks/requestStateOfTasks",
          body: lobbyId,
        });
      },
      onDisconnect: () => {
      },
      onWebSocketError: (error: Event) => {
        console.error("Error with websocket", error);
      },
      onStompError: (frame: any) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      }
    });

    stompClientTasks.current.activate();

    stompClientMap.current = new Client({
      brokerURL: "ws://localhost:4000/ws",
      onConnect: () => {
        setConnected(true);

        stompClientMap.current?.subscribe("/topic/mapLayout", (message) => {
          const mapDetails = JSON.parse(message.body);

          setWalls(mapDetails.wallPositions);
          setTasks(mapDetails.taskPositions);
          setMapHeight(mapDetails.height);
          setMapWidth(mapDetails.width);
        })//

        stompClientMap.current?.subscribe("/topic/position", (message) => {
          const positionUpdate = JSON.parse(message.body);
          //console.log("Position update received:", positionUpdate.position);
          setPlayers((prevPlayers) =>
            new Map(prevPlayers).set(
              positionUpdate.playerId,
              positionUpdate.position
            )
          );
        });

        stompClientMap.current?.subscribe("/topic/player/" + name + "/controlsEnabled/task", (message) => {
          setUseEnabled(message.body === "true");
        });

        stompClientMap.current?.publish({
          destination: "/app/requestMap",
          body: "{}",
        });
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onWebSocketError: (error: Event) => {
        console.error("Error with websocket", error);
      },
      onStompError: (frame: any) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    stompClientMap.current.activate();

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
    return () => {
      if (stompClientMap.current) {
        stompClientMap.current.deactivate();
      }
      if (stompClientTasks.current) {
        stompClientTasks.current.deactivate();
      }
    };
  }, [name]);

  const handleMove = (direction: string) => {
    if (connected && stompClientMap.current) {
      stompClientMap.current.publish({
        destination: "/app/move",
        body: JSON.stringify({ name, direction }),
      });
    }
  };

  const use = () => {
    const task = tasks.find(obj => obj.x === Math.floor(players.get(name).x) && obj.y === Math.floor(players.get(name).y));
    console.log("Task: ", task)
    stompClientTasks.current?.publish({
      destination: "/app/tasks/startTask",
      body: JSON.stringify({ lobby: lobbyId, id: task.id, player: name }),
    });
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setIsOpen(false);
  };
  return (
    <div className="container">
      {connected ? (
        <button
          onClick={() => {
            stompClientMap.current?.deactivate();
            setConnected(false);
          }}
        >
          Disconnect
        </button>
      ) : (
        <button
          onClick={() => {
            if (stompClientMap.current) {
              stompClientMap.current.activate();
              setConnected(true);
            }
          }}
        >
          Connect
        </button>
      )}

      <div>
        <PlayerControls onMove={handleMove} />
        <GameCanvas
          players={players}
          height={mapHeight}
          width={mapWidth}
          walls={walls}
          tasks={tasks}
          stateOfTasks={stateOfTasks}
          name={name}
          selectedColor={selectedColor}
        />
        {//<TaskPopup visible={true} task="Connecting Wires"/>
        }
        <Popup isOpen={true} onClose={() => {}}><ConnectingWires /></Popup> 
        <InGameButton onClick={use} label="use" active={useEnabled}></InGameButton>
      </div>
      
      <div className="flex justify-end">
        <ButtonComponent onClick={togglePopup} label="Choose color" />
        <ChooseColorPopup
          isOpen={isOpen}
          onClose={togglePopup}
          onColorSelect={handleColorSelect}
        />
      </div>
    </div>
  );
};

export default GameComponent;
