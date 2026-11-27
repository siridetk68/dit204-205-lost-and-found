-- ========================================================
-- TiDB Schema for University Lost & Found System
-- Project: DIT204 Information System Project Management
-- Author: 6804130 นายสิริเดช เกตานนท์
-- Target Database: TiDB Cloud (MySQL 8.0 Compatible)
-- ========================================================

CREATE DATABASE IF NOT EXISTS lost_and_found;
USE lost_and_found;

-- 1. Table: users (ตารางข้อมูลผู้ใช้งานและสิทธิ์ในระบบ)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'staff', 'admin') NOT NULL DEFAULT 'student',
  faculty VARCHAR(100) DEFAULT 'วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี',
  major VARCHAR(100) DEFAULT 'นวัตกรรมดิจิทัลและปัญญาประดิษฐ์',
  phone VARCHAR(20) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: categories (ตารางหมวดหมู่สิ่งของ)
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  name_th VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  icon VARCHAR(50) DEFAULT 'grid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: locations (ตารางสถานที่ภายในมหาวิทยาลัย)
CREATE TABLE IF NOT EXISTS locations (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  building VARCHAR(100) NOT NULL,
  floor VARCHAR(20) DEFAULT NULL,
  room VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: items (ตารางรายการสิ่งของสูญหายและของที่เก็บได้)
CREATE TABLE IF NOT EXISTS items (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  english_title VARCHAR(200) DEFAULT NULL,
  type ENUM('LOST', 'FOUND') NOT NULL,
  status ENUM('LOOKING_FOR_OWNER', 'FOUND_ITEM', 'RETURNED') NOT NULL DEFAULT 'LOOKING_FOR_OWNER',
  category_id VARCHAR(50) NOT NULL,
  location VARCHAR(200) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(20) DEFAULT NULL,
  description TEXT NOT NULL,
  image MEDIUMTEXT DEFAULT NULL,
  secret_question VARCHAR(255) DEFAULT NULL,
  secret_clue VARCHAR(255) DEFAULT NULL,
  contact_name VARCHAR(100) NOT NULL,
  contact_tel VARCHAR(50) NOT NULL,
  reporter_id VARCHAR(50) DEFAULT NULL,
  claimed_by VARCHAR(100) DEFAULT NULL,
  claimant_contact VARCHAR(50) DEFAULT NULL,
  claim_proof TEXT DEFAULT NULL,
  returned_date DATE DEFAULT NULL,
  claim_status VARCHAR(50) NOT NULL DEFAULT 'none',
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  is_under_custody BOOLEAN NOT NULL DEFAULT FALSE,
  custody_location VARCHAR(200) DEFAULT NULL,
  verified_by VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table: claims (ตารางบันทึกการขอรับคืนและยืนยันความเป็นเจ้าของ - REQ 03)
CREATE TABLE IF NOT EXISTS claims (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_id VARCHAR(50) NOT NULL,
  claimant_id VARCHAR(50) NOT NULL,
  claimant_name VARCHAR(100) NOT NULL,
  claimant_contact VARCHAR(50) NOT NULL,
  proof_answer TEXT NOT NULL,
  status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  verified_by VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- Initial Data Seeding for Demo & Final Presentation
-- ========================================================

-- Seed Categories
INSERT IGNORE INTO categories (id, name_th, name_en, icon) VALUES
('Electronics', 'อุปกรณ์ไอที / อิเล็กทรอนิกส์', 'Electronics', 'laptop'),
('Student IDs', 'บัตรนักศึกษา / เอกสาร', 'Student IDs & Cards', 'credit-card'),
('Books', 'หนังสือ / อุปกรณ์การเรียน', 'Books & Study', 'book-open'),
('Personal Items', 'ของใช้ส่วนตัว / อื่นๆ', 'Personal Items', 'briefcase');

-- Seed Locations
INSERT IGNORE INTO locations (id, name, building, floor, room) VALUES
('loc-001', 'อาคาร 1 คณะ IT (ตึก IT)', 'อาคาร 1 IT', 'ชั้น 1', 'โถงกลาง'),
('loc-002', 'ห้องปฏิบัติการคอมพิวเตอร์ (Lab 1-302)', 'อาคาร 1 IT', 'ชั้น 3', 'Lab 1-302'),
('loc-003', 'โรงอาหารกลาง (Cafeteria อาคาร 1)', 'อาคาร 1 IT', 'ชั้น 1', 'โรงอาหาร'),
('loc-004', 'หอสมุดกลาง (Central Library)', 'อาคารหอสมุด', 'ชั้น 2', 'Co-Working'),
('loc-005', 'อาคารคุณหญิงพัฒนา (Classrooms)', 'อาคารคุณหญิงพัฒนา', 'ชั้น 4', 'ห้อง 4-401'),
('loc-006', 'ลานจอดรถอาคาร IT (Parking Area)', 'ลานจอดรถตึก 1', 'ชั้น G', 'ลานจอด');

-- Seed Users (ครบ 3 บทบาท)
INSERT IGNORE INTO users (student_id, name, email, password_hash, role, major, phone) VALUES
('6804130', 'นายสิริเดช เกตานนท์', 's6804130@rsu.ac.th', 'student2026', 'student', 'นวัตกรรมดิจิทัลและปัญญาประดิษฐ์', '089-xxx-4130'),
('ajarn.nittanate', 'อาจารย์นิษฐเนตร์ ณัฏฐกุลนันท์', 'nittanate.n@rsu.ac.th', 'staffPass2026', 'staff', 'อาจารย์ประจำสาขาวิชา DIT', '02-997-2200'),
('admin.dit', 'ผู้ดูแลระบบ DIT Lost & Found', 'admin.dit@rsu.ac.th', 'adminSecurePass', 'admin', 'สำนักงานเทคโนโลยีและสารสนเทศ', '02-997-2200');

-- Seed Items
INSERT IGNORE INTO items (id, title, english_title, type, status, category_id, location, date, time, description, image, secret_question, secret_clue, contact_name, contact_tel, reporter_id, claim_status, is_pinned, is_under_custody, custody_location, verified_by) VALUES
('item-001', 'หูฟังไร้สาย Apple AirPods Pro 2', 'Wireless Bluetooth Headphones (AirPods Pro 2)', 'LOST', 'LOOKING_FOR_OWNER', 'Electronics', 'อาคาร 1 (IT Building) ห้อง Lab 1-302', '2026-11-05', '14:30 น.', 'ลืมไว้ที่โต๊ะคอมพิวเตอร์แถวหลังสุด ห้องแล็บปฏิบัติการคอมพิวเตอร์ 1-302 หลังคาบเรียน DIT204 เคสสีขาวมีเคสกันกระแทกสีน้ำเงินใส', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80', 'สติกเกอร์ที่ติดอยู่มุมล่างขวาของเคสหูฟังคือรูปอะไร?', 'รูปการ์ตูนแมวสีส้ม', 'นายสิริเดช เกตานนท์', '089-xxx-4130', '6804130', 'none', FALSE, FALSE, NULL, NULL),
('item-002', 'บัตรประจำตัวนักศึกษา มหาวิทยาลัยรังสิต', 'Student ID Card (RSU)', 'FOUND', 'FOUND_ITEM', 'Student IDs', 'โรงอาหารกลาง (Cafeteria อาคาร 1)', '2026-11-06', '11:45 น.', 'เก็บได้ที่โต๊ะทานข้าวฝั่งร้านข้าวมันไก่ ในซองใส่บัตรสีน้ำเงินพร้อมสายคล้องคอสีส้มของมหาวิทยาลัยรังสิต', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80', 'ระบุรหัสนักศึกษา 3 ตัวท้าย และชื่อบนบัตรเพื่อยืนยันตัวตน', 'รหัสลงท้าย 204', 'เจ้าหน้าที่ธุรการคณะ DIT', '02-997-2200 ต่อ 3100', 'ajarn.nittanate', 'pending', TRUE, TRUE, 'ห้องธุรการสาขาวิชา DIT (อาคาร 1 ชั้น 1)', 'อาจารย์นิษฐเนตร์ ณัฏฐกุลนันท์ (Staff)'),
('item-003', 'Apple iPad Gen 9 (Space Gray) พร้อมปากกา', 'iPad Gen 9 (Space Gray) with Stylus', 'LOST', 'LOOKING_FOR_OWNER', 'Electronics', 'หอสมุดกลาง ชั้น 2 (Library)', '2026-11-04', '17:15 น.', 'วางลืมไว้ที่โซน Co-Working Space โต๊ะกลมสีขาวใกล้ชั้นหนังสือหมวดคอมพิวเตอร์ เคสแม่เหล็กสีน้ำเงินเข้ม', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80', 'วอลเปเปอร์หน้าจอล็อก (Lock Screen) ของ iPad คือภาพอะไร?', 'รูปสุนัขพันธุ์โกลเด้นรีทรีฟเวอร์', 'กุลธิดา (นักศึกษา DIT)', '081-xxx-8899', 'student-02', 'none', TRUE, FALSE, NULL, NULL),
('item-004', 'กระเป๋าสตางค์หนังแท้สีดำ (Leather Wallet)', 'Black Leather Bi-Fold Wallet', 'FOUND', 'FOUND_ITEM', 'Personal Items', 'ตึกเรียนรวม อาคารคุณหญิงพัฒนา ชั้น 4', '2026-11-05', '16:00 น.', 'พบตกอยู่ใต้เก้าอี้แถวกลางในห้องบรรยาย 4-401 หลังเลิกคลาส มีบัตรประชาชนและธนบัตรบางส่วน', 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80', 'ระบุชื่อยี่ห้อกระเป๋าหรือจำนวนบัตรที่มีอยู่ด้านในอย่างถูกต้อง', 'แบรนด์ Guy Laroche มีบัตรสะสมแต้ม 2 ใบ', 'อาจารย์ผู้ช่วยสอน (TA DIT204)', '086-xxx-1234', 'ajarn.nittanate', 'pending', FALSE, TRUE, 'ห้องธุรการสาขาวิชา DIT (อาคาร 1 ชั้น 1)', 'อาจารย์นิษฐเนตร์ ณัฏฐกุลนันท์ (Staff)'),
('item-005', 'สมุดสรุปเลกเชอร์ DIT204 Project Management', 'Lecture Notebook - DIT204', 'FOUND', 'RETURNED', 'Books', 'อาคาร 1 (IT Building) โถงบันไดชั้น 2', '2026-11-03', '10:00 น.', 'สมุดปกสีน้ำตาล Muji สรุปเนื้อหา WBS, Gantt Chart เตรียมส่งอาจารย์ ผศ.ดร.กานต์ มีการส่งมอบคืนเรียบร้อยแล้ว', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80', 'ลายมือชื่อหรือสัญลักษณ์ที่เขียนไว้หน้าปกในคืออะไร?', 'รหัสนักศึกษา 6804130', 'นายสิริเดช เกตานนท์', '089-xxx-4130', '6804130', 'approved', FALSE, TRUE, 'ห้องธุรการสาขาวิชา DIT (อาคาร 1 ชั้น 1)', 'อาจารย์นิษฐเนตร์ ณัฏฐกุลนันท์ (Staff)'),
('item-006', 'พวงกุญแจรถยนต์ Honda พร้อมสายคล้อง DIT ม.รังสิต', 'Car Smart Key with RSU Lanyard', 'LOST', 'LOOKING_FOR_OWNER', 'Personal Items', 'ลานจอดรถหน้าตึก IT (IT Parking Area)', '2026-11-06', '09:15 น.', 'กุญแจรีโมตสมาร์ตคีย์รถยนต์ Honda City พร้อมสายคล้องคอสีฟ้าสกรีนข้อความ Digital Innovation DIT RSU และพวงกุญแจน้องเป็ดสีเหลือง', 'https://images.unsplash.com/photo-1590483256037-7ef3f5e921d7?auto=format&fit=crop&w=800&q=80', 'ตุ๊กตาที่ห้อยคู่กับกุญแจมีลักษณะพิเศษอย่างไร?', 'เป็ดสีเหลืองสวมหมวกกันน็อกสีดำ', 'ศุภกิตติ์ (นักศึกษาปี 2)', '092-xxx-7766', 'student-03', 'none', FALSE, FALSE, NULL, NULL);

-- Seed Claims
INSERT IGNORE INTO claims (id, item_id, claimant_id, claimant_name, claimant_contact, proof_answer, status, verified_by, created_at) VALUES
(1, 'item-005', '6804130', 'นายสิริเดช เกตานนท์', '089-xxx-4130', 'ลายเซ็นสิริเดช และรหัส 6804130 หน้าปกใน', 'APPROVED', 'อาจารย์นิษฐเนตร์ ณัฏฐกุลนันท์', '2026-11-03 14:20:00'),
(2, 'item-002', '6804130', 'นายสิริเดช เกตานนท์', '089-xxx-4130', 'รหัสท้าย 204 ชื่อนายสิริเดช เกตานนท์ สาขาวิชา DIT', 'PENDING', NULL, '2026-11-06 14:20:00'),
(3, 'item-004', '6804999', 'นายนภัทร วงศ์สวัสดิ์', '085-xxx-9911', 'กระเป๋า Guy Laroche ด้านในมีบัตรสะสมแต้ม Cafe Amazon 2 ใบ', 'PENDING', NULL, '2026-11-06 16:30:00');
