import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
function User() {
  const navigate = useNavigate();

  const [loginData, setloginData] = useState({
    email: "",
    password: "",
  });
  const [loginerror, setloginerror] = useState("");
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setloginData({
      ...loginData,
      [name]: value,
    });
  };
  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const Response = await axios.post("/api/login", loginData);
      console.log("Response data:", Response.data); // Log the entire response data
      if (Response.status === 200) {
        console.log("Login successful");
        const token = Response.data.token;
        const name = Response.data.name; // Use "email" instead of "userName"
        localStorage.setItem("token", token);
        localStorage.setItem("name", name);
        navigate("/adminpage");
      } else {
        setloginerror("Invalid email or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setloginerror("Error during login");
    }
  };
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div
        className="login-form"
        style={{
          border: "1px solid #ccc",
          borderRadius: "20px",
          backgroundColor: "#f5f5f5",
          padding: "40px",
        }}
      >
        <h2>Login</h2>
        <Form onSubmit={handlesubmit}>
          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              required
              value={loginData.email}
              onChange={handleInputChange}
              className="mb-3"
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleInputChange}
              required
              className="mb-3"
            />
          </Form.Group>
          {loginerror && <p className="text-danger">{loginerror}</p>}

          <div className="text-center">
            <Button variant="primary" type="submit">
              Login
            </Button>
          </div>
          <p>
            <Link to={"/forgetpassword"} style={{ marginLeft: "70px" }}>
              Forget Password
            </Link>
          </p>
          <p>
            Don't Have an account <Link to={"/register"}> Register Here</Link>
          </p>
        </Form>
      </div>
    </Container>
  );
}

export default User;
