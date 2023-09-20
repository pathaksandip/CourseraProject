import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminPage() {
  const [data, setData] = useState(null);
  const [name, setName] = useState(localStorage.getItem("name"));
  const [formData, setFormData] = useState({
    bookName: "",
    ISBN: "",
    author: "",
    bookReview: "",
  });

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve the token from localStorage
    const token = localStorage.getItem("token");

    // Send the book data to the backend API
    try {
      const response = await axios.post("/api/add-book", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle the response as needed
      console.log("Book added successfully", response.data);

      // Clear the form
      setFormData({
        bookName: "",
        ISBN: "",
        author: "",
        bookReview: "",
      });
    } catch (error) {
      // Handle any errors
      console.error("Error adding book:", error);
    }
  };

  return (
    <div>
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
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="bookName">Book Name:</label>
          <input
            type="text"
            name="bookName"
            id="bookName"
            value={formData.bookName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="ISBN">ISBN:</label>
          <input
            type="text"
            name="ISBN"
            id="ISBN"
            value={formData.ISBN}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            name="author"
            id="author"
            value={formData.author}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="bookReview">Book Review:</label>
          <textarea
            name="bookReview"
            id="bookReview"
            value={formData.bookReview}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {data && (
        <div>
          <p>Protected Resource Data:</p>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
