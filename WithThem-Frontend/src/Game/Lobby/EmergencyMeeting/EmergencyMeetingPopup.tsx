import React, { useState, useEffect } from "react";
import Popup from "../../../components/Popup";
import Chat from "./Chat";

interface EmergencyMeetingPopupProps {
  isOpen: boolean;
  onClose: (() => void) | null;
  gameId: string;
  name: string;
}

const apiUrl = import.meta.env.VITE_API_URL;

const EmergencyMeetingPopup: React.FC<EmergencyMeetingPopupProps> = ({
  isOpen,
  onClose,
  gameId,
  name,
}) => {
  const [alivePlayers, setAlivePlayers] = useState<
    { name: string; color: string }[]
  >([]);
  const [deadPlayers, setDeadPlayers] = useState<string[]>([]);
  const [votingActive, setVotingActive] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [remainingTime, setRemainingTime] = useState<number>(45); // 45 seconds countdown
  const isAlive = !deadPlayers.includes(name);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (isOpen) {
      //timeout = setTimeout(() => {
        setVotingActive(true);
        startVoting();
      //}, 5000); // 5 seconds
      fetch(`http://${apiUrl}:4000/game/${gameId}/players`)
        .then((response) => response.json())
        .then((data) => {
          setAlivePlayers(data.alive);
          setDeadPlayers(data.dead);
        })
        .catch((error) => console.error("Error fetching players:", error));
    } else {
      setVotingActive(false);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isOpen, gameId]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

      interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setVotingActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000); // Decrease time every second


    return () => {
      clearInterval(interval);
    };
  }, [votingActive]);

  const startVoting = () => {
    fetch(`http://${apiUrl}:4002/meeting/startVoting`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: gameId,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to start voting");
        }
      })
      .catch((error) => {
        console.error("Error starting voting:", error);
      });
    setRemainingTime(45); // Reset the countdown timer
  };

  /*const fetchSuspect = () => {
    fetch(`http://${apiUrl}:4002/meeting/${gameId}/suspect`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch suspect");
        }
        return response.text();
      })
      .then((data) => console.log("data after 45s suspect " + data))
      .catch((error) => console.error("Error fetching suspect:", error));
  };*/

  const vote = () => {
    setVotingActive(false);

    if (selectedPlayer) {
      fetch(`http://${apiUrl}:4002/meeting/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: gameId,
          voter: name,
          nominated: selectedPlayer,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to vote");
          }
          return response.text();
        })
        .then((data) => {
          if (data !== "") {
            console.log("SUSPECT:" + data);
          } else {
            console.log("No suspect received from the server.");
          }
        })
        .catch((error) => {
          console.error("Error casting vote:", error);
        });
    }
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-black text-3xl mb-8">Emergency Meeting</h1>
        <h2 className="text-black text-xl mb-4">Alive:</h2>
        {isAlive && (
          <div className="items-center">
            <span className="ml-2 text-red-500 text-xl">
              ({remainingTime}s)
            </span>
            <h2 className="text-black text-xl mb-4">WHO IS THE IMPOSTER?</h2>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center">
          {alivePlayers.map((player, index) => (
            <div
              key={index}
              className={`rounded-md border border-gray-300 mr-2 mb-2 p-2 cursor-pointer ${
                selectedPlayer === player.name && votingActive
                  ? "bg-black text-white"
                  : ""
              }`}
              style={{
                backgroundColor:
                  selectedPlayer === player.name && votingActive
                    ? "black"
                    : player.color,
              }}
              onClick={() => setSelectedPlayer(player.name)}
            >
              {player.name}
            </div>
          ))}
        </div>

        {deadPlayers.length > 0 && (
          <h2 className="text-black text-xl mb-4">Dead:</h2>
        )}
        <div className="flex flex-wrap">
          {deadPlayers.map((player, index) => (
            <div
              key={index}
              className="rounded-md border border-gray-300 bg-gray-300 mr-2 mb-2 p-2"
            >
              {player}
            </div>
          ))}
        </div>

        {isAlive && (
          <button
            onClick={vote}
            type="button"
            disabled={!votingActive || !selectedPlayer}
            className={`block w-full py-2 ${
              votingActive && selectedPlayer
                ? "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-white font-bold"
                : "bg-gray-400 text-gray-600 cursor-not-allowed"
            }`}
          >
            Vote
          </button>
        )}
      </div>
      {/* Add space between Vote button and Chat */}
      <div style={{ marginTop: "10px" }}></div>

      {isAlive && <Chat inLobby={false} gameId={gameId} name={name} />}
    </Popup>
  );
};

export default EmergencyMeetingPopup;
