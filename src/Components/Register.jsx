import axios from "axios";
import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
function Register() {
  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [passworderror, setpassworderror] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformdata({
      ...formdata,
      [name]: value,
    });
    if (name === "password" || name === "confirmpassword") {
      setpassworderror("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formdata.password !== formdata.confirmpassword) {
      setpassworderror("Passwords do not match");
    }
    try {
      const Push = await axios.post("/api/register", formdata);
      if (Push.status === 200) {
        console.log("registration successful");
      }
    } catch (error) {
      console.error("Error during registration", error);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div
        className="registration-form p-5"
        style={{
          border: "1px solid #ccc",
          borderRadius: "20px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <h2>Register Here</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formdata.name}
              required
              className="mb-3"
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formdata.email}
              onChange={handleInputChange}
              required
              className="mb-3"
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter a password"
              value={formdata.password}
              onChange={handleInputChange}
              required
              className="mb-3"
            />
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmpassword"
              placeholder="Confirm your password"
              value={formdata.confirmpassword}
              onChange={handleInputChange}
              required
              className="mb-3"
            />
          </Form.Group>
          {passworderror && <p className="text-danger">{passworderror}</p>}
          <div className="text-center">
            <Button variant="primary" type="submit">
              Register
            </Button>
            <p>
              <Link to={"/"}>Click Here to Login</Link>
            </p>
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default Register;
