const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const cors = require("cors");
app.use(bodyParser.urlencoded({ extended: false }));

const User = require("./Schema/UserData");
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
mongoose
  .connect(
    "mongodb+srv://pathaksandip321:i73bswYVGQRxLQLz@cluster0.drpkplt.mongodb.net/Coursera?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log("Fail Connecting Mongodb");
  });
function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });
}
function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
}
//postapi
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, confirmpassword } = req.body;
    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Password Donot match" });
    }
    const Register = await User.create({
      name,
      email,
      password,
      confirmpassword,
    });
    res.status(200).json({ message: "Registerd successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "errors occured" });
  }
});
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.password !== password) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }

  const token = generateToken(user); // Generate JWT token
  res.status(200).json({
    success: true,
    message: "Login Successful",
    token,
    name: user.name,
  });
});
//serverrun
app.listen(5000, () => {
  console.log("server is running in port 5000");
});
