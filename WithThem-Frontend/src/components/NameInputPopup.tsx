import React, { useState } from 'react';
import Popup from './Popup';
import InputForm from './InputForm';
import { useNavigate } from 'react-router-dom';

interface NameInputPopupProps {
    isOpen: boolean;
    onClose: () => void;
    initialGameId?: string; //optional prop for initial gameId
}

const NameInputPopup: React.FC<NameInputPopupProps> = ({ isOpen, onClose, initialGameId }) => {
    const [username, setUsername] = useState("");
    const [gameId, setGameId] = useState(initialGameId || ""); // Initialize gameId with initialGameId if provided

    const navigate = useNavigate();
    const handleJoin = async () => {
        // If gameId is not provided, create a new game
        console.log(initialGameId);
        if (initialGameId === undefined) {
            try {
                const response = await fetch('http://localhost:4000/createGame', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    // Optionally pass any data needed for game creation
                    body:JSON.stringify({ hostName:username}),
                });
                if (response.ok) {
                    const data = await response.text();
                    setGameId(data); // Set the game ID received from the backend
                } else {
                    console.error('Failed to create game:', response.statusText);
                }
            } catch (error) {
                console.error('Error creating game:', error);
            }
            console.log({gameId});
        }else{
            setGameId(initialGameId);
            console.log("GAMEID:"+gameId);
        }
    
        if (username.trim() !== "" && gameId) {
            onClose();
            navigate('/lobby', { state: { gameId, username } });
        }
    };
    
    return (
        <Popup isOpen={isOpen} onClose={onClose}>
            <h1 className="text-black text-3xl mb-8">Choose Username</h1>
            <InputForm 
                inputPlaceholder="Enter username"
                buttonText="Join"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onSubmit={handleJoin}
            />
        </Popup>
    );
};

export default NameInputPopup;
