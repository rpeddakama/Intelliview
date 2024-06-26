import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import MainSection from "./components/MainSection";
import Settings from "./components/Settings";
import About from "./components/About";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoutes from "./context/ProtectedRoutes";
import HelloWorld from "./components/HelloWorld";
import Profile from "./components/Profile";
import Upload from "./components/Upload";
import Recorder from "./components/Recorder";
import PastSessions from "./components/PastSessions";
import TempForm from "./components/tempForm";
import TempForm2 from "./components/tempForm2";

const App: React.FC = () => {
  return (
    <Router>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<MainSection />} />
        <Route path="settings" element={<Settings />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="upload" element={<Upload />} />
        <Route path="tempform" element={<TempForm />} />
        <Route path="tempform2" element={<TempForm2 />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/hello-world" element={<HelloWorld />} />
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
