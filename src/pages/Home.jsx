import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h2>Real-Time Feedback System</h2>
      <button className="btn btn-primary m-3" onClick={() => navigate("/create-room")}>Create Room</button>
      <button className="btn btn-secondary" onClick={() => navigate("/join-room")}>Join Room</button>
    </div>
  );
};

export default Home;
