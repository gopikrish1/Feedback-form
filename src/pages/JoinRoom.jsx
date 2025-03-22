  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import "../styles/joinroom.css"; // Importing the CSS file

  const JoinRoom = () => {
    const [roomCode, setRoomCode] = useState("");
    const navigate = useNavigate();

    const handleJoinRoom = () => {
      if (roomCode.trim() === "") {
        alert("❌ Enter a valid Room Code.");
        return;
      }
      localStorage.removeItem("roomCreator"); // Ensure user is not treated as a creator
      navigate(`/room/${roomCode}`);
    };

    return (
      <div className="fullscreen-center">
        <div className="join-room-container">
          <h2>Join a Room</h2>
          <p className="room-text">Enter the room code to participate in the event.</p>
          
          <input 
            type="text" 
            className="input-box" 
            value={roomCode} 
            onChange={(e) => setRoomCode(e.target.value)} 
            placeholder="Enter Room Code"
          />
          
          <button className="btn-join" onClick={handleJoinRoom}>Join Room</button>
        </div>
      </div>
    );
  };

  export default JoinRoom;
