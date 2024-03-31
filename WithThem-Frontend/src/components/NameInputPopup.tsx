import React from 'react';
import Popup from './Popup';
import InputForm from './InputForm';

interface NameInputPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const NameInputPopup: React.FC<NameInputPopupProps> = ({ isOpen, onClose }) => {
    const onSubmit=(/*username*/)=>{
        
    }
    const handleJoin = (/*username: string*/) => {
        onSubmit(/*username*/);
        onClose();
    };

    return (
        <Popup isOpen={isOpen} onClose={onClose}>
            <h1 className="text-black text-3xl mb-8">Choose Username</h1>
            <InputForm 
                inputPlaceholder="Enter username"
                buttonText="Join"
                onSubmit={handleJoin}
            />
        </Popup>
    );
};

export default NameInputPopup;
