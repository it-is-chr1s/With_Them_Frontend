import React, { useState } from "react";
import Layout from "../components/Layout";
import InputForm from "../components/InputForm";
import NameInputPopup from "../components/NameInputPopup";
import ButtonComponent from "../components/ButtonComponent";
import { useNavigate } from "react-router-dom";

const JoinLobbyPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialGameId, setInitialGameId] = useState("");
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const goBack = () => {
    navigate("/");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    setInitialGameId(value);
  };

  const handleJoin = async () => {
    setInitialGameId(inputValue);
    togglePopup();
  };

  return (
    <Layout>
      <h1 className="text-white text-6xl font-bold mb-8">Join Lobby</h1>
      <InputForm
        inputPlaceholder="Enter Lobby ID"
        buttonText="Join"
        value={inputValue}
        onChange={handleInputChange}
        onSubmit={handleJoin}
      />
      <NameInputPopup
        isOpen={isOpen}
        onClose={togglePopup}
        initialGameId={inputValue}
      />
      <ButtonComponent onClick={goBack} label="Back"></ButtonComponent>
    </Layout>
  );
};

export default JoinLobbyPage;
