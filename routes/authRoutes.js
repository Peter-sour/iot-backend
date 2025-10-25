const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// --- Register User ---
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, id_perangkat } = req.body;

    if (!name || !email || !password || !id_perangkat)
      return res.status(400).json({ message: "Semua field wajib diisi." });

    const existing = await User.findOne({ $or: [{ email }, { id_perangkat }] });
    if (existing)
      return res.status(400).json({ message: "Email atau ID perangkat sudah digunakan." });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, id_perangkat });
    await user.save();

    res.status(201).json({ message: "Registrasi user berhasil." });
  } catch (err) {
    res.status(500).json({ message: "Error server", error: err.message });
  }
});

// --- Login User ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email tidak ditemukan." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Password salah." });

    const token = jwt.sign(
      { id: user._id, role: "user", id_perangkat: user.id_perangkat },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login berhasil", token, id_perangkat: user.id_perangkat });
  } catch (err) {
    res.status(500).json({ message: "Error server", error: err.message });
  }
});

module.exports = router;
