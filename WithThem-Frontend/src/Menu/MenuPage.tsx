import React, { useState } from "react";
import ButtonComponent from "../components/ButtonComponent";
import Layout from "../components/Layout";
import Popup from "../components/Popup";
import InputForm from "../components/InputForm";

const MenuPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleJoin = () => {
    togglePopup();
  };
  return (
    <Layout>
      <h1 className="text-white text-6xl font-bold mb-8">With Them</h1>
      <div className="flex flex-col items-center space-y-4">
        {" "}
        {/* Add space-y-4 for vertical space between buttons */}
        <ButtonComponent
          onClick={() => {
            window.location.href = "/join-lobby";
          }}
          label="Join Lobby"
        />
        <ButtonComponent onClick={togglePopup} label="Create New Lobby" />
        <Popup isOpen={isOpen} onClose={togglePopup}>
          <h1 className="text-black text-3xl mb-8">Choose Username</h1>
          <InputForm
            inputPlaceholder="Enter username"
            buttonText="Join"
            onSubmit={handleJoin}
          />
        </Popup>
      </div>
    </Layout>
  );
};

export default MenuPage;
