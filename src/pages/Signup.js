import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { name, email, phone, password } = form;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Invalid email format";

    if (!phone.trim()) errs.phone = "Phone is required";
    else if (!/^\d{10}$/.test(phone)) errs.phone = "Phone must be 10 digits";

    if (!password.trim()) errs.password = "Password is required";
    else if (password.length < 6)
      errs.password = "Minimum 6 characters required";

    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      fetch("https://client-management-server.onrender.com/usersignup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            alert("Signup successful!");
            console.log("Signup successful");
            console.log("Redirecting to login...");
            navigate("/login");
          } else {
            alert(data.message || "Signup failed");
            console.log("Failing");
          }
        });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="auth-container max-w-md mx-auto p-6 bg-white shadow rounded"
    >
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>

      <div className="auth-field mb-3">
        <label>Full Name</label>
        <input
          name="name"
          type="text"
          className="w-full border p-2"
          value={name}
          onChange={handleChange}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div className="auth-field mb-3">
        <label>Email</label>
        <input
          name="email"
          type="email"
          className="w-full border p-2"
          value={email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div className="auth-field mb-3">
        <label>Phone Number</label>
        <input
          name="phone"
          type="tel"
          className="w-full border p-2"
          value={phone}
          onChange={handleChange}
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
      </div>

      <div className="auth-field mb-3">
        <label>Password</label>
        <input
          name="password"
          type="password"
          className="w-full border p-2"
          value={password}
          onChange={handleChange}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
      </div>
      <div className="btn-wrap">
        <button
          type="submit"
          className="auth-button bg-green-600 text-white py-2 px-4 w-full rounded hover:bg-green-700"
        >
          Create Account
        </button>
      </div>

      <p className="auth-switch mt-4 text-sm text-center">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Login
        </Link>
      </p>
    </form>
  );
};

export default Signup;
