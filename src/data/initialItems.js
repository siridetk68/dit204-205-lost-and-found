export const INITIAL_ITEMS = [
  {
    id: "item-001",
    title: "หูฟังไร้สาย Apple AirPods Pro 2",
    englishTitle: "Wireless Bluetooth Headphones (AirPods Pro 2)",
    type: "LOST", // LOST (ของหาย) หรือ FOUND (พบของ)
    status: "LOOKING_FOR_OWNER", // LOOKING_FOR_OWNER, FOUND_ITEM, RETURNED
    category: "Electronics",
    location: "อาคาร 1 (IT Building) ห้อง Lab 1-302",
    date: "2026-11-05",
    time: "14:30 น.",
    description: "ลืมไว้ที่โต๊ะคอมพิวเตอร์แถวหลังสุด ห้องแล็บปฏิบัติการคอมพิวเตอร์ 1-302 หลังคาบเรียน DIT204 ตัวเคสสีขาวมีเคสกันกระแทกสีน้ำเงินใส",
    contactName: "นายสิริเดช เกตานนท์ (นักศึกษา DIT)",
    contactTel: "089-xxx-4130",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80",
    secretQuestion: "สติกเกอร์ที่ติดอยู่มุมล่างขวาของเคสหูฟังคือรูปอะไร?",
    secretClue: "รูปการ์ตูนแมวสีส้ม",
    claimStatus: "none",
    isPinned: false,
    isUnderCustody: false
  },
  {
    id: "item-002",
    title: "บัตรประจำตัวนักศึกษา มหาวิทยาลัยรังสิต",
    englishTitle: "Student ID Card (RSU)",
    type: "FOUND",
    status: "FOUND_ITEM",
    category: "Student IDs",
    location: "โรงอาหารกลาง (Cafeteria อาคาร 1)",
    date: "2026-11-06",
    time: "11:45 น.",
    description: "เก็บได้ที่โต๊ะทานข้าวฝั่งร้านข้าวมันไก่ ในซองใส่บัตรสีน้ำเงินพร้อมสายคล้องคอสีส้มของมหาวิทยาลัยรังสิต ส่งไว้ที่โต๊ะเจ้าหน้าที่ธุรการชั้น 1 อาคารเรียน",
    contactName: "เจ้าหน้าที่ธุรการคณะ DIT",
    contactTel: "02-997-2200 ต่อ 3100",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
    secretQuestion: "ระบุรหัสนักศึกษา 3 ตัวท้าย และชื่อบนบัตรเพื่อยืนยันตัวตน",
    secretClue: "รหัสลงท้าย 204",
    claimStatus: "pending",
    isPinned: true,
    isUnderCustody: true,
    custodyLocation: "ห้องธุรการสาขาวิชา DIT (อาคาร 1 ชั้น 1)",
    verifiedBy: "อาจารย์นิษฐเนตร์ ณัฏฐกุลนันท์ (Staff)"
  },
  {
    id: "item-003",
    title: "Apple iPad Gen 9 (Space Gray) พร้อม Apple Pencil",
    englishTitle: "iPad Gen 9 (Space Gray) with Stylus",
    type: "LOST",
    status: "LOOKING_FOR_OWNER",
    category: "Electronics",
    location: "หอสมุดกลาง ชั้น 2 (Library)",
    date: "2026-11-04",
    time: "17:15 น.",
    description: "วางลืมไว้ที่โซน Co-Working Space โต๊ะกลมสีขาวใกล้ชั้นหนังสือหมวดคอมพิวเตอร์ เคสแม่เหล็กพับได้สี Dark Blue ตัวเครื่องใส่รหัสผ่าน มีไฟล์สไลด์วิชาอาจารย์นิษฐเนตร์",
    contactName: "กุลธิดา (เพื่อนร่วมรุ่น DIT)",
    contactTel: "081-xxx-8899",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
    secretQuestion: "วอลเปเปอร์หน้าจอล็อก (Lock Screen) ของ iPad คือภาพอะไร?",
    secretClue: "รูปสุนัขพันธุ์โกลเด้นรีทรีฟเวอร์",
    claimStatus: "none",
    isPinned: true,
    isUnderCustody: false
  },
  {
    id: "item-004",
    title: "กระเป๋าสตางค์หนังแท้สีดำ (Leather Wallet)",
    englishTitle: "Black Leather Bi-Fold Wallet",
    type: "FOUND",
    status: "FOUND_ITEM",
    category: "Personal Items",
    location: "ตึกเรียนรวม อาคารคุณหญิงพัฒนา ชั้น 4",
    date: "2026-11-05",
    time: "16:00 น.",
    description: "พบตกอยู่ใต้เก้าอี้แถวกลางในห้องบรรยาย 4-401 หลังเลิกคลาส มีบัตรประชาชนและธนบัตรบางส่วน ติดต่อยืนยันรายละเอียดเพื่อรับคืนได้ที่ห้องพักอาจารย์",
    contactName: "อาจารย์ผู้ช่วยสอน (TA DIT204)",
    contactTel: "086-xxx-1234",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    secretQuestion: "ระบุชื่อยี่ห้อกระเป๋าหรือจำนวนบัตรที่มีอยู่ด้านในอย่างถูกต้อง",
    secretClue: "แบรนด์ Guy Laroche มีบัตรสะสมแต้ม 2 ใบ",
    claimStatus: "pending",
    isPinned: false,
    isUnderCustody: true,
    custodyLocation: "ห้องธุรการสาขาวิชา DIT (อาคาร 1 ชั้น 1)",
    verifiedBy: "อาจารย์นิษฐเนตร์ ณัฏฐกุลนันท์ (Staff)"
  },
  {
    id: "item-005",
    title: "สมุดสรุปเลกเชอร์ DIT204 Project Management",
    englishTitle: "Lecture Notebook - DIT204 Project Management",
    type: "FOUND",
    status: "RETURNED",
    category: "Books",
    location: "อาคาร 1 (IT Building) โถงบันไดชั้น 2",
    date: "2026-11-03",
    time: "10:00 น.",
    description: "สมุดปกสีน้ำตาล Muji จดสรุปเนื้อหา WBS, Gantt Chart, Project Charter สำหรับเตรียมส่งอาจารย์ ผศ.ดร.กานต์ มีการส่งมอบคืนเจ้าของเรียบร้อยแล้ว",
    contactName: "นายสิริเดช เกตานนท์",
    contactTel: "089-xxx-4130",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    secretQuestion: "ลายมือชื่อหรือสัญลักษณ์ที่เขียนไว้หน้าปกในคืออะไร?",
    secretClue: "รหัสนักศึกษา 6804xxx",
    claimStatus: "approved"
  },
  {
    id: "item-006",
    title: "พวงกุญแจรถยนต์ Honda พร้อมสายคล้อง DIT ม.รังสิต",
    englishTitle: "Car Smart Key with RSU Lanyard",
    type: "LOST",
    status: "LOOKING_FOR_OWNER",
    category: "Personal Items",
    location: "ลานจอดรถหน้าตึก IT (IT Parking Area)",
    date: "2026-11-06",
    time: "09:15 น.",
    description: "กุญแจรีโมตสมาร์ตคีย์รถยนต์ Honda City พร้อมสายคล้องคอสีฟ้าสกรีนข้อความ Digital Innovation DIT RSU และพวงกุญแจน้องเป็ดสีเหลือง",
    contactName: "ศุภกิตติ์ (นักศึกษาปี 2)",
    contactTel: "092-xxx-7766",
    image: "https://images.unsplash.com/photo-1590483256037-7ef3f5e921d7?auto=format&fit=crop&w=800&q=80",
    secretQuestion: "ตุ๊กตาที่ห้อยคู่กับกุญแจมีลักษณะพิเศษอย่างไร?",
    secretClue: "เป็ดสีเหลืองสวมหมวกกันน็อกสีดำ",
    claimStatus: "none"
  }
];

