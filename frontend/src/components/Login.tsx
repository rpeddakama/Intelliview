import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      alert("Login successful");

      // Store tokens in local storage
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      // Redirect to the dashboard page
      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login failed. Please check your email and password.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
