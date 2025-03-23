import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  collection, query, where, onSnapshot, addDoc, serverTimestamp,
  updateDoc, doc, increment, setDoc
} from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from "chart.js";
import "../styles/room.css";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

// Generate a random username
const generateUsername = () => {
  const adjectives = ["Rare", "Curious", "Bold", "Swift", "Radiant"];
  const nouns = ["Tiger", "Eagle", "Whale", "Phoenix", "Wolf"];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
};

const Room = () => {
  const { roomId } = useParams();
  const [feedbacks, setFeedbacks] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState("");
  const [username, setUsername] = useState(generateUsername());
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    setIsCreator(localStorage.getItem("roomCreator") === roomId);

    const feedbacksRef = collection(db, "feedbacks");
    const feedbackQuery = query(feedbacksRef, where("roomId", "==", roomId));
    const unsubscribeFeedbacks = onSnapshot(feedbackQuery, (snapshot) => {
      setFeedbacks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const roomRef = doc(db, "rooms", roomId);

    // Increment active users safely
    const incrementActiveUserCount = async () => {
      try {
        await updateDoc(roomRef, { activeUsers: increment(1) });
      } catch (error) {
        console.error("Error incrementing active user count:", error);
        await setDoc(roomRef, { activeUsers: 1 }, { merge: true }); // Ensure room exists
      }
    };

    // Decrement active users safely
    const decrementActiveUserCount = async () => {
      try {
        await updateDoc(roomRef, { activeUsers: increment(-1) });
      } catch (error) {
        console.error("Error decrementing active user count:", error);
      }
    };

    // Subscribe to active user count updates
    const unsubscribeActiveUsers = onSnapshot(roomRef, (doc) => {
      setActiveUsers(doc.data()?.activeUsers || 0);
    });

    // Increment active users on mount
    incrementActiveUserCount();

    // Handle tab close or refresh
    const handleUnload = () => {
      decrementActiveUserCount();
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      decrementActiveUserCount();
      window.removeEventListener("beforeunload", handleUnload );
      unsubscribeFeedbacks();
      unsubscribeActiveUsers();
    };
  }, [roomId]);

  const submitFeedback = async () => {
    if (rating < 1 || comment.trim() === "") {
      alert("❌ Please provide a rating and a comment.");
      return;
    }
    try {
      await addDoc(collection(db, "feedbacks"), {
        roomId,
        username,
        rating,
        comment,
        timestamp: serverTimestamp(),
      });
      setRating(3);
      setComment("");
      alert(`✅ Feedback submitted successfully! (${username})`);
    } catch {
      alert("❌ Error submitting feedback.");
    }
  };

  const getRatingDistribution = () => {
    const ratingCounts = [0, 0, 0, 0, 0];
    feedbacks.forEach((fb) => {
      if (fb.rating >= 1 && fb.rating <= 5) {
        ratingCounts[fb.rating - 1]++;
      }
    });

    return {
      labels: ["1⭐", "2⭐", "3⭐", "4⭐", "5⭐"],
      datasets: [{ data: ratingCounts, backgroundColor: ["#ff4d4d", "#ffcc00", "#99cc33", "#3399ff", "#66cc66"] }],
    };
  };

  const getSuggestions = () => {
    if (feedbacks.length === 0) return "No feedback yet.";
    const avgRating = feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length;
    if (avgRating > 4) return "Great job! Keep up the good work! 😊";
    if (avgRating > 3) return "Good work! A few improvements can make it even better. 👍";
    return "Consider addressing key issues to enhance user experience. 🚀";
  };

  return (
    <div className="container">
      <div className="room-content">
        <h2 className="text-center"><strong>Room:</strong> {roomId}</h2>

        {isCreator && <p className="text-muted"><strong>👥 Active Users:</strong> {activeUsers - 1 }</p>}

        {!isCreator && (
          <>
            <h3>Give Feedback</h3>
            <p className="text-muted">Hey <strong>{username}</strong>, your feedback matters! 😊</p>
            <label className="form-label">Rating: {rating} ⭐</label>
            <input type="range" className="form-range" min="1" max="5" step="1" value={rating} onChange={(e) => setRating(Number(e.target.value))} />
            <input type="text" className="form-control my-3" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Your feedback" />
            <button className="btn btn-primary" style={{ width: "450px" }} onClick={submitFeedback}>Submit Feedback</button>
          </>
        )}

        {isCreator && (
          <>
            <h4><strong>Feedbacks from Users:</strong></h4>
            {feedbacks.length === 0 ? <p>No feedback yet.</p> : (
              <table className="table table-hover table-bordered mt-3">
                <thead className="table-dark">
                  <tr><th>Username</th><th>Rating</th><th>Comment</th><th>Timestamp</th></tr>
                </thead>
                <tbody>
                  {feedbacks.map((fb) => (
                    <tr key={fb.id}>
                      <td>{fb.username}</td>
                      <td>{fb.rating}⭐</td>
                      <td>{fb.comment}</td>
                      <td>{fb.timestamp?.seconds ? new Date(fb.timestamp.seconds * 1000).toLocaleString() : "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <h4 className="mt-4"><strong>Feedback Rating Distribution:</strong></h4>
            <div className="chart-container"><Pie data={getRatingDistribution()} /></div>
            <h4 className="mt-4"><strong>Suggestions:</strong></h4>
            <p>{getSuggestions()}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Room;