export const CATEGORIES = [
  { id: "all", label: "ทุกหมวดหมู่ (All Categories)" },
  { id: "Electronics", label: "อุปกรณ์ไอที / อิเล็กทรอนิกส์ (Electronics)" },
  { id: "Student IDs", label: "บัตรนักศึกษา / เอกสาร (Student IDs & Cards)" },
  { id: "Books", label: "หนังสือ / อุปกรณ์การเรียน (Books & Study)" },
  { id: "Personal Items", label: "ของใช้ส่วนตัว / อื่นๆ (Personal Items)" },
];

export const LOCATIONS = [
  { id: "all", label: "ทุกสถานที่ (All Locations)" },
  { id: "อาคาร 1 (IT Building)", label: "อาคาร 1 คณะ IT (ตึก IT)" },
  { id: "ห้อง Lab 1-302", label: "ห้องปฏิบัติการคอมพิวเตอร์ (Lab 1-302)" },
  { id: "โรงอาหารกลาง", label: "โรงอาหารกลาง (Cafeteria)" },
  { id: "หอสมุดกลาง", label: "หอสมุดกลาง (Central Library)" },
  { id: "อาคารคุณหญิงพัฒนา", label: "อาคารคุณหญิงพัฒนา (Classrooms)" },
  { id: "ลานจอดรถ", label: "ลานจอดรถอาคาร IT (Parking Area)" },
];

