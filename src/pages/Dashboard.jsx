import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';

// Registering the necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [averageRating, setAverageRating] = useState(4.5); 
  const [emotionDistribution, setEmotionDistribution] = useState({ happy: 20, sad: 5, neutral: 2 });
  const navigate = useNavigate();
  
  // Fetch roomId from URL (you can pass this as a prop or get it from the URL)
  const roomId = "your-room-id"; // Replace with actual room ID (from useParams or props)

  // Check if the user is the creator
  useEffect(() => {
    const roomCreator = localStorage.getItem("roomCreator");
    if (roomCreator !== roomId) {
      // If the current user is not the creator, redirect them to a different page or show a message
      navigate('/unauthorized');  // Redirect to an unauthorized page or other component
    }
  }, [roomId, navigate]);

  // Data for Pie chart - Emotion distribution
  const emotionData = {
    labels: ['Happy', 'Sad', 'Neutral'],
    datasets: [
      {
        data: [emotionDistribution.happy, emotionDistribution.sad, emotionDistribution.neutral],
        backgroundColor: ['#FFB6C1', '#FF6347', '#98FB98'], // Colors for each segment
        borderColor: ['#FF69B4', '#FF4500', '#32CD32'], // Border colors
        borderWidth: 1,
      },
    ],
  };

  // Options for Pie chart
  const pieOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div>
      <h4>Average Rating: {averageRating} ⭐</h4>

      <h5>Emotion Distribution:</h5>
      <ul>
        <li>Happy: {emotionDistribution.happy}</li>
        <li>Sad: {emotionDistribution.sad}</li>
        <li>Neutral: {emotionDistribution.neutral}</li>
      </ul>

      {/* Pie Chart for Emotion Distribution */}
      <div style={{ width: '50%', height: '300px' }}>
        <Pie data={emotionData} options={pieOptions} />
      </div>
    </div>
  );
};

export default Dashboard;
