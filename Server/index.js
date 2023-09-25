const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: false }));
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("./Schema/UserData");
const Book = require("./Schema/BookData");
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
const generateOTP = () => {
  return `${Math.floor(1000 + Math.random() * 9000)}`;
};
const sendVerifyEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.elasticemail.com",
      port: 2525,
      auth: {
        user: "pathaksandip321@gmail.com",
        pass: "3545ABBB8C959DA9940F6A270DDAFBF51462",
      },
    });

    const mailOption = {
      from: "pathaksandip321@gmail.com",
      to: email,
      subject: "For verification process demo",
      html: `<p>This is your ${otp} OTP code. Use this code to Reset Password</p>`,
    };

    const info = await transporter.sendMail(mailOption);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.log(error.message);
    throw error; // Re-throw the error to handle it elsewhere
  }
};

app.post("/api/reset/password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Update the user's record with the OTP
    user.otp = otp;
    await user.save();

    // Send OTP to the user's email
    await sendVerifyEmail(email, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred" });
  }
});

app.post("/api/verify/otp", async (req, res) => {
  const { otp, email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp === otp) {
      // OTP is valid, clear the OTP in the user's record
      user.otp = null;
      await user.save();

      res.status(200).json({ message: "OTP is valid." });
    } else {
      res.status(401).json({ message: "Invalid OTP. Please try again." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred" });
  }
});

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
  //postbook details

  const token = generateToken(user); // Generate JWT token
  res.status(200).json({
    success: true,
    message: "Login Successful",
    token,
    name: user.name,
  });
});
app.post("/api/book", async (req, res) => {
  try {
    const { bookName, ISBN, author, bookreview } = req.body;
    const BookDetails = await Book.create({
      bookName,
      ISBN,
      author,
      bookreview,
    });
    res.status(200).json({ message: "Registered Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error occured" });
  }
});

app.post("/api/change/password", authenticateToken, async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the current password matches the user's stored password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    // Hash the new password and update it in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred" });
  }
});

//serverrun
app.listen(5000, () => {
  console.log("server is running in port 5000");
});
