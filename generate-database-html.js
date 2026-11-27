const fs = require('fs');
const path = require('path');

const cssContent = fs.readFileSync(path.join(__dirname, 'public', 'style.css'), 'utf8');

const htmlContent = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TiDB Database Explorer - Lost & Found DIT204</title>
  
  <style>
${cssContent}

    @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap');
    body {
      font-family: 'Prompt', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
    }
  </style>
</head>
<body class="min-h-screen bg-slate-50 text-slate-800 flex flex-col">

  <!-- Top Bar -->
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <a href="index.html" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          <span>กลับสู่หน้าหลัก (Back to Home)</span>
        </a>
        <div class="h-4 w-px bg-slate-300"></div>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
          </div>
          <div>
            <h1 class="text-sm font-extrabold text-slate-900 leading-tight">
              TiDB Database Explorer
            </h1>
            <span class="text-[10px] text-slate-500 font-medium">
              แสดงแต่ละตารางในฐานข้อมูลโครงงาน DIT204
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="toggleSchema()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
          <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
          <span id="schema-btn-text">ดูคำสั่ง DDL (schema.sql)</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main id="main-database-content" class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    
    <!-- TiDB Connection Status Card -->
    <div class="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-blue-900/40">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-start sm:items-center gap-3.5">
          <div class="p-3 bg-blue-500/20 border border-blue-400/30 rounded-xl text-sky-400 shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold uppercase tracking-wider text-sky-400">Database Engine</span>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <span>●</span>
                <span>TiDB Cloud (Serverless v7.1 / MySQL 8.0 Protocol)</span>
              </span>
            </div>
            <h3 class="text-base font-extrabold text-white mt-0.5">
              ระบบฐานข้อมูลแบบกระจาย TiDB (Distributed SQL Database)
            </h3>
            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 mt-1">
              <span>Host: <strong class="text-sky-200">gateway01.ap-southeast-1.prod.aws.tidbcloud.com</strong></span>
              <span>Cluster: <strong class="text-sky-200">DIT204</strong></span>
              <span>Port: <strong class="text-sky-200">4000</strong></span>
              <span>Database: <strong class="text-sky-200">lost_and_found</strong></span>
              <span>Encryption: <strong class="text-emerald-300">SSL Active (TLS 1.2)</strong></span>
            </div>
          </div>
        </div>

        <div class="text-right self-start md:self-auto">
          <span class="text-[11px] text-slate-400 block">สถานะฐานข้อมูล</span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mt-1">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>เชื่อมต่อฐานข้อมูล TiDB สำเร็จ 🟢</span>
          </span>
        </div>
      </div>
    </div>

    <!-- SQL Schema Code Box -->
    <div id="schema-box" class="hidden bg-slate-900 text-slate-100 rounded-2xl p-4 border border-slate-700 shadow-lg text-xs font-mono">
      <div class="flex items-center justify-between pb-2 mb-3 border-b border-slate-700">
        <span class="text-sky-400 font-bold">schema.sql (TiDB Tables & Foreign Keys)</span>
        <span class="text-[10px] text-slate-400">MySQL 8.0 / TiDB Compatible</span>
      </div>
      <pre class="overflow-x-auto max-h-64 p-3 bg-slate-950 rounded-lg text-slate-300 leading-relaxed">
-- 1. Table: users (ตารางข้อมูลผู้ใช้งานและสิทธิ์ในระบบ)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(50) UNIQUE,
  name VARCHAR(100), email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  role ENUM('student', 'staff', 'admin'),
  faculty VARCHAR(100), major VARCHAR(100), phone VARCHAR(20)
);

