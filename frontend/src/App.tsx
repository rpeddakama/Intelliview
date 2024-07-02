import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

import theme from "./theme/theme";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoutes from "./context/ProtectedRoutes";
import Profile from "./components/Profile";
import Recorder from "./components/Recorder";
import PastSessions from "./components/PastSessions";
import TempForm from "./components/tempForm";
import TempSessions from "./components/TempSessions";
import SessionDetail from "./components/SessionDetail";
import SignUpForm from "./components/helloworld";
import { CssBaseline } from "@mui/material";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route
            path="helloworld"
            element={
              <SignUpForm
                question="whats your name?"
                transcription="robert"
                analysis="boring name"
              />
            }
          />
          <Route path="register" element={<Register />} />
          <Route path="tempform" element={<TempForm />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="recorder" element={<Recorder />} />
            <Route path="past-sessions" element={<PastSessions />} />
            <Route path="temp-sessions" element={<TempSessions />} />
            <Route path="/session/:id" element={<SessionDetail />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
