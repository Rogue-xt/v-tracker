import React, { useState } from "react";
import { Link } from "react-router-dom";
import {useAuth} from "../Context/AuthContext"
import "../App.css";

// const Login = ({ onLogin }) => {

const Login = () => {
  const { onLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("customer");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Email is invalid";
    }
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Minimum 6 characters";

    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    // if (Object.keys(validationErrors).length === 0) {
   
    //   const testEmail = "admin@example.com";
    //   const testPassword = "123456";

    //   if (email === testEmail && password === testPassword) {
    //     const dummyUser = {
    //       name: "Sneha",
    //       email,
    //       userType,
    //     };
    //     onLogin(dummyUser); // Log in using context
    //   } else {
    //     alert("Invalid email or password");
    //   }
    // }

    if (Object.keys(validationErrors).length === 0) {
      fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, userType }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            onLogin(data.user);
          } else {
            alert(data.message || "Login failed");
          }
        });
    }
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && (
          <p className="auth-error text-red-500 text-sm">{errors.email}</p>
        )}
      </div>

      <div className="auth-field mb-3">
        <label>Password</label>
        <input
          type="password"
          className="w-full border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
      </div>

      <div className="auth-field mb-4">
        <label>User Type</label>
        <select
          className="w-full border p-2"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button
        type="submit"
        className="auth-button bg-blue-600 text-white py-2 px-4 w-full rounded hover:bg-blue-700"
      >
        Login
      </button>

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
