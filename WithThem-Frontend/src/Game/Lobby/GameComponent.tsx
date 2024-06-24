import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import GameCanvas from "./GameCanvas";
import PlayerControls from "./PlayerControls";
import { useNavigate, useLocation } from "react-router-dom";
import ButtonComponent from "../../components/ButtonComponent";
import ChooseColorPopup from "../../components/ChooseCollorPopup";
import InGameButton from "../../components/InGameButton";
import Popup from "../../components/Popup";
import ConnectingWires from "./Tasks/ConnectingWires";
import FileUploadDownload from "./Tasks/FileUploadDownload";
import TasksTodoList from "./Tasks/TasksTodoList";
import EmergencyMeetingPopup from "./EmergencyMeeting/EmergencyMeetingPopup";
import Settings from "./Settings";
import Chat from "./EmergencyMeeting/Chat";
import HeartBeat from "./HeartBeat";
import Minimap from "../minimap/Minimap";
import MinimapPopup from "../../components/MinimapPopup";

interface Sabotage{
  [key: number]: string;
}

interface SabotageData{
  availableSabotages: Sabotage[];
  cooldown: number;
  currentSabotageID: number;
  timer: number;
}

const apiUrl = import.meta.env.VITE_API_URL;

const GameComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inChat, setInChat] = useState(false);
  const [sabotageListIsOpen, setSabotageListIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  const toggleChat = () => {
    setInChat(!inChat);
  };
  const toggleSabotageList = () => {
    setSabotageListIsOpen(!sabotageListIsOpen);
  };

  const navigate = useNavigate();
  const leaveGame = () => {
    navigate("/");
  };
  const [startEmergencyMeeting, setStartMeeting] = useState(false);
  const [occupiedColors, setOccupiedColors] = useState<string[] | null>([
    "#0080ff",
  ]);
  const [connected, setConnected] = useState<boolean>(false);
  const [canKill, setCanKill] = useState<boolean>(false);
  const location = useLocation();
  const GameId = location.state?.gameId;
  const [gameId] = useState(GameId);
  const username = location.state?.username;
  const [name] = useState(username);
  const stompClientMap = useRef<Client | null>(null);
  const stompClientTasks = useRef<Client | null>(null);
  const stompClientSabotages = useRef<Client | null>(null);
  const stompClientMeeting = useRef<Client | null>(null);
  const [players, setPlayers] = useState<
    Map<
      string,
      {
        x: number;
        y: number;
        color: string;
        isAlive: boolean;
        deathX: number;
        deathY: number;
      }
    >
  >(new Map());

  const isPlayerAlive = players.get(name)?.isAlive || false;
  const [minimapPopupOpen, setMinimapPopupOpen] = useState(false);

  const [useEnabled, setUseEnabled] = useState<boolean>(false);
  const [onMeetingField, setOnMeetingField] = useState<boolean>(false);
  const [onCorpes, setOnCorpes] = useState<boolean>(false);
  const [meetingPosition, setMeetingPosition] = useState();
  const [onTaskField, setOnTaskField] = useState<boolean>(false);
  const [walls, setWalls] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stateOfTasks, setStateOfTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [mapHeight, setMapHeight] = useState(0);
  const [mapWidth, setMapWidth] = useState(0);
  const [imposters, setImposters] = useState<string[]>([]);
  const [role, setRole] = useState(0);
  const [startGame, setStartGame] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [roleWon, setRoleWon] = useState(undefined);
  const [suspect, setSuspect] = useState<string | null>("");
  const [suspectRoll, setSuspectRoll] = useState<string | null>("");
  const [killCooldown, setKillCooldown] = useState(false);
  const [lastKillTime, setLastKillTime] = useState(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [wasRemoved, setWasRemoved] = useState(false);

  const [sabotageData, setSabotageData] = useState<SabotageData>({availableSabotages: [], cooldown: 0, currentSabotageID: -1, timer: 0});

  useEffect(() => {
    stompClientMeeting.current = new Client({
      brokerURL: `ws://${apiUrl}:4002/ws`,
      onConnect: () => {
        console.log("Connected to emergency meeting websocket");

        stompClientMeeting.current?.subscribe(
          "/topic/meeting/" + GameId + "/running",
          (message) => {
            setStartMeeting(JSON.parse(message.body));
          }
        );
        stompClientMeeting.current?.subscribe(
          "/topic/meeting/" + GameId + "/suspect",
          (message) => {
            console.log("Suspect in subscribe" + message.body);
            setSuspect(message.body);
          }
        );
      },
      onDisconnect: () => {},
      onWebSocketError: (error: Event) => {
        console.error("Error with Emergency Meeting websocket", error);
      },
      onStompError: (frame: any) => {
        console.error(
          "Broker reported error in Emergency Meeting: " +
            frame.headers["message"]
        );
        console.error("Additional details: " + frame.body);
      },
    });
    stompClientMeeting.current.activate();

    stompClientTasks.current = new Client({
      brokerURL: `ws://${apiUrl}:4001/ws`,
      onConnect: () => {
        console.log("Connected to tasks websocket");
        stompClientTasks.current?.subscribe(
          "/topic/tasks/" + GameId + "/stateOfTasks",
          (message) => {
            console.log(
              "stateOfTasks:" + GameId + "\n",
              JSON.parse(message.body)
            );
            setStateOfTasks(JSON.parse(message.body));
          }
        );

        stompClientTasks.current?.subscribe(
          "/topic/tasks/" + GameId + "/currentTask/" + name,
          (message) => {
            if (message.body === "") {
              setCurrentTask(null);
            } else {
              setCurrentTask(JSON.parse(message.body));
            }
          }
        );

        stompClientTasks.current?.publish({
          destination: "/app/tasks/requestStateOfTasks",
          body: gameId,
        });
      },
      onDisconnect: () => {},
      onWebSocketError: (error: Event) => {
        console.error("Error with websocket", error);
      },
      onStompError: (frame: any) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    stompClientTasks.current.activate();

    stompClientSabotages.current = new Client({
      brokerURL: `ws://${apiUrl}:4004/ws`,
      onConnect: () => {
        console.log("Connected to sabotage websocket");

        stompClientSabotages.current?.subscribe(
          "/topic/sabotages/" + GameId + "/information",
          (message) => {
            setSabotageData(JSON.parse(message.body));
            console.log(JSON.parse(message.body));
          }
        );
      },
      onDisconnect: () => {},
      onWebSocketError: (error: Event) => {
        console.error("Error with websocket", error);
      },
      onStompError: (frame: any) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      }
    });

    stompClientSabotages.current.activate();

    stompClientMap.current = new Client({
      brokerURL: `ws://${apiUrl}:4000/ws`,
      onConnect: () => {
        setConnected(true);

        stompClientMap.current?.subscribe(
          "/topic/" + gameId + "/mapLayout",
          (message) => {
            const mapDetails = JSON.parse(message.body);

            console.log("map updates received", mapDetails);

            setWalls(mapDetails.wallPositions);
            setTasks(mapDetails.taskPositions);
            setMeetingPosition(mapDetails.meetingPosition);
            setMapHeight(mapDetails.height);
            setMapWidth(mapDetails.width);
          }
        );

        stompClientMap.current?.subscribe(
          "/topic/" + gameId + "/occupiedColors",
          (message) => {
            const oc = JSON.parse(message.body);
            setOccupiedColors(oc);
          }
        );

        stompClientMap.current?.subscribe(
          "/topic/" + gameId + "/player/" + name + "/removed",
          (message) => {
            const dateTime = message.body;
            console.log("YOU WERE REMOVED: "+dateTime);
            setIsRunning(false);
            setWasRemoved(true);
          }
        );

        stompClientMap.current?.subscribe(
          "/topic/" + gameId + "/remove",
          (message) => {
            const removedPlayer = message.body;
            setPlayers((prevPlayers) => {
              const newPlayers = new Map(prevPlayers);
              newPlayers.delete(removedPlayer);
              return newPlayers;
            });
            console.log("OccupiedColors:", removedPlayer);
          }
        );

        stompClientMap.current?.subscribe(
          "/topic/" + gameId + "/position",
          (message) => {
            const positionUpdate = JSON.parse(message.body);
            setPlayers((prevPlayers) =>
              new Map(prevPlayers).set(positionUpdate.playerId, {
                x: positionUpdate.position.x,
                y: positionUpdate.position.y,
                color: positionUpdate._color,
                isAlive: positionUpdate.alive,
                deathX: positionUpdate.deathPosition.x,
                deathY: positionUpdate.deathPosition.y,
              })
            );
          }
        );

        stompClientMap.current?.subscribe(
          "/topic/" + gameId + "/player/" + name + "/controlsEnabled/task",
          (message) => {
            setOnTaskField(message.body === "true");
          }
        );

        stompClientMap.current?.subscribe(
          "/topic/" +gameId +"/player/" +name +"/controlsEnabled/emergencyMeeting",
          (message) => {
            if (message.body === "true") {
              fetch(`http://${apiUrl}:4002/meeting/${gameId}/startable`)
                .then((response) => response.json())
                .then((data) => setOnMeetingField(data))
                .catch((error) =>
                  console.error("Error fetching startable:", error)
                );
            } else {
              setOnMeetingField(false);
            }
          }
        );

        stompClientMap.current?.subscribe(
          "/topic/" +
            gameId +
            "/player/" +
            name +
            "/controlsEnabled/emergencyMeetingReport",
          (message) => {
            if (message.body === "true") {
              setOnCorpes(true);
            } else {
              setOnCorpes(false);
            }
          }
        );

        stompClientMap.current?.subscribe(
          "/topic/" + gameId + "/" + name + "/onStart",
          (message) => {
            const impostersTemp = JSON.parse(message.body);

            console.log("Role updates received", impostersTemp);
            setIsRunning(true);
            setImposters(impostersTemp);
            setRole(impostersTemp.includes(name) ? 1 : 0);
            setStartGame(true);
          }
        );
        stompClientMap.current?.subscribe(
          "/topic/" + gameId + "/ready",
          (message) => {
            const roleTemp = JSON.parse(message.body);
            setStartGame(false);
          }
        );

        stompClientMap.current?.subscribe(
          "/topic/" + gameId + "/gameOver",
          (message) => {
            console.log("Game Won by ", message.body);
            setIsRunning(false);
            setRole(0);
            setImposters([]);
            setRoleWon(message.body);
          }
        );

        stompClientMap.current?.publish({
          destination: "/app/requestMap",
          body: JSON.stringify({ gameId: gameId }),
        });
        stompClientMeeting.current?.subscribe(
          "/topic/" + gameId + "/kickedOutRoll",
          (message) => {
            console.log("Kicked out suspect subscribe: " + message.body);
            setSuspectRoll(message.body);
          }
        );
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

    return () => {
      if (stompClientMap.current) {
        stompClientMap.current.deactivate();
      }
      if (stompClientTasks.current) {
        stompClientTasks.current.deactivate();
      }
      if(stompClientSabotages.current){
        stompClientSabotages.current.deactivate();
      }
      if (stompClientMeeting.current) {
        stompClientMeeting.current.deactivate();
      }
    };
  }, [name]);

  useEffect(() => {
    handleMove("NONE");
  }, []);

  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const response = await fetch(
          `http://${apiUrl}:4000/requestGameState/${gameId}`
        );
        if (response.ok) {
          const data = await response.json();
          setIsRunning(data.isRunning);
        } else {
          console.error("Failed to fetch game state:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching game state:", error);
      }
    };

    fetchGameState();
  }, [gameId, apiUrl]);

  const handleMove = (direction: string) => {
    if (
      startEmergencyMeeting ||
      inChat ||
      (currentTask?.task === "FileDownloadUpload" &&
        (currentTask?.status === "Download" ||
          (currentTask?.status === "Upload" && currentTask?.progress >= 0))) ||
      currentTask?.task === "Connecting Wires"
    ) {
      return;
    }

    if (connected && stompClientMap.current) {
      stompClientMap.current.publish({
        destination: "/app/move",
        body: JSON.stringify({ gameId, name, direction }),
      });
    }
  };

  const startGameFunction = () => {
    if (connected && stompClientMap.current) {
      fetch(`http://${apiUrl}:4000/startGame`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: gameId,
      });
    }
  };

  const handleKill = () => {
    if (connected && stompClientMap.current) {
      stompClientMap.current.publish({
        destination: "/app/kill",
        body: JSON.stringify({ gameId: gameId, killerId: name }),
      });
      setLastKillTime(Date.now());
      setKillCooldown(true);
      setCooldownSeconds(20);
    }
  };

  	const callSabotage = (sabotageId: number) => {
      const data = {
        gameId: gameId,
        sabotageId: sabotageId
      }

      toggleSabotageList();
      stompClientSabotages.current?.publish({
        destination: "/app/sabotages/startSabotage",
        body: JSON.stringify(data)
      });
	}

  const handleColorSelect = (color: string) => {
    if (connected && stompClientMap.current) {
      stompClientMap.current.publish({
        destination: "/app/changeColor",
        body: JSON.stringify({ gameId, name, color }),
      });
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (players.get(name) != undefined) {
      const task = tasks.find(
        (obj) =>
          obj.x === Math.floor(players.get(name).x) &&
          obj.y === Math.floor(players.get(name).y)
      );
      let task_index = -1;
      for (let i = 0; i < stateOfTasks.length; i++) {
        if (task?.id == stateOfTasks[i].id) {
          task_index = i;
        }
      }
      if (task != null && task_index != -1) {
        if (stateOfTasks[task_index].state === "available") {
          if (currentTask == null && task.taskType != "File Upload") {
            setUseEnabled(onTaskField);
          } else {
            setUseEnabled(false);
          }
        } else if (stateOfTasks[task_index].state === "active") {
          if (
            currentTask?.task === "FileDownloadUpload" &&
            currentTask.status === "Upload" &&
            task.id === currentTask.id
          ) {
            setUseEnabled(onTaskField);
          }
        } else if (stateOfTasks[task_index].state === "active") {
          setUseEnabled(false);
        }
      } else {
        setUseEnabled(false);
      }
    }
  }, [onTaskField]);

  const startMeeting = () => {
    if (connected && stompClientMeeting.current && !startEmergencyMeeting) {
      stompClientMeeting.current.publish({
        destination: "/app/meeting/startMeeting",
        body: gameId,
      });
      fetch(`http://${apiUrl}:4000/loadMeeting/${gameId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to load meeting");
          }
        })
        .catch((error) => {
          console.error("Error loading meeting:", error);
        });
    }
  };

  const endMeeting = () => {
    if (suspect === null /*|| VotingEnded*/) {
      setSuspect("");
      setSuspectRoll("");
      if (connected && stompClientMeeting.current && startEmergencyMeeting) {
        stompClientMeeting.current.publish({
          destination: "/app/meeting/endMeeting",
          body: gameId,
        });
      }
      setOnMeetingField(false);
    }
  };

  const use = () => {
    const task = tasks.find(
      (obj) =>
        obj.x === Math.floor(players.get(name).x) &&
        obj.y === Math.floor(players.get(name).y)
    );
    if (currentTask?.task === "FileDownloadUpload") {
      stompClientTasks.current?.publish({
        destination: "/app/tasks/playerAction",
        body: JSON.stringify({
          type: "incomingFileDownloadUpload",
          lobby: GameId,
          player: name,
          make: "openFileUpload",
          task: "FileDownloadUpload",
        }),
      });
    } else {
      stompClientTasks.current?.publish({
        destination: "/app/tasks/startTask",
        body: JSON.stringify({
          gameId: gameId,
          lobby: GameId,
          id: task.id,
          player: name,
        }),
      });
    }
  };

  const closeTask = () => {
    stompClientTasks.current?.publish({
      destination: "/app/tasks/closeTask",
      body: JSON.stringify({
        gameId: gameId,
        lobby: GameId,
        id: currentTask?.id,
        player: name,
      }),
    });
  };

  const closeSuspect = () => {
    setSuspect(null);
    setSuspectRoll(null);
  };

  useEffect(() => {
    if (players.get(name) != undefined) {
      const task = tasks.find(
        (obj) =>
          obj.x === Math.floor(players.get(name).x) &&
          obj.y === Math.floor(players.get(name).y)
      );
      if (task != null && task.id in stateOfTasks) {
        if (stateOfTasks[task.id] === "available") {
          if (currentTask == null && task.taskType != "File Upload") {
            setUseEnabled(onTaskField);
          } else {
            setUseEnabled(false);
          }
        } else if (stateOfTasks[task.id] === "active") {
          if (
            currentTask?.task === "FileDownloadUpload" &&
            currentTask.status === "Upload" &&
            task.id === currentTask.id
          ) {
            setUseEnabled(onTaskField);
          }
        } else if (stateOfTasks[task.id] === "active") {
          setUseEnabled(false);
        }
      } else {
        setUseEnabled(false);
      }
    }
  }, [onMeetingField]);
  const isInKillRange = (killerPos, targetPos) => {
    if (killerPos == targetPos) return false;
    const distance = Math.sqrt(
      Math.pow(killerPos.x - targetPos.x, 2) +
        Math.pow(killerPos.y - targetPos.y, 2)
    );
    const killRange = 1;
    console.log("is in kill range: ", distance <= killRange);
    return distance <= killRange;
  };

  const updateCanKillStatus = () => {
    if (role !== 1 || !players.get(name)?.isAlive) {
      setCanKill(false);
      return;
    }

    const killerPos = players.get(name);
    let canKill = false;
    for(const [key, player] of players){
      if (player.isAlive && !imposters.includes(key) && isInKillRange(killerPos, player)) {
        canKill = true;
        break;
      }
    }/*
    const canKill = Array.from(players.values()).some((player) => {
      return (
        player.isAlive && player.role !== 1 && isInKillRange(killerPos, player)
      );
    });*/

    console.log("can kill: ", canKill);

    setCanKill(canKill);
  };

  const copyGameId = () => {
    navigator.clipboard.writeText(gameId).then(
      () => {
        console.log('gameId copied to clipboard');
      },
      (err) => {
        console.error('Failed to copy text: ', err);
      }
    );
  }

  useEffect(() => {
    if (!killCooldown) {
      updateCanKillStatus();
    }
  }, [players, role, gameId]);

  useEffect(() => {
    let timer = null;
    if (killCooldown) {
      timer = setTimeout(() => {
        setKillCooldown(false);
      }, 20000); // 20 seconds cooldown
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [killCooldown]);

  useEffect(() => {
    let interval = null;
    if (killCooldown && cooldownSeconds > 0) {
      interval = setInterval(() => {
        setCooldownSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (!killCooldown) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [killCooldown, cooldownSeconds]);

  useEffect(() => {
    if (cooldownSeconds === 0 && killCooldown) {
      setKillCooldown(false);
    }
  }, [cooldownSeconds, killCooldown]);

  const toggleMinimapPopup = () => {
    setMinimapPopupOpen(!minimapPopupOpen);
  };
  const closeRemoved = () => {
    setWasRemoved(false);
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-hidden">
      <div className="flex justify-center items-center w-full h-full overflow-hidden">
        <HeartBeat gameId={gameId} name={name}></HeartBeat>
        <PlayerControls onMove={handleMove} />
        {isRunning && (
          <div
            className=" absolute top-3 right-[50%] p-4 rounded-md bg-blue-600 cursor-pointer"
            onClick={toggleMinimapPopup}
          >
            <Minimap
              walls={walls}
              tasks={tasks}
              playerPosition={{
                x: players?.get(name)?.x,
                y: players?.get(name)?.y,
              }}
              width={150}
              height={90}
              scaleFactor={2}
            />
          </div>
        )}
        <MinimapPopup isOpen={minimapPopupOpen} onClose={toggleMinimapPopup}>
          <div style={{ width: "900px", height: "600px" }}>
            <Minimap
              walls={walls}
              tasks={tasks}
              playerPosition={players.get(name) || { x: 0, y: 0 }}
              width={150 * 6}
              height={90 * 6}
              scaleFactor={12}
            />
          </div>
        </MinimapPopup>
        <GameCanvas
          players={players}
          imposters={imposters}
          role={role}
          height={mapHeight}
          width={mapWidth}
          walls={walls}
          tasks={tasks}
          meeting={{
            x: meetingPosition?.x ?? 0,
            y: meetingPosition?.y ?? 0,
          }}
          stateOfTasks={stateOfTasks}
          name={name}
        />
        <Popup
          isOpen={currentTask?.task === "Connecting Wires"}
          onClose={() => {
            closeTask();
          }}
        >
          <h2 className="font-mono font-bold text-xl mb-6">Connecting Wires</h2>
          <ConnectingWires
            plugs={currentTask?.plugs}
            wires={currentTask?.wires}
            stompClient={stompClientTasks}
            lobbyId={GameId}
            name={name}
          />
        </Popup>
        <Popup
          isOpen={
            currentTask?.task === "FileDownloadUpload" &&
            (currentTask?.status === "Download" ||
              (currentTask?.status === "Upload" && currentTask?.progress >= 0))
          }
          onClose={() => {
            closeTask();
          }}
        >
          <h2 className="font-mono font-bold text-xl mb-6">
            {"File " + currentTask?.status}
          </h2>
          <FileUploadDownload
            status={currentTask?.status}
            progress={currentTask?.progress}
            stompClient={stompClientTasks}
            lobbyId={GameId}
            name={name}
          />
        </Popup>

        <EmergencyMeetingPopup
          isOpen={startEmergencyMeeting}
          onClose={endMeeting}
          gameId={gameId}
          name={name}
        />

        <Popup isOpen={sabotageListIsOpen} onClose={toggleSabotageList}>
          <h2 className="font-mono font-bold text-xl mb-6">Choose A Sabotage</h2>
        <div className="flex flex-col items-center space-y-4">
            {sabotageData.availableSabotages.map((sabotage, index) => (
              <React.Fragment key={index}>
                {Object.entries(sabotage).map(([key, value]) => (
                  <div key={key} className="flex flex-row items-center space-x-4">
                    <button
                      className="bg-blue-600 text-white p-2 rounded-md"
                      onClick={() => callSabotage(Number(key))}
                    >
                      {value}
                    </button>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </Popup>

        <Popup
          isOpen={suspect !== "" && suspect !== null}
          onClose={closeSuspect}
        >
          <h2 className="font-mono font-bold text-xl mb-6">Kicked Out:</h2>
          <h2 className="font-mono font-bold text-xl mb-6">{suspectRoll}</h2>
          <h2 className="font-mono font-bold text-xl mb-6">{suspect}</h2>
        </Popup>
        <Popup isOpen={wasRemoved} onClose={closeRemoved}>
          <h2 className="font-mono font-bold text-xl mb-6">
            You were not active. you were removed from the game {gameId}
          </h2>
        </Popup>
        <Popup
          isOpen={roleWon != null}
          onClose={() => {
            setRoleWon(null);
          }}
        >
          <h2 className="font-mono font-bold text-xl mb-6">
            Game won by {roleWon}
          </h2>
        </Popup>
        <Popup isOpen={startGame} onClose={() => setStartGame(false)}>
          <h2 className="font-mono font-bold text-xl mb-6">
            {role == 1 ? "Imposter" : "Crewmate"}
          </h2>
        </Popup>
        <div className="fixed top-5 left-1 flex flex-col items-end space-y-2 z-50">
          {isRunning && <TasksTodoList stateOfTasks={stateOfTasks} />}
        </div>
        <div className="fixed top-5 right-5 flex flex-col items-end space-y-2 z-50">
          <div
            className={`rounded-md p-4 ${
              role === 1 ? "bg-red-600" : "bg-blue-600"
            }`}
          >
            <p className="text-white">
              {"You are: "}
              <a className="font-bold">
                {role === 1 ? "Imposter" : "Crewmate"}
              </a>
            </p>
          </div>
        </div>
        <div className="p-4 rounded-md bg-blue-600 fixed bottom-5 right-5 flex flex-row items-end space-y-2">
          {isRunning ? (
            <>
              {role == 1 && (
				        <div className="flex flex-col mr-2">
                  <div className="mb-2">
                    <InGameButton
                      onClick={handleKill}
                      label={`Kill ${
                        cooldownSeconds > 0 && killCooldown
                          ? `(${cooldownSeconds}s)`
                          : ""
                      }`}
                      active={canKill && !killCooldown}
                    />
                  </div>
                  <InGameButton
                    onClick={toggleSabotageList}
                    label={`Sabotage${
                      (sabotageData.cooldown > 0) ? ` (${sabotageData.cooldown}s)` : ''
                    }`}
                    active={true}
                  />
				        </div>
              )}
              <div className="flex flex-col">
                <div className="mb-2">
                  <InGameButton onClick={use} label="Use" active={useEnabled} />
                </div>
                {isPlayerAlive && (
                  <InGameButton
                    onClick={startMeeting}
                    label="Meeting"
                    active={onMeetingField || onCorpes}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col">
              <div className="flex flex-row mb-2">
                <div className="mr-2">
                  <InGameButton
                    onClick={startGameFunction}
                    label="Start Game"
                    active={true}
                  />
                </div>
                <div className="mr-2">
                  <InGameButton onClick={toggleChat} label="Chat" active={true} />
                </div>
                <InGameButton onClick={togglePopup} label="Choose Color" active={true} />
              </div>
              <ButtonComponent onClick={copyGameId} label={"Copy GameID: " + gameId} />
              <Popup isOpen={inChat} onClose={toggleChat}>
                <Chat inLobby={true} name={name} gameId={gameId}></Chat>
              </Popup>
              <ChooseColorPopup
                isOpen={isOpen}
                occupied={occupiedColors}
                onClose={togglePopup}
                onColorSelect={handleColorSelect}
              />
            </div>
          )}
        </div>
        {!isRunning && <Settings gameId={gameId} name={name} />}
      </div>
      <div className="p-4 rounded-md bg-blue-600 fixed bottom-5 left-5 flex flex-col items-end space-y-2">
        <ButtonComponent onClick={leaveGame} label="Leave Game" />
      </div>
    </div>
  );
};

export default GameComponent;
