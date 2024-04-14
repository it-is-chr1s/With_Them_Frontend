import React, { useState } from "react";
import Layout from "../components/Layout";
import InputForm from "../components/InputForm";
import NameInputPopup from "../components/NameInputPopup";

const JoinLobbyPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialGameId, setInitialGameId] = useState(""); // State to hold initial gameId
  const [inputValue, setInputValue] = useState(""); // State to hold input value

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    setInitialGameId(value); // Set initialGameId whenever input value changes
};


  const handleJoin = async () => {
    // Check if lobby exists, if it is not full and if the game is not on
    setInitialGameId(inputValue); // Set initial gameId with input value
    togglePopup();
  };

  return (
    <Layout>
      <h1 className="text-white text-6xl font-bold mb-8">Join Lobby</h1>
      <InputForm
        inputPlaceholder="Enter Lobby ID"
        buttonText="Search"
        value={inputValue} // Pass input value as value prop
        onChange={handleInputChange} // Pass handleInputChange as onChange prop
        onSubmit={handleJoin}
      />
      <NameInputPopup isOpen={isOpen} onClose={togglePopup} initialGameId={inputValue} />
    </Layout>
  );
};

export default JoinLobbyPage;
