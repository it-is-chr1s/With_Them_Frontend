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

	const startVoting = () => {
        console.log("Uslo");
        fetch(`http://localhost:4000/game/${gameId}/players`)
            .then(response => response.json())
            .then(data => {
                setAlivePlayers(data.alive);
                setDeadPlayers(data.dead);
            })
            .catch(error => console.error('Error fetching players:', error));
        
        };

   
	return (
		<Popup isOpen={isOpen} onClose={onClose}>
			<div>
				<h1 className="text-black text-3xl mb-8">Emergency Meeting</h1>
				<h2 className="text-black text-xl mb-4">Alive:</h2>
				<div className="flex flex-wrap">
					{alivePlayers.map((player, index) => (
						<div
							key={index}
							className="rounded-md border border-gray-300 mr-2 mb-2 p-2"
							style={{ backgroundColor: player.color }}
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

				<button
					onClick={startVoting}
					type="button"
					className="block w-full py-2 bg-indigo-600 text-white font-bold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				>
					Start Voting
				</button>
			</div>
		</Popup>
	);
};

export default EmergencyMeetingPopup;
