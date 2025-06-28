import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./Context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard";
import Header from "./Components/Header";
import Homepage from "./pages/Homepage";


const App = () => {
  const { currentUser } = useAuth();

  return (
    
    <Router>
      <Header />

      <Routes>
        {/* Landing page: Login or if logged in, show some protected page or just stay on login */}
        <Route
          path="/"
          element={
            !currentUser ? (
              <Login />
            ) : (
              <Homepage/>
              // <div className="p-6">
              //   <h1>Welcome, {currentUser.name || currentUser.email}!</h1>
              //   <p>
              //     You are logged in as: <strong>{currentUser.userType}</strong>
              //   </p>
              // </div>
            )
          }
        />

        <Route
          path="/signup"
          element={!currentUser ? <Signup /> : <Navigate to="/" replace />}
        />

        {/* Redirect unknown routes to "/" */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
