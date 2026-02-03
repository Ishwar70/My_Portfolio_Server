const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(cors({
  origin: "https://my-portfolio-sigma-weld-30.vercel.app/",
  methods: ["GET", "POST"],
}));

app.use(express.json());

app.post("/send-mail", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASS, // Gmail App Password
      },
    });

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.MY_EMAIL}>`,
      to: process.env.MY_EMAIL,
      replyTo: email,
      subject: `📩 New Message from ${name}`,
      html: `
        <h3>New Contact Form Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "📩 Email sent successfully!",
    });

  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({
      success: false,
      message: "❌ Failed to send email",
    });
  }
});

app.listen(5000, () =>
  console.log("🚀 Server running on http://localhost:5000")
);
