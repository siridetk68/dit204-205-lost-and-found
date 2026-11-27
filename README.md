# University Lost & Found Web Application
**ระบบบอร์ดแจ้งของหายและตามหาเจ้าของสำหรับนักศึกษา วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี (DIT) มหาวิทยาลัยรังสิต**

โครงการสำหรับรายวิชา **DIT204 Information System Project Management**  
**จัดทำโดย:** 6804130 นายสิริเดช เกตานนท์  
**เสนอ:** อาจารย์นิษฐเนตร์ ณัฏฐกุลนันท์ และ ผศ.ดร.กานต์ ยงศิริวิทย์  

---

## 📌 คุณสมบัติของระบบ (Key Features according to Project Charter & Requirements)

### 1. Navigation Bar (REQ 01 & UI Guideline)
- **Logo ด้านซ้าย:** "Lost & Found" พร้อม Minimalist Search Icon และป้ายระบุภาควิชา `IT Dept`
- **เมนูกลาง (Navigation Menu):** Home (หน้าแรก), Browse Items (ค้นหารายการ), Report Found Item (แจ้งของหาย/พบของ), โครงงาน DIT204
- **Student Profile Badge ด้านขวา:** แสดงข้อมูลนักศึกษา `นายสิริเดช เกตานนท์` (รหัสนักศึกษา 6804130) พร้อมสถานะ Verified Student และเมนูข้อมูลวิชา

### 2. Hero & Advanced Search Section (REQ 02)
- **แถบค้นหาหลัก (Prominent Search Bar):** Placeholder `Search for items, electronics, student cards...` สามารถค้นหาแบบ Real-time ตามชื่อสิ่งของ, รายละเอียด, ยี่ห้อ หรือสถานที่
- **ตัวกรองหมวดหมู่ (Category Filter Dropdown):**
  - อุปกรณ์ไอที / อิเล็กทรอนิกส์ (Electronics)
  - บัตรนักศึกษา / เอกสาร (Student IDs & Cards)
  - หนังสือ / อุปกรณ์การเรียน (Books & Study)
  - ของใช้ส่วนตัว / อื่นๆ (Personal Items)
- **ตัวกรองสถานที่ (Location Filter Dropdown):**
  - อาคาร 1 คณะ IT (ตึก IT)
  - ห้องปฏิบัติการคอมพิวเตอร์ (Lab 1-302)
  - โรงอาหารกลาง (Cafeteria)
  - หอสมุดกลาง (Central Library)
  - อาคารคุณหญิงพัฒนา (Classrooms)
  - ลานจอดรถอาคาร IT (Parking Area)
- **Quick Status Filter Tabs:**
  - ทั้งหมด (All)
  - 🔴 ของหาย (Looking for owner)
  - 🟢 พบของแล้ว (Found items)
- **Counter Summary:** แสดงสถิติภาพรวมจำนวนประกาศทั้งหมด, กำลังตามหา, พบของแล้ว และส่งคืนสำเร็จ

### 3. Main Content Grid & Interactive Cards (REQ 01 & REQ 02)
- แสดงการ์ดรายการแบบ Responsive Grid (รองรับสมาร์ตโฟน แท็บเล็ต และเดสก์ท็อป)
- **รายการตัวอย่างตามบริบทของเอกสาร:**
  1. หูฟังไร้สาย Apple AirPods Pro 2 (Electronics, อาคาร 1 IT Lab 1-302, Looking for owner)
  2. บัตรประจำตัวนักศึกษา ม.รังสิต (Student IDs, โรงอาหารกลาง อาคาร 1, Found item)
  3. Apple iPad Gen 9 Space Gray พร้อมปากกา (Electronics, หอสมุดกลาง ชั้น 2, Looking for owner)
  4. กระเป๋าสตางค์หนังแท้สีดำ (Personal Items, อาคารคุณหญิงพัฒนา ชั้น 4, Found item)
  5. สมุดสรุปเลกเชอร์ DIT204 Project Management (Books, อาคาร 1 IT, Returned)
  6. พวงกุญแจรถยนต์ Honda พร้อมสายคล้อง DIT RSU (Personal Items, ลานจอดรถตึก IT, Looking for owner)
