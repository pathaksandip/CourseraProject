import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Form, Button, Table } from "react-bootstrap";

function AdminPage() {
  const [name, setName] = useState(localStorage.getItem("name"));
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    bookName: "",
    ISBN: "",
    author: "",
    bookReview: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post("/api/book", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Book added successfully", response.data);

      setFormData({
        bookName: "",
        ISBN: "",
        author: "",
        bookReview: "",
      });
      setSuccessMessage("Book added successfully");
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
    <Container>
      <div style={{ float: "right", marginRight: "20px" }}>
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
            background: "#f5f5f5",
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
            marginTop: "10px",
          }}
        >
          {name}
        </div>
      </div>
      <h2>Welcome {name}</h2>
      <Form
        onSubmit={handleSubmit}
        style={{
          border: "3px solid #ccc",
          width: "50%",
          padding: "1%",
          borderRadius: "3%",
          margin: "1%",
        }}
      >
        <Form.Group>
          <Form.Label>Book Name:</Form.Label>
          <Form.Control
            type="text"
            name="bookName"
            value={formData.bookName}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>ISBN:</Form.Label>
          <Form.Control
            type="text"
            name="ISBN"
            value={formData.ISBN}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Author:</Form.Label>
          <Form.Control
            type="text"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Book Review:</Form.Label>
          <Form.Control
            as="textarea"
            name="bookReview"
            value={formData.bookReview}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        {successMessage && (
          <div variant="success" className="mt-3">
            {successMessage}
          </div>
        )}
        <div className="text-center mt-2">
          <Button variant="primary" type="submit">
            Publish
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default AdminPage;
