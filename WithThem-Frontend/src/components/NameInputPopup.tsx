import React, { useState } from "react";
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
  const [canJoin, setCanJoin] = useState(false);
  const [gameId, setGameId] = useState(initialGameId || ""); // Initialize gameId with initialGameId if provided

  const navigate = useNavigate();

  const checkAbletoJoin = async () => {
    let check;

    console.log(check);
    return check;
  };
  const handleJoin = async () => {
    // If gameId is not provided, create a new game
    console.log(initialGameId);
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
          setGameId(data); // Set the game ID received from the backend
        } else {
          console.error("Failed to create game:", response.statusText);
        }
      } catch (error) {
        console.error("Error creating game:", error);
      }
      console.log({ gameId });
    } else {
      setGameId(initialGameId);

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
              setCanJoin(true);
            } else {
              console.log("CHECK false" + data);
              setCanJoin(false);
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
      console.log("GAMEID:" + gameId);
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
