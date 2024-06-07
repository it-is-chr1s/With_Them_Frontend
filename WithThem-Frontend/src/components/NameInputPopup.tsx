import React, { useState, useEffect } from "react";
import Popup from "./Popup";
import InputForm from "./InputForm";
import { useNavigate } from "react-router-dom";

interface NameInputPopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialGameId?: string; //optional prop for initial gameId
}

const apiUrl = import.meta.env.VITE_API_URL;

const NameInputPopup: React.FC<NameInputPopupProps> = ({
  isOpen,
  onClose,
  initialGameId,
}) => {
  const [username, setUsername] = useState("");
  var canJoin = false;
  var gameId = initialGameId || "";

  const navigate = useNavigate();

  const checkAbletoJoin = async () => {
    let check;

    console.log(check);
    return check;
  };
  const handleJoin = async () => {
    if (initialGameId === undefined) {
      try {
        console.log(username);
        const response = await fetch(
          `http://${apiUrl}:4000/createGame?hostName=${username}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.text();
          gameId = data;
          console.log("Join1: " + initialGameId);
        } else {
          console.error("Failed to create game:", response.statusText);
        }
      } catch (error) {
        console.error("Error creating game:", error);
      }
    } else {
      gameId = initialGameId;
      console.log("GAMEID: " + gameId);
      if (gameId !== "") {
        await fetch(`http://${apiUrl}:4000/ableToJoin/${gameId}/${username}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to check if able to join");
            }
            return response.text();
          })
          .then((data) => {
            if (data === "true") {
              console.log("CHECK true " + data);
              console.log("Join2: " + initialGameId);
              canJoin = true;
            } else {
              console.log("Join3: " + initialGameId);
              console.log("CHECK false" + data);
              canJoin = false;
            }
            
          })
          .catch((error) =>
            console.error("Error fetching able to join:", error)
          );

          if (!canJoin) {
            console.log("CANNOT JOIN");
            return;
          }
      }
    }

    if (username.trim() !== "" && gameId) {
      onClose();
      navigate("/lobby", { state: { gameId, username } });
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
