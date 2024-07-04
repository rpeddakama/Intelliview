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
import SessionDetail from "./components/SessionDetail";
import SignUpForm from "./components/helloworld";
import { CssBaseline } from "@mui/material";
import NotFound from "./components/NotFound";

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
          <Route path="*" element={<NotFound />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="recorder" element={<Recorder />} />
            <Route path="past-sessions" element={<PastSessions />} />
            <Route path="/session/:id" element={<SessionDetail />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
