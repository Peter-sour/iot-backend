require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Koneksi MongoDB ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Berhasil terhubung ke MongoDB"))
.catch(err => console.error("❌ Koneksi MongoDB gagal:", err));

mongoose.connection.on("error", (err) => console.error("❌ MongoDB Error:", err));
mongoose.connection.on("disconnected", () => console.warn("⚠️ MongoDB Disconnected!"));

// --- Schema & Model ---
const DataTongkatSchema = new mongoose.Schema({
  id_perangkat: { type: String, required: true },
  stempel_waktu_ms: Number,
  jarak_cm: Number,
  aktivitas: String,
  akselerasi: { x: Number, y: Number, z: Number },
  giroskop: { x: Number, y: Number, z: Number },
  magnitudo_aksel: Number,
  magnitudo_gyro: Number,
  akurasi_jarak: Number,
  akurasi_gyro: Number,
  akurasi_aksel: Number,
  persen_baterai: Number,
  tegangan_baterai: Number,
  kekuatan_sinyal: Number,
  detak_jantung: Number,
}, { timestamps: true });

const DataTongkat = mongoose.model('DataTongkat', DataTongkatSchema);

// --- Routes ---
app.post('/api/data', async (req, res) => {
  console.log("📥 Data masuk:", req.body);
  try {
    const dataBaru = new DataTongkat(req.body);
    await dataBaru.save();
    res.status(201).json({ message: "✅ Data berhasil disimpan", data: dataBaru });
  } catch (error) {
    res.status(400).json({ message: "❌ Gagal menyimpan data", error: error.message });
  }
});

app.get('/api/data', async (req, res) => {
  try {
    const semuaData = await DataTongkat.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json(semuaData);
  } catch (error) {
    res.status(500).json({ message: "❌ Gagal mengambil data", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
