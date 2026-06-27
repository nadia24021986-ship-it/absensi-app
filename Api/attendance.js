// /api/attendance.js
let db = { globalSchedules: [], attendanceLogs: [] }; // Catatan: Data in-memory akan ter-reset di Serverless. Gunakan Database eksternal seperti Firestore/Supabase untuk produksi.

export default async function handler(req, res) {
    const { method, url } = req;
    
    // Header CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (url === '/api/hrd/upload-schedule' && method === 'POST') {
        db.globalSchedules = [{ name: "Budi", date: "2026-06-27", startTime: "08:00", endTime: "17:00" }];
        return res.json({ status: "success", message: "Jadwal diunggah." });
    }
    
    // Tambahkan logika /api/employee/schedule, /api/attendance/check-in, dsb di sini...
    
    res.status(404).json({ message: "Endpoint tidak ditemukan" });
}
