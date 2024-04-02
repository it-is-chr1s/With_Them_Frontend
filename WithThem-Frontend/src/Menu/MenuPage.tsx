import React, { useState } from "react";
import ButtonComponent from "../components/ButtonComponent";
import Layout from "../components/Layout";
import NameInputPopup from "../components/NameInputPopup";

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
        <NameInputPopup isOpen={isOpen} onClose={togglePopup} />
        
      </div>
    </Layout>
  );
};

export default MenuPage;
