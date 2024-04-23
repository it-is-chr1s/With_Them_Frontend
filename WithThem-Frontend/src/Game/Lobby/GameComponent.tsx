import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import GameCanvas from "./GameCanvas";
import PlayerControls from "./PlayerControls";
import { useLocation } from "react-router-dom";
import ButtonComponent from "../../components/ButtonComponent";
import ChooseColorPopup from "../../components/ChooseCollorPopup";
import InGameButton from "../../components/InGameButton";
import Popup from "../../components/Popup";
import ConnectingWires from "./Tasks/ConnectingWires";
import FileUploadDownload from "./Tasks/FileUploadDownload";

const GameComponent: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);

	const togglePopup = () => {
		setIsOpen(!isOpen);
	};

	const [connected, setConnected] = useState<boolean>(false);
	const location = useLocation();
	const GameId = location.state?.gameId;
	const [gameId] = useState(GameId);
	const username = location.state?.username;
	const [name] = useState(username);
	const stompClientMap = useRef<Client | null>(null);
	const stompClientTasks = useRef<Client | null>(null);
	const [players, setPlayers] = useState<
		Map<string, { x: number; y: number; color: string }>
	>(new Map());
	const [useEnabled, setUseEnabled] = useState<boolean>(false);
  const [onMeetingField, setOnMeetingField] = useState<boolean>(false);
	const [meetingEnabled, setMeetingEnabled] = useState<boolean>(false);
  const[meetingPosition,setMeetingPosition]=useState();
	const [onTaskField, setOnTaskField] = useState<boolean>(false);
	const [walls, setWalls] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [stateOfTasks, setStateOfTasks] = useState([]);
	const [currentTask, setCurrentTask] = useState(null);
	const [mapHeight, setMapHeight] = useState(0);
	const [mapWidth, setMapWidth] = useState(0);
	const [role, setRole] = useState(0);
	useEffect(() => {
		stompClientTasks.current = new Client({
			brokerURL: "ws://localhost:4001/ws",
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
				console.error(
					"Broker reported error: " + frame.headers["message"]
				);
				console.error("Additional details: " + frame.body);
			},
		});

		stompClientTasks.current.activate();

		stompClientMap.current = new Client({
			brokerURL: "ws://localhost:4000/ws",
			onConnect: () => {
				setConnected(true);

				stompClientMap.current?.subscribe(
					"/topic/" + gameId + "/mapLayout",
					(message) => {
						const mapDetails = JSON.parse(message.body);

						console.log("map updates received", mapDetails);

						setWalls(mapDetails.wallPositions);
						setTasks(mapDetails.taskPositions);
            setMeetingPosition(mapDetails.meetingPosition)
						setMapHeight(mapDetails.height);
						setMapWidth(mapDetails.width);
					}
				);

				stompClientMap.current?.subscribe(
					"/topic/" + gameId + "/position",
					(message) => {
						const positionUpdate = JSON.parse(message.body);
						//console.log("Position update received:", positionUpdate);
						setPlayers((prevPlayers) =>
							new Map(prevPlayers).set(positionUpdate.playerId, {
								x: positionUpdate.position.x,
								y: positionUpdate.position.y,
								color: positionUpdate._color,
							})
						);
					}
				);

				stompClientMap.current?.subscribe(
					"/topic/" +
						gameId +
						"/player/" +
						name +
						"/controlsEnabled/task",
					(message) => {
						setOnTaskField(message.body === "true");
					}
				);

				stompClientMap.current?.subscribe(
					"/topic/" + gameId + "/" + name,
					(message) => {
						const roleTemp = JSON.parse(message.body);

						console.log("Role updates received", roleTemp);

						setRole(roleTemp.role);
					}
				);

				stompClientMap.current?.publish({
					destination: "/app/requestMap",
					body: JSON.stringify({ gameId: gameId }),
				});
			},
			onDisconnect: () => {
				setConnected(false);
			},
			onWebSocketError: (error: Event) => {
				console.error("Error with websocket", error);
			},
			onStompError: (frame: any) => {
				console.error(
					"Broker reported error: " + frame.headers["message"]
				);
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
		};
	}, [name]);

	const handleMove = (direction: string) => {
		if (connected && stompClientMap.current) {
			stompClientMap.current.publish({
				destination: "/app/move",
				body: JSON.stringify({ gameId, name, direction }),
			});
		}
	};

  const startMeeting=()=>{


  }
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
	}, [onTaskField]);

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
	return (
		<div className="container">
			{/* {connected ? (
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
			)} */}

			<div>
				<PlayerControls onMove={handleMove} />
				<GameCanvas
					players={players}
					height={mapHeight}
					width={mapWidth}
					walls={walls}
					tasks={tasks}
          meeting={{ x: meetingPosition?.x ?? 0, y: meetingPosition?.y ?? 0 }}
					stateOfTasks={stateOfTasks}
					name={name}
				/>
				<Popup
					isOpen={currentTask?.task === "Connecting Wires"}
					onClose={() => {
						closeTask();
					}}
				>
					<h2 className="font-mono font-bold text-xl mb-6">
						Connecting Wires
					</h2>
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
							(currentTask?.status === "Upload" &&
								currentTask?.progress >= 0))
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
        <div className="fixed bottom-5 right-5 flex flex-col items-end space-y-2">
            <InGameButton
                onClick={use}
                label="Use"
                active={useEnabled}
            />
            <InGameButton
                onClick={startMeeting}
                label="Meeting"
                active={meetingEnabled}
            />
				<h1>GameID: {gameId}</h1>

<ButtonComponent onClick={togglePopup} label="Choose color" />
				<ChooseColorPopup
					isOpen={isOpen}
					onClose={togglePopup}
					onColorSelect={handleColorSelect}
				/>
        </div>
        <div className="flex justify-end">
				
			</div>
				
      
			</div>

			
		</div>
	);
};

export default GameComponent;
