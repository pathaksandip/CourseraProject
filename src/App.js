import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import User from "./Components/User";
import Register from "./Components/Register";
import axios from "axios";
import Adminpage from "./Components/Adminpage";
import AuthGuard from "./Components/AuthGuard";
import ForgotPassword from "./Components/ForgetPassword";
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<User />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/adminpage"
            element={
              <AuthGuard>
                <Adminpage />
              </AuthGuard>
            }
          />
          <Route path="/forgetpassword" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
