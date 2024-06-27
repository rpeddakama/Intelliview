import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoutes from "./context/ProtectedRoutes";
import Profile from "./components/Profile";
import Upload from "./components/Upload";
import Recorder from "./components/Recorder";
import PastSessions from "./components/PastSessions";
import TempForm from "./components/tempForm";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="upload" element={<Upload />} />
        <Route path="tempform" element={<TempForm />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="recorder" element={<Recorder />} />
          <Route path="past-sessions" element={<PastSessions />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