- **แต่ละการ์ดประกอบด้วย:**
  - รูปภาพจำลองขนาดชัดเจนพร้อมเอฟเฟกต์ Hover Zoom
  - ป้ายระบุประเภท (ของหาย / เก็บได้) และป้ายสถานะ (Looking for owner, Found item, Returned)
  - ป้ายหมวดหมู่และสถานที่พร้อมไอคอน Pin (`MapPin`)
  - วันที่และเวลาที่บันทึก
  - ปุ่ม CTA: **View Details** (เปิดดูข้อมูลเชิงลึก) และ **Claim Item** (ยืนยันความเป็นเจ้าของ)

### 4. ระบบยืนยันความเป็นเจ้าของ (Ownership Verification - REQ 03 / T03)
- แก้ปัญหาการสวมรอยหรือแอบอ้างสิทธิ์ตามที่ระบุไว้ในบทที่ 1 และ 4 ของรายงาน
- ผู้ขอรับคืนต้องตอบคำถามเฉพาะหรือระบุจุดสังเกตลับ (Secret Verification Question) เช่น สติกเกอร์หลังเคส, วอลเปเปอร์หน้าจอล็อก, ตัวเลข 3 ตัวท้าย
- เมื่อยืนยันสำเร็จ ระบบจะปรับสถานะเป็น `ส่งคืนแล้ว (Returned)` ทันที

### 5. แผนบริหารโครงการ DIT204 Showcase
- แสดงข้อมูล Work Breakdown Structure (WBS 1.1, 1.2, 1.3)
- แสดง Requirements Traceability Matrix (REQ 01, REQ 02, REQ 03 กับ Test Cases T01, T02, T03)
- แสดงเป้าหมายความสำเร็จ (KPIs): อัตราความสำเร็จฟังก์ชัน ≥85%, ความแม่นยำค้นหา ≥80%, ความพึงพอใจ ≥70%

---

## 🛠 เทคโนโลยีที่ใช้ในการพัฒนา (Technology Stack)

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router Architecture)
- **UI & Components:** React 18, [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **API Endpoints:**
  - `GET /api/items` - ดึงรายการสิ่งของ พร้อมรองรับ Search & Filter Query
  - `POST /api/items` - บันทึกประกาศแจ้งของหายหรือพบของใหม่
  - `GET /api/items/[id]` - ดึงข้อมูลสิ่งของรายชิ้น
  - `PATCH /api/items/[id]` - อัปเดตสถานะและบันทึกการส่งคืน (Claim)
  - `DELETE /api/items/[id]` - ลบรายการประกาศ
  - `GET /api/stats` - คำนวณสรุปสถิติจำนวนและอัตราการส่งคืนสำเร็จ
- **Alternative Standalone Version:** ไฟล์ `public/index.html` (Tailwind CDN + Pure JS) สามารถเปิดใช้งานผ่านเบราว์เซอร์ได้ทันทีโดยไม่ต้องรันเซิร์ฟเวอร์

---

## 🚀 วิธีการทดสอบและเปิดใช้งาน (How to Run)

### วิธีที่ 1: รันด้วย Next.js Development Server (แนะนำ)
เปิด Terminal ในโฟลเดอร์นี้ แล้วพิมพ์คำสั่ง:
```bash
npm run dev
```
จากนั้นเปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

### วิธีที่ 2: รัน Production Build
```bash
npm run build
npm start
```

### วิธีที่ 3: เปิดไฟล์ Static HTML โดยตรง (กรณีเปิดสาธิตโดยไม่ต้องใช้ Node.js)
สามารถดับเบิลคลิกเปิดไฟล์ `public/index.html` บนเว็บเบราว์เซอร์ใดก็ได้ เช่น Google Chrome หรือ Microsoft Edge เพื่อแสดงผล Mockup ได้ทันที

