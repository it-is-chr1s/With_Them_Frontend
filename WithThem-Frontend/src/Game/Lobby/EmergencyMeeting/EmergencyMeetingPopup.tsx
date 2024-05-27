import React, { useState, useEffect } from "react";
import Popup from "../../../components/Popup";

interface EmergencyMeetingPopupProps {
    isOpen: boolean;
    onClose: (() => void) | null;
    gameId: string;
    name: string;
}

const EmergencyMeetingPopup: React.FC<EmergencyMeetingPopupProps> = ({
    isOpen,
    onClose,
    gameId,
    name,
}) => {
    const [alivePlayers, setAlivePlayers] = useState<{ name: string; color: string }[]>([]);
    const [deadPlayers, setDeadPlayers] = useState<string[]>([]);
    const [votingActive, setVotingActive] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<string>("");
    const isAlive = !deadPlayers.includes(name);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        if (isOpen) {
            timeout = setTimeout(() => {
                setVotingActive(true);
                startVoting();
            }, 5000); // 5 seconds
            fetch(`http://localhost:4000/game/${gameId}/players`)
                .then(response => response.json())
                .then(data => {
                    setAlivePlayers(data.alive);
                    setDeadPlayers(data.dead);
                })
                .catch(error => console.error('Error fetching players:', error));
        } else {
            setVotingActive(false);
        }

        return () => {
            clearTimeout(timeout);
        };

    }, [isOpen, gameId]);

    const startVoting = () => {
        fetch(`http://localhost:4002/meeting/startVoting`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',},
            body: gameId,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to start voting');
            }
            // Handle success if needed
        })
        .catch(error => {
            console.error('Error start voting:', error);
        });

        let timeout: ReturnType<typeof setTimeout>;
        timeout = setTimeout(() => {
                if(votingActive)setVotingActive(false);
                if(isOpen){
                    fetch(`http://localhost:4002/meeting/${gameId}/suspect`)
                    .then((response) => {
                        if (!response.ok) {throw new Error('Failed to catch a suspect');}
                        return response.text();
                    })
                    .then((data) => console.log("data in after 45s suspect "+data))
                    .catch((error) =>
                      console.error("Error fetching suspect:", error)
                    ); 
                }    
            
                       
        }, 45000); // 45 seconds
        return () => {
            clearTimeout(timeout);
        };
    };

    const vote = () => {
        console.log("my name:" + name);
        console.log("selected player:" + selectedPlayer);
        setVotingActive(false);
    
        // Send POST request with the voter's name and the selected player's name
        if (selectedPlayer) {
            fetch(`http://localhost:4002/meeting/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    gameId: gameId,
                    voter: name,
                    nominated: selectedPlayer
                }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to vote');
                }
                return response.text();
            })
            .then(data => {
                // Handle response and update state if necessary
                if (data !== "" ) {
                    console.log("SUSPECT:" + data);
                    //setSuspect(data);
                } else {
                    // Handle case when response is null (no content)
                    console.log("No suspect received from the server.");
                    //setSuspect(null); // Or handle in another way as per your requirement
                }
            })
            .catch(error => {
                console.error('Error casting vote:', error);
            });
        }
    };
    

    return (
        <Popup isOpen={isOpen} onClose={onClose}>
            <div>
                <h1 className="text-black text-3xl mb-8">Emergency Meeting</h1>
                <h2 className="text-black text-xl mb-4">Alive:</h2>
                {votingActive && isAlive && (
                    <h2 className="text-black text-xl mb-4">*select alive a player</h2>
                )}                
                
                <div className="flex flex-wrap">
                    {alivePlayers.map((player, index) => (
                        <div
                            key={index}
                            className={`rounded-md border border-gray-300 mr-2 mb-2 p-2 cursor-pointer ${
                                selectedPlayer === player.name && votingActive ? 'bg-black text-white' : ''
                            }`}
                            style={{ backgroundColor: selectedPlayer === player.name && votingActive ? 'black' : player.color }}
                            onClick={() => setSelectedPlayer(player.name)}
                        >
                            {player.name}
                        </div>
                    ))}
                </div>

                <h2 className="text-black text-xl mb-4">Dead:</h2>
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
                         votingActive && selectedPlayer ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-white font-bold' : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                         }`}
                 >
                     Vote
                 </button>
                )}
               
            </div>
        </Popup>
    );
};

export default EmergencyMeetingPopup;
