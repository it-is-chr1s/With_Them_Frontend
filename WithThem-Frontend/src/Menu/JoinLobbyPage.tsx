import React, { useState } from "react";
import Layout from "../components/Layout";
import InputForm from "../components/InputForm";
import NameInputPopup from "../components/NameInputPopup";

const JoinLobbyPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  const handleJoin = () => {
    //Check if lobby exists, if it is not full and if the game is not on
    togglePopup();
  };

  return (
    <Layout>
      <h1 className="text-white text-6xl font-bold mb-8">Join Lobby</h1>
      <InputForm
        inputPlaceholder="Enter Lobby ID"
        buttonText="Search"
        onSubmit={togglePopup}
      />
      <NameInputPopup isOpen={isOpen} onClose={togglePopup} />
    </Layout>
  );
};

export default JoinLobbyPage;
