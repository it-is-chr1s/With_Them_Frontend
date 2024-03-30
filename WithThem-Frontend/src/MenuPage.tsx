import React from "react";
import ButtonComponent from "./ButtonComponent";
import SpaceBackground from "./assets/SpaceBackground.jpg";

const MenuPage = () => {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${SpaceBackground})` }}
    >
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-white text-4xl mb-8">With Them</h1>
        <div className="flex flex-col items-center">
          <ButtonComponent path="/join-room" label="Join Existing Room" />
          <ButtonComponent path="/create-room" label="Create New Room" />
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
