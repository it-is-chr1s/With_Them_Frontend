import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MenuPage from "./Menu/MenuPage";
import JoinLobbyPage from "./Menu/JoinLobbyPage";
import Lobby from "./Game/Lobby/Lobby";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/join-lobby" element={<JoinLobbyPage />} />
        <Route path="/lobby" element={<Lobby />} />
      </Routes>
    </Router>
  );
};

export default App;