export const STUDENT_PROFILE = {
  name: "นายสิริเดช เกตานนท์",
  studentId: "6804130",
  course: "DIT204 Information System Project Management",
  major: "สาขาวิชานวัตกรรมดิจิทัลและปัญญาประดิษฐ์",
  faculty: "วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี",
  university: "มหาวิทยาลัยรังสิต",
  instructors: "อ.นิษฐเนตร์ ณัฏฐกุลนันท์ & ผศ.ดร.กานต์ ยงศิริวิทย์",
  role: "Project Owner / Developer",
  semester: "ภาคการศึกษาที่ 1/2569",
};

// Initial Claims Data for Staff Verification & Approval
export const INITIAL_CLAIMS = [
  {
    id: 1,
    itemId: 'item-002',
    itemTitle: 'บัตรประจำตัวนักศึกษา มหาวิทยาลัยรังสิต',
    claimantName: 'นายสิริเดช เกตานนท์',
    claimantId: '6804130',
    claimantContact: '089-xxx-4130',
    secretQuestion: 'ระบุรหัสนักศึกษา 3 ตัวท้าย และชื่อบนบัตรเพื่อยืนยันตัวตน',
    secretClue: 'รหัสลงท้าย 204',
    proofAnswer: 'รหัสท้าย 204 ชื่อนายสิริเดช เกตานนท์ สาขาวิชา DIT',
    status: 'PENDING', // PENDING, APPROVED, REJECTED
    submittedAt: '2026-11-06 14:20 น.',
    custodyLocation: 'ห้องธุรการสาขาวิชา DIT (อาคาร 1 ชั้น 1)'
  },
  {
    id: 2,
    itemId: 'item-004',
    itemTitle: 'กระเป๋าสตางค์หนังแท้สีดำ (Leather Wallet)',
    claimantName: 'นายนภัทร วงศ์สวัสดิ์',
    claimantId: '6804999',
    claimantContact: '085-xxx-9911',
    secretQuestion: 'ระบุชื่อยี่ห้อกระเป๋าหรือจำนวนบัตรที่มีอยู่ด้านในอย่างถูกต้อง',
    secretClue: 'แบรนด์ Guy Laroche มีบัตรสะสมแต้ม 2 ใบ',
    proofAnswer: 'กระเป๋า Guy Laroche ด้านในมีบัตรสะสมแต้ม Cafe Amazon 2 ใบ',
    status: 'PENDING',
    submittedAt: '2026-11-06 16:30 น.',
    custodyLocation: 'ห้องธุรการสาขาวิชา DIT (อาคาร 1 ชั้น 1)'
  }
];

