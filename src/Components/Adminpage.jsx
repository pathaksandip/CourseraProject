import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminPage() {
  const [data, setData] = useState(null);
  const name = localStorage.getItem("name");
  useEffect(() => {
    // Retrieve the token from wherever it is stored (e.g., localStorage)
    const token = localStorage.getItem("token");

    axios
      .get("/api/protected-resource", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Handle the response data as needed
        setData(response.data);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error accessing protected resource:", error);
      });
  }, []);

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
