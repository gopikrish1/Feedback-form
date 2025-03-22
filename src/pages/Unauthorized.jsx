import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/"); // Redirect to the homepage or login page
  };

  return (
    <div className="container mt-5">
      <h2>Unauthorized Access</h2>
      <p>
        ❌ You do not have permission to view this page. Please make sure you are
        logged in or have the correct access rights.
      </p>
      <button className="btn btn-primary" onClick={handleRedirect}>
        Go Back to Home
      </button>
    </div>
  );
};

export default Unauthorized;