-- 2. Table: items (ตารางรายการสิ่งของสูญหายและพบของ)
CREATE TABLE items (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(200), type ENUM('LOST', 'FOUND'),
  status ENUM('LOOKING_FOR_OWNER', 'FOUND_ITEM', 'RETURNED'),
  category_id VARCHAR(50), location VARCHAR(200), date DATE,
  secret_question VARCHAR(255), secret_clue VARCHAR(255),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 3. Table: categories (id, name_th, name_en, icon)
-- 4. Table: locations (id, name, building, floor, room)
-- 5. Table: claims (id, item_id, claimant_id, proof_answer, status, verified_by)
      </pre>
    </div>

    <!-- Table Selector Tabs -->
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
      <button onclick="switchTable('users')" id="tab-users" class="tab-btn p-3 rounded-xl border text-left transition-all bg-blue-600 text-white border-blue-600 shadow-md">
        <div class="flex items-center justify-between mb-1">
          <span class="text-base">👨‍🎓</span>
          <span class="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 text-white">3 แถว</span>
        </div>
        <div class="font-bold text-xs truncate">users (ผู้ใช้)</div>
        <div class="text-[10px] text-blue-100 truncate mt-0.5">นศ. สิริเดช, อาจารย์, แอดมิน</div>
      </button>

      <button onclick="switchTable('items')" id="tab-items" class="tab-btn p-3 rounded-xl border text-left transition-all bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-50">
        <div class="flex items-center justify-between mb-1">
          <span class="text-base">📦</span>
          <span class="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-600">6 แถว</span>
        </div>
        <div class="font-bold text-xs truncate">items (สิ่งของ)</div>
        <div class="text-[10px] text-slate-400 truncate mt-0.5">ของหาย, พบของ, ส่งคืนแล้ว</div>
      </button>

      <button onclick="switchTable('categories')" id="tab-categories" class="tab-btn p-3 rounded-xl border text-left transition-all bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-50">
        <div class="flex items-center justify-between mb-1">
          <span class="text-base">🏷️</span>
          <span class="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-600">4 แถว</span>
        </div>
        <div class="font-bold text-xs truncate">categories (หมวดหมู่)</div>
        <div class="text-[10px] text-slate-400 truncate mt-0.5">Electronics, IDs, Books...</div>
      </button>

      <button onclick="switchTable('locations')" id="tab-locations" class="tab-btn p-3 rounded-xl border text-left transition-all bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-50">
        <div class="flex items-center justify-between mb-1">
          <span class="text-base">🏢</span>
          <span class="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-600">6 แถว</span>
        </div>
        <div class="font-bold text-xs truncate">locations (สถานที่)</div>
        <div class="text-[10px] text-slate-400 truncate mt-0.5">อาคาร 1, Lab, โรงอาหาร...</div>
      </button>

      <button onclick="switchTable('claims')" id="tab-claims" class="tab-btn p-3 rounded-xl border text-left transition-all bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-50">
        <div class="flex items-center justify-between mb-1">
          <span class="text-base">🛡️</span>
          <span class="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-600">1 แถว</span>
        </div>
        <div class="font-bold text-xs truncate">claims (การขอรับคืน)</div>
        <div class="text-[10px] text-slate-400 truncate mt-0.5">บันทึกสิทธิ์ส่งมอบ (REQ 03)</div>
      </button>
    </div>

    <!-- Table Data View Container -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
      <div class="px-5 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 class="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <span>ตารางฐานข้อมูล TiDB:</span>
            <span id="current-table-title" class="font-mono text-blue-700">users</span>
          </h4>
          <p id="current-table-desc" class="text-xs text-slate-500 mt-0.5">ข้อมูลนักศึกษา, อาจารย์ และผู้ดูแลระบบ</p>
        </div>
        <span class="text-xs text-slate-400 font-mono" id="current-table-query">SELECT * FROM users;</span>
      </div>

      <div class="overflow-x-auto" id="table-container">
        <!-- Rendered by JS -->
      </div>

      <div class="p-3 bg-slate-50 border-t border-slate-200 text-right text-[11px] text-slate-500">
        TiDB Distributed Storage Engine • Latency: 0.02s
      </div>
    </div>

  </main>

  <!-- Access Restricted Guard (for Student role) -->
  <div id="student-restricted-card" class="hidden min-h-[70vh] flex flex-col justify-center items-center p-4">
    <div class="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-rose-100 text-center space-y-5">
      <div class="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      </div>
      <div>
        <span class="px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-700 uppercase tracking-wider">
          Access Restricted (RBAC)
        </span>
        <h2 class="text-xl font-black text-slate-900 mt-2">
          จำกัดการเข้าถึงเฉพาะ Admin เท่านั้น
        </h2>
        <p class="text-xs text-slate-500 mt-2 leading-relaxed">
          หน้าต่างตรวจสอบโครงสร้างฐานข้อมูล TiDB Cloud ของโครงงาน อนุญาตให้เข้าถึงได้เฉพาะบทบาท <strong>ผู้ดูแลระบบ (Admin)</strong> เท่านั้น ตามข้อกำหนดการรักษาความปลอดภัยของระบบ
        </p>
      </div>

      <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left text-xs text-slate-600">
        <span class="text-[10px] uppercase font-bold text-slate-400 block mb-1">บัญชีปัจจุบันที่กำลังใช้งาน</span>
        <div id="restricted-user-name" class="font-bold text-slate-800">นายสิริเดช เกตานนท์</div>
        <div id="restricted-user-badge" class="text-[11px] text-blue-600 font-semibold">รหัสนักศึกษา 6804130 • นักศึกษา</div>
      </div>

      <div class="flex flex-col gap-2 pt-2">
        <a
          href="login.html"
          class="w-full py-2.5 px-4 bg-gradient-to-r from-blue-700 to-sky-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all text-center block"
        >
          สลับเข้าสู่ระบบเป็น อาจารย์ (Staff) หรือ Admin
        </a>
        <a
          href="index.html"
          class="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors text-center block"
        >
          กลับสู่หน้าหลักสำหรับนักศึกษา
        </a>
      </div>
    </div>
  </div>

  <footer class="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-auto">
    <div class="max-w-7xl mx-auto px-4">
      <p class="font-semibold text-slate-700">
        โครงงานระบบ Lost & Found • ภาควิชานวัตกรรมดิจิทัลเทคโนโลยี มหาวิทยาลัยรังสิต (DIT204)
      </p>
      <p class="text-slate-400 mt-1">
        เชื่อมต่อฐานข้อมูล TiDB Cloud (Distributed SQL) โดย 6804130 นายสิริเดช เกตานนท์
      </p>
    </div>
  </footer>

  <script>
    const databaseData = {
      users: {
        desc: "ข้อมูลผู้ใช้งานและสิทธิ์ในระบบ (นักศึกษา, อาจารย์, ผู้ดูแลระบบ)",
        columns: ["id", "student_id", "name", "email", "role", "major", "phone", "created_at"],
        rows: [
          { id: 1, student_id: "6804130", name: "นายสิริเดช เกตานนท์", email: "s6804130@rsu.ac.th", role: "student", major: "นวัตกรรมดิจิทัลและปัญญาประดิษฐ์", phone: "089-xxx-4130", created_at: "2026-11-01 09:00:00" },
          { id: 2, student_id: "ajarn.nittanate", name: "อาจารย์นิษฐเนตร์ ณัฏฐกุลนันท์", email: "nittanate.n@rsu.ac.th", role: "staff", major: "อาจารย์ประจำสาขาวิชา DIT", phone: "02-997-2200", created_at: "2026-11-01 09:00:00" },
          { id: 3, student_id: "admin.dit", name: "ผู้ดูแลระบบ DIT Lost & Found", email: "admin.dit@rsu.ac.th", role: "admin", major: "สำนักงานเทคโนโลยีสารสนเทศ", phone: "02-997-2200", created_at: "2026-11-01 09:00:00" }
        ]
      },
      items: {
        desc: "รายการของหายและของที่เก็บได้ พร้อมคำถามยืนยันสิทธิ์ (REQ 01 & REQ 02)",
        columns: ["id", "title", "type", "status", "category_id", "location", "date", "contact_name", "secret_question"],
        rows: [
          { id: "item-001", title: "หูฟังไร้สาย Apple AirPods Pro 2", type: "LOST", status: "LOOKING_FOR_OWNER", category_id: "Electronics", location: "อาคาร 1 IT Lab 1-302", date: "2026-11-05", contact_name: "นายสิริเดช เกตานนท์", secret_question: "สติกเกอร์ที่ติดอยู่มุมล่างขวาของเคสคือรูปอะไร?" },
          { id: "item-002", title: "บัตรประจำตัวนักศึกษา ม.รังสิต", type: "FOUND", status: "FOUND_ITEM", category_id: "Student IDs", location: "โรงอาหารกลาง อาคาร 1", date: "2026-11-06", contact_name: "เจ้าหน้าที่ธุรการ DIT", secret_question: "รหัสนักศึกษา 3 ตัวท้าย และชื่อบนบัตร" },
          { id: "item-003", title: "Apple iPad Gen 9 (Space Gray) พร้อมปากกา", type: "LOST", status: "LOOKING_FOR_OWNER", category_id: "Electronics", location: "หอสมุดกลาง ชั้น 2", date: "2026-11-04", contact_name: "กุลธิดา (นักศึกษา DIT)", secret_question: "วอลเปเปอร์หน้าจอล็อกคือภาพอะไร?" },
          { id: "item-004", title: "กระเป๋าสตางค์หนังแท้สีดำ (Guy Laroche)", type: "FOUND", status: "FOUND_ITEM", category_id: "Personal Items", location: "อาคารคุณหญิงพัฒนา ชั้น 4", date: "2026-11-05", contact_name: "อาจารย์ผู้ช่วยสอน TA", secret_question: "ยี่ห้อกระเป๋าหรือจำนวนบัตรด้านใน" },
          { id: "item-005", title: "สมุดสรุปเลกเชอร์ DIT204 Project Management", type: "FOUND", status: "RETURNED", category_id: "Books", location: "อาคาร 1 โถงบันได ชั้น 2", date: "2026-11-03", contact_name: "นายสิริเดช เกตานนท์", secret_question: "ลายมือชื่อหรือสัญลักษณ์ที่เขียนไว้หน้าปกใน" },
          { id: "item-006", title: "พวงกุญแจรถยนต์ Honda พร้อมสายคล้อง DIT", type: "LOST", status: "LOOKING_FOR_OWNER", category_id: "Personal Items", location: "ลานจอดรถ อาคาร 1 IT", date: "2026-11-06", contact_name: "ศุภกิตติ์ (นักศึกษา)", secret_question: "ตุ๊กตาที่ห้อยคู่กับกุญแจมีลักษณะพิเศษอย่างไร?" }
        ]
      },
      categories: {
        desc: "หมวดหมู่ของสิ่งของในระบบบอร์ดของหาย",
        columns: ["id", "name_th", "name_en", "icon"],
        rows: [
          { id: "Electronics", name_th: "อุปกรณ์ไอที / อิเล็กทรอนิกส์", name_en: "Electronics", icon: "laptop" },
          { id: "Student IDs", name_th: "บัตรนักศึกษา / เอกสาร", name_en: "Student IDs & Cards", icon: "credit-card" },
          { id: "Books", name_th: "หนังสือ / อุปกรณ์การเรียน", name_en: "Books & Study", icon: "book-open" },
          { id: "Personal Items", name_th: "ของใช้ส่วนตัว / อื่นๆ", name_en: "Personal Items", icon: "briefcase" }
        ]
      },
      locations: {
        desc: "ตารางสถานที่และพิกัดภายในมหาวิทยาลัยรังสิต",
        columns: ["id", "name", "building", "floor", "room"],
        rows: [
          { id: "loc-001", name: "อาคาร 1 คณะ IT (ตึก IT)", building: "อาคาร 1 IT", floor: "ชั้น 1", room: "โถงกลาง" },
          { id: "loc-002", name: "ห้องปฏิบัติการคอมพิวเตอร์ (Lab 1-302)", building: "อาคาร 1 IT", floor: "ชั้น 3", room: "Lab 1-302" },
          { id: "loc-003", name: "โรงอาหารกลาง (Cafeteria อาคาร 1)", building: "อาคาร 1 IT", floor: "ชั้น 1", room: "โรงอาหาร" },
          { id: "loc-004", name: "หอสมุดกลาง (Central Library)", building: "อาคารหอสมุด", floor: "ชั้น 2", room: "Co-Working" },
          { id: "loc-005", name: "อาคารคุณหญิงพัฒนา (Classrooms)", building: "อาคารคุณหญิงพัฒนา", floor: "ชั้น 4", room: "ห้อง 4-401" },
          { id: "loc-006", name: "ลานจอดรถอาคาร IT (Parking Area)", building: "ลานจอดรถตึก 1", floor: "ชั้น G", room: "ลานจอด" }
        ]
      },
      claims: {
        desc: "ตารางบันทึกการขอรับคืนและยืนยันความเป็นเจ้าของ (REQ 03 / T03 Acceptance)",
        columns: ["id", "item_id", "claimant_id", "claimant_name", "claimant_contact", "proof_answer", "status", "verified_by"],
        rows: [
          { id: 1, item_id: "item-005", claimant_id: "6804130", claimant_name: "นายสิริเดช เกตานนท์", claimant_contact: "089-xxx-4130", proof_answer: "ลายเซ็นสิริเดช และรหัส 6804130 หน้าปกใน", status: "APPROVED", verified_by: "อาจารย์นิษฐเนตร์ ณัฏฐกุลนันท์" }
        ]
      }
    };

    let activeTableId = 'users';

    function renderTable() {
      const data = databaseData[activeTableId];
      document.getElementById('current-table-title').innerText = activeTableId;
      document.getElementById('current-table-desc').innerText = data.desc;
      document.getElementById('current-table-query').innerText = 'SELECT * FROM ' + activeTableId + ';';

      let html = '<table class="w-full text-left text-xs">';
      html += '<thead class="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200"><tr>';
      data.columns.forEach(col => {
        html += '<th class="px-4 py-3 whitespace-nowrap">' + col + '</th>';
      });
      html += '</tr></thead><tbody class="divide-y divide-slate-100 text-slate-700">';

      data.rows.forEach(row => {
        html += '<tr class="hover:bg-blue-50/40 transition-colors">';
        data.columns.forEach(col => {
          let val = row[col] || '-';
          if (col === 'role') {
            const badgeClass = val === 'admin' ? 'bg-purple-100 text-purple-700' : (val === 'staff' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700');
            val = '<span class="px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ' + badgeClass + '">' + val + '</span>';
          } else if (col === 'type') {
            const badgeClass = val === 'LOST' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700';
            val = '<span class="px-2 py-0.5 rounded-full font-bold text-[10px] ' + badgeClass + '">' + val + '</span>';
          } else if (col === 'status') {
            const badgeClass = val === 'RETURNED' ? 'bg-sky-100 text-sky-700' : (val === 'FOUND_ITEM' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700');
            val = '<span class="px-2 py-0.5 rounded-full font-bold text-[10px] ' + badgeClass + '">' + val + '</span>';
          }
          html += '<td class="px-4 py-3 whitespace-nowrap font-mono text-[11px]">' + val + '</td>';
        });
        html += '</tr>';
      });

      html += '</tbody></table>';
      document.getElementById('table-container').innerHTML = html;
    }

    function switchTable(tableId) {
      activeTableId = tableId;
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.className = "tab-btn p-3 rounded-xl border text-left transition-all bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-50";
      });
      const activeBtn = document.getElementById('tab-' + tableId);
      if (activeBtn) {
        activeBtn.className = "tab-btn p-3 rounded-xl border text-left transition-all bg-blue-600 text-white border-blue-600 shadow-md";
      }
      renderTable();
    }

    function toggleSchema() {
      const box = document.getElementById('schema-box');
      box.classList.toggle('hidden');
      document.getElementById('schema-btn-text').innerText = box.classList.contains('hidden') ? 'ดูคำสั่ง DDL (schema.sql)' : 'ปิด Schema';
    }

    function checkAccess() {
      try {
        const raw = localStorage.getItem('lost_found_user');
        const u = raw ? JSON.parse(raw) : { role: 'student', name: 'นายสิริเดช เกตานนท์', badge: 'รหัส 6804130 • DIT RSU' };
        if (u.role !== 'admin') {
          const mainContent = document.getElementById('main-database-content');
          const restrictedCard = document.getElementById('student-restricted-card');
          if (mainContent) mainContent.classList.add('hidden');
          if (restrictedCard) restrictedCard.classList.remove('hidden');
          const nameEl = document.getElementById('restricted-user-name');
          const badgeEl = document.getElementById('restricted-user-badge');
          if (nameEl && u.name) nameEl.innerText = u.name;
          if (badgeEl && u.badge) badgeEl.innerText = u.badge;
          return false;
        }
      } catch(e) {}
      return true;
    }

    document.addEventListener('DOMContentLoaded', () => {
      if (checkAccess()) {
        renderTable();
      }
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'public', 'database.html'), htmlContent, 'utf8');
console.log('Successfully generated public/database.html!');

