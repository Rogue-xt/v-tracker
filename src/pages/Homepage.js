import React from "react";
// import Clientform from "../Components/Clientform";
import Dashboard from "../Components/Dashboard";

function Homepage() {
  return (
    <div className="home-div" style={{ textAlign: "center" }}>
      <div className="p-6">
        <Dashboard />
      </div>
    </div>
  );
}

export default Homepage;
