import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
const Signup = () => {
  // Form data stored as object
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    userType: "customer",
  });

  // To hold field-specific errors
  const [errors, setErrors] = useState({});

  // ✅ Basic validation logic
  const validate = () => {
    const errs = {};

    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Invalid email format";

    if (!form.phone.trim()) errs.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone))
      errs.phone = "Phone must be 10 digits";

    if (!form.password.trim()) errs.password = "Password is required";
    else if (form.password.length < 6)
      errs.password = "Minimum 6 characters required";

    return errs;
  };

  // ✅ Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    // If no errors, submit to backend
    if (Object.keys(validationErrors).length === 0) {
      fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message || "Signup successful");
          setForm({
            name: "",
            email: "",
            phone: "",
            password: "",
            userType: "customer",
          });
        });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="auth-container max-w-md mx-auto p-6 bg-white shadow rounded"
    >
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>

      {/* Name */}
      <div className="auth-field mb-3">
        <label>Full Name</label>
        <input
          type="text"
          className="w-full border p-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        {errors.name && (
          <p className="auth-error text-red-500 text-sm">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div className="auth-field mb-3">
        <label>Email</label>
        <input
          type="email"
          className="w-full border p-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && (
          <p className="auth-error text-red-500 text-sm">{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div className="auth-field mb-3">
        <label>Phone Number</label>
        <input
          type="tel"
          className="w-full border p-2"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        {errors.phone && (
          <p className="auth-error text-red-500 text-sm">{errors.phone}</p>
        )}
      </div>

      {/* Password */}
      <div className="auth-field mb-3">
        <label>Password</label>
        <input
          type="password"
          className="w-full border p-2"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {errors.password && (
          <p className="auth-error text-red-500 text-sm">{errors.password}</p>
        )}
      </div>

      {/* User Type */}
      <div className="auth-field mb-4">
        <label>User Type</label>
        <select
          className="w-full border p-2"
          value={form.userType}
          onChange={(e) => setForm({ ...form, userType: e.target.value })}
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button
        type="submit"
        className="auth-button bg-green-600 text-white py-2 px-4 w-full rounded hover:bg-green-700"
      >
        Create Account
      </button>
      <p className="auth-switch mt-4 text-sm text-center">
        Already have an account,{" "}
        <Link
          to="/"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Login
        </Link>
      </p>
    </form>
  );
};

export default Signup;
