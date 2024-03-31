import React, { useState } from 'react';
import Layout from './components/Layout';
import InputForm from './components/InputForm';
import ButtonComponent from './components/ButtonComponent';
import Popup from './components/Popup';
import NameInputPopup from './components/NameInputPopup';

const JoinLobbyPage = () => {
    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
      setIsOpen(!isOpen);
    };
    const handleJoin = () => {
        // Mocking error scenarios
        const random = Math.random();
        if (random < 0.3) 
        {
          // Open the name pop-up if there are no errors
          setIsOpen(true);
        }
      };

  return (
    <Layout>
      <h1 className="text-white text-6xl font-bold mb-8">Join Lobby</h1> {/* Header */}
      <InputForm 
        inputPlaceholder="Enter Lobby ID"
        buttonText="Join"
        onSubmit={handleJoin}
      />
    <NameInputPopup isOpen={isOpen} onClose={togglePopup}/>
    </Layout>
  );
};

export default JoinLobbyPage;
