import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import MainSection from "./components/MainSection";
import Settings from "./components/Settings";
import About from "./components/About";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Register from "./components/Register";
import { CssBaseline, Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ProtectedRoutes from "./context/ProtectedRoutes";
import HelloWorld from "./components/HelloWorld";

const theme = createTheme();

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
          <Route element={<ProtectedRoutes />}>
            <Route path="/hello-world" element={<HelloWorld />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
