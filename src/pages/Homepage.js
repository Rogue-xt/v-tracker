import React from "react";
import { useAuth } from "../Context/AuthContext";

function Homepage() {
  const { currentUser } = useAuth();

  return (
    <div className="home-div" style={{ textAlign: "center" }}>
      <div className="p-6">
        <h1>Welcome, {currentUser?.name || currentUser?.email}!</h1>
        <p>
          You are logged in as: <strong>{currentUser?.userType}</strong>
        </p>
      </div>
    </div>
  );
}

export default Homepage;
