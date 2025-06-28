import React from "react";
import { useAuth } from "../Context/AuthContext";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const handleLogout = () => {
logout();
 
  };

  return (
    <header className="bg-gray-100 p-4 flex justify-between items-center">
      <div className="main-header">
        <p className="text-center font-semibold">Header Coming Soon.. !</p>
      </div>

      {currentUser ? (
        <div className="log text-sm text-right">
          <p>
            <strong>{currentUser.name} </strong>Logged in as:
            <strong>{currentUser.userType}</strong>
            <button onClick={handleLogout} className="log-button">
              Logout
            </button>
          </p>
        </div>
      ) : (
        <p className="text-sm"></p>
      )}
    </header>
  );
};

export default Header;
