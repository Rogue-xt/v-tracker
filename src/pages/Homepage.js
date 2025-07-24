import React from "react";
import Clientform from "../Components/Clientform";
// import { useAuth } from "../Context/AuthContext";


function Homepage() {
  // const { currentUser } = useAuth();

  return (
    <div className="home-div" style={{ textAlign: "center" }}>
      <div className="p-6">
        <Clientform/>
      </div>
    </div>
  );
}

export default Homepage;
