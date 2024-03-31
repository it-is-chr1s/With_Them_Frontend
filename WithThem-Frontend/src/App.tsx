import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MenuPage from "./MenuPage";
import JoinLobbyPage from "./JoinLobbyPage";

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/join-lobby" element={<JoinLobbyPage />} />
      </Routes>
    </Router>
  );
};

export default App;
