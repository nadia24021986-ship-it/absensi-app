// /api/attendance.js

// Fungsi handler utama
export default async function handler(req, res) {
  // 1. Header untuk mencegah error CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Menangani pre-flight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. Logic API Anda
  try {
    if (req.method === 'POST') {
      // Contoh: Jika user melakukan POST ke /api/attendance
      return res.status(200).json({ status: "success", message: "API Berjalan Normal" });
    } else {
      return res.status(200).json({ status: "success", message: "Gunakan POST untuk absensi" });
    }
  } catch (error) {
    // Jika ada error di dalam, kirim pesan error (agar tidak crash 500)
    return res.status(500).json({ status: "error", message: error.message });
  }
}
