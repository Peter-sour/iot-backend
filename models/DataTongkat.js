const mongoose = require("mongoose");

const DataTongkatSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("DataTongkat", DataTongkatSchema);
