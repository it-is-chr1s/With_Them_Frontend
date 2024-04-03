import React, { useState } from 'react';
import Popup from './Popup';
import InputForm from './InputForm';
import { useNavigate } from 'react-router-dom';

interface NameInputPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const NameInputPopup: React.FC<NameInputPopupProps> = ({ isOpen, onClose }) => {
    const [username, setUsername] = useState("");

    const navigate=useNavigate();
    const handleJoin = (): void => {
        if (username.trim() !== "") {
            onClose();
           navigate ( '/lobby',{state:{username}});
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
