const express = require("express");
const DataTongkat = require("../models/DataTongkat");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// --- Simpan data dari perangkat tertentu ---
router.post("/:id_perangkat", verifyToken, async (req, res) => {
  try {
    const { id_perangkat } = req.params;
    const data = new DataTongkat({ ...req.body, id_perangkat });
    await data.save();
    res.status(201).json({ message: "✅ Data berhasil disimpan", data });
  } catch (err) {
    res.status(400).json({ message: "❌ Gagal menyimpan data", error: err.message });
  }
});

// --- Ambil data berdasarkan perangkat user ---
router.get("/:id_perangkat", verifyToken, async (req, res) => {
  try {
    const { id_perangkat } = req.params;
    const data = await DataTongkat.find({ id_perangkat }).sort({ createdAt: -1 }).limit(50);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "❌ Gagal mengambil data", error: err.message });
  }
});

module.exports = router;
