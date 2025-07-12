const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const generateResetToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    const resetToken = generateResetToken(user._id);
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    const emailResponse = await resend.emails.send({
      from: "WisdomChain <your_verified_email@yourdomain.com>", 
      to: email,
      subject: "Reset Your Password",
      html: `
        <h2>Hello ${user.name || "there"},</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn't request this, you can ignore this email.</p>
      `,
    });

    console.log("Resend email sent:", emailResponse);
    res.status(200).json({ message: "Reset link sent to your email." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Something went wrong while sending email" });
  }
};
module.exports = {
  forgotPassword,
};
