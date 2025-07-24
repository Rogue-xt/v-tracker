import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please fill in both email and password.");
      return;
    }
    // console.log(username);
    fetch("https://client-management-server.onrender.com/userlogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log("Login response:", data);

        if (data.status) {
          login(data.user, data.token);
          console.log("navigating to /");
          navigate("/");
          console.log("working");
        } else {
          alert(data.message || "Login failed. Please check your credentials.");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert("Something went wrong during login.");
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="auth-container max-w-md mx-auto p-6 bg-white shadow rounded"
    >
      <h2 className="text-xl font-bold mb-4">Login</h2>

      <div className="auth-field mb-3">
        <label>Email</label>
        <input
          type="email"
          className="w-full border p-2"
          value={username}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="auth-field mb-3">
        <label>Password</label>
        <input
          type="password"
          className="w-full border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="btn-wrap">
        <button
          type="submit"
          className="auth-button bg-blue-600 text-white py-2 px-4 w-full rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
      <p className="auth-switch mt-4 text-sm text-center">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
};

export default Login;
