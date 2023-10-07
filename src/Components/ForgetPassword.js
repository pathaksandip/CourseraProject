// src/ForgotPassword.js
import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [otp, setOTP] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false); // Track OTP verification
  const [newPassword, setNewPassword] = useState(""); // New password state
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleSuccessMessage = () => {
    setMessage("OTP sent successfully!");

    // Set a timeout to clear the success message after 1 second (1000 milliseconds)
    setTimeout(() => {
      setMessage("");
    }, 1000);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/reset/password", {
        email: email, // Include the email in the request body
      });

      if (response.status === 200) {
        handleSuccessMessage();

        setShowOTPInput(true);
      } else {
        setMessage("Failed to send OTP");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to send OTP");
    }
  };
  const handleOTPChange = (e) => {
    setOTP(e.target.value);
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/verify/otp", {
        otp: otp,
        email: email, // Replace with the user's email address
      });

      if (response.status === 200) {
        setIsOTPVerified(true);
        setMessage("OTP successfully verified.");
      } else {
        setMessage(
          "Invalid OTP. Please double-check the OTP you received in your email."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to verify OTP. Please try again.");
    }
  };

  const renderPasswordResetForm = () => {
    return (
      <div className="justify-content-center mt-3">
        <Form.Group>
          <Form.Label>New Password:</Form.Label>
          {/* <Form.Control
            type="password"
            name="newPassword"
            // Add state and event handler for new password input
            value={newPassword}
            required
          /> */}

          <Form.Control
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          className="d-block mx-auto mt-2"
          onClick={handlePasswordReset}
        >
          Reset Password
        </Button>
      </div>
    );
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put("/api/change/password", {
        email: email, // Include the email of the user requesting the password reset
        newPassword: newPassword, // Include the new password
      });

      if (response.status === 200) {
        // Password reset was successful
        setMessage("Password reset successful!");
        // Clear any sensitive information from the state
        setEmail("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        // Handle the case where password reset failed
        setMessage("Failed to reset password");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to reset password");
    }
  };

  return (
    <Container>
      <Row style={{ width: "80%" }} className="justify-content-center mt-5 ">
        <Col xs={12} md={6}>
          <div className="border p-3" style={{ backgroundColor: "smokywhite" }}>
            <h2 className="text-center">Forgot Password</h2>
            <Form
              onSubmit={handleSubmit}
              className="justify-content-center mt-10"
            >
              <Form.Group>
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </Form.Group>
              {message && <p className="mt-3 text-center">{message}</p>}
              <Button
                type="submit"
                variant="primary"
                className="d-block mx-auto mt-2"
              >
                Send OTP
              </Button>
            </Form>
            {showOTPInput && (
              <Form
                onSubmit={handleOTPSubmit}
                className="justify-content-center mt-3"
              >
                <Form.Group>
                  <Form.Label>Enter OTP:</Form.Label>
                  <Form.Control
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={handleOTPChange}
                    required
                  />
                </Form.Group>
                <Button
                  type="submit"
                  variant="primary"
                  className="d-block mx-auto mt-2"
                >
                  Submit OTP
                </Button>
                {isOTPVerified && renderPasswordResetForm()}
              </Form>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ForgotPassword;
