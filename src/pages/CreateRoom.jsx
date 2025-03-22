import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import "../styles/CreateRoom.css"; // Import CSS

const generateRoomCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const CreateRoom = () => {
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    const newRoomCode = generateRoomCode();
    try {
      await addDoc(collection(db, "rooms"), { code: newRoomCode });
      localStorage.setItem("roomCreator", newRoomCode); // Store creator’s room ID
      navigate(`/room/${newRoomCode}`); // Redirect to room page
    } catch (error) {
      alert("❌ Error creating room.");
    }
  };

  return (
    <div className="create-room-container">
      <h2>Create a Room</h2>
      <button className="btn btn-success" onClick={handleCreateRoom}>
        Generate & Enter Room
      </button>
    </div>
  );
};

export default CreateRoom;
