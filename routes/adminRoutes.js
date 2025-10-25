const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const DataTongkat = require("../models/DataTongkat");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// --- Register Admin ---
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const exist = await Admin.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email admin sudah digunakan." });

    const hashed = await bcrypt.hash(password, 10);
    const admin = new Admin({ username, email, password: hashed });
    await admin.save();

    res.status(201).json({ message: "Admin berhasil dibuat." });
  } catch (err) {
    res.status(500).json({ message: "Error server", error: err.message });
  }
});

// --- Login Admin ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Admin tidak ditemukan." });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(400).json({ message: "Password salah." });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login admin berhasil", token });
  } catch (err) {
    res.status(500).json({ message: "Error server", error: err.message });
  }
});

// --- Ambil semua data IoT (admin only) ---
router.get("/data", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Akses ditolak." });

    const data = await DataTongkat.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Gagal ambil data", error: err.message });
  }
});

// --- Ambil data per perangkat ---
router.get("/data/:id_perangkat", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Akses ditolak." });

    const { id_perangkat } = req.params;
    const data = await DataTongkat.find({ id_perangkat }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Gagal ambil data", error: err.message });
  }
});

module.exports = router;
