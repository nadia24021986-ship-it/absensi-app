const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Simulasi Database In-Memory
const db = {
    globalSchedules: [], // Menyimpan hasil "scan" jadwal HRD
    attendanceLogs: []   // Menyimpan riwayat absen karyawan
};

// ==========================================
// 1. ENDPOINT HRD: SIMULASI UPLOAD JADWAL
// ==========================================
app.post('/api/hrd/upload-schedule', (req, res) => {
    // Simulasi AI membaca foto jadwal dan mengubahnya jadi format ini
    const simulatedAIResult = [
        { name: "Budi", date: new Date().toISOString().split('T')[0], startTime: "08:00", endTime: "17:00" },
        { name: "Siti", date: new Date().toISOString().split('T')[0], startTime: "12:00", endTime: "21:00" }
    ];

    // Simpan ke database
    db.globalSchedules = [...db.globalSchedules, ...simulatedAIResult];

    res.json({
        status: "success",
        message: "Jadwal harian berhasil di-upload dan didistribusikan oleh AI.",
        data: db.globalSchedules
    });
});

// ==========================================
// 2. ENDPOINT KARYAWAN: CEK JADWAL PRIBADI
// ==========================================
app.get('/api/employee/schedule/:name', (req, res) => {
    const employeeName = req.params.name.toLowerCase();
    const today = new Date().toISOString().split('T')[0];

    // Filter jadwal khusus untuk karyawan yang login hari ini
    const todaySchedule = db.globalSchedules.find(sch => 
        sch.name.toLowerCase() === employeeName && sch.date === today
    );

    if (!todaySchedule) {
        return res.status(404).json({ message: "Anda tidak memiliki jadwal kerja hari ini." });
    }
    res.json({ status: "success", data: todaySchedule });
});

// ==========================================
// 3. ENDPOINT KARYAWAN: CHECK-IN
// ==========================================
app.post('/api/attendance/check-in', (req, res) => {
    const { name } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const serverTime = new Date().toTimeString().split(' ')[0].substring(0, 5); // Format HH:MM

    const schedule = db.globalSchedules.find(sch => sch.name.toLowerCase() === name.toLowerCase() && sch.date === today);
    if (!schedule) return res.status(403).json({ message: "Gagal: Jadwal tidak ditemukan." });

    // Cek apakah sudah absen hari ini
    const existingLog = db.attendanceLogs.find(log => log.name.toLowerCase() === name.toLowerCase() && log.date === today);
    if (existingLog) return res.status(400).json({ message: "Anda sudah Check-In hari ini." });

    // Evaluasi Telat / Tepat Waktu
    let statusIn = "Tepat Waktu";
    if (serverTime > schedule.startTime) statusIn = "Terlambat";

    const newLog = {
        id: Date.now(),
        name,
        date: today,
        scheduleIn: schedule.startTime,
        scheduleOut: schedule.endTime,
        actualIn: serverTime,
        actualOut: null,
        statusIn,
        statusOut: null
    };

    db.attendanceLogs.push(newLog);
    res.json({ status: "success", message: `Check-In berhasil jam ${serverTime}. Status: ${statusIn}`, data: newLog });
});

// ==========================================
// 4. ENDPOINT KARYAWAN: CHECK-OUT
// ==========================================
app.post('/api/attendance/check-out', (req, res) => {
    const { name } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const serverTime = new Date().toTimeString().split(' ')[0].substring(0, 5);

    const activeLog = db.attendanceLogs.find(log => log.name.toLowerCase() === name.toLowerCase() && log.date === today);
    if (!activeLog) return res.status(404).json({ message: "Log Check-In tidak ditemukan. Anda belum Check-In." });
    if (activeLog.actualOut) return res.status(400).json({ message: "Anda sudah Check-Out hari ini." });

    // Evaluasi Pulang Cepat / Lembur
    let statusOut = "Pas/Sesuai";
    if (serverTime < activeLog.scheduleOut) statusOut = "Pulang Cepat";
    else if (serverTime > activeLog.scheduleOut) statusOut = "Lembur";

    activeLog.actualOut = serverTime;
    activeLog.statusOut = statusOut;

    res.json({ status: "success", message: `Check-Out berhasil jam ${serverTime}. Status: ${statusOut}`, data: activeLog });
});

app.listen(3000, () => console.log('✅ Server berjalan di http://localhost:3000'));
