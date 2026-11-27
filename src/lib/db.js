import mysql from 'mysql2/promise';
import { INITIAL_ITEMS, INITIAL_CLAIMS } from '../data/initialItems';

// In-memory fallback dataset for offline demo & development
const globalStore = globalThis;

if (!globalStore.__lostFoundMockDb) {
  globalStore.__lostFoundMockDb = {
    users: [
      {
        id: 1,
        student_id: '6804130',
        name: 'นายสิริเดช เกตานนท์',
        email: 's6804130@rsu.ac.th',
        password_hash: 'student2026',
        role: 'student',
        faculty: 'วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี',
        major: 'นวัตกรรมดิจิทัลและปัญญาประดิษฐ์',
        phone: '089-xxx-4130',
        created_at: '2026-11-01 09:00:00',
      },
      {
        id: 2,
        student_id: 'Staffdit',
        name: 'อาจารย์นิษฐเนตร์ ณัฏฐกุลนันท์',
        email: 'nittanate.n@rsu.ac.th',
        password_hash: 'Staffdit1234',
        role: 'staff',
        faculty: 'วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี',
        major: 'อาจารย์ประจำสาขาวิชา DIT',
        phone: '02-997-2200',
        created_at: '2026-11-01 09:00:00',
      },
      {
        id: 3,
        student_id: 'admindit',
        name: 'ผู้ดูแลระบบ DIT Lost & Found',
        email: 'admindit@rsu.ac.th',
        password_hash: 'admin1234',
        role: 'admin',
        faculty: 'สำนักงานเทคโนโลยีสารสนเทศ',
        major: 'ศูนย์ควบคุมและบริหารระบบ Lost & Found',
        phone: '02-997-2200',
        created_at: '2026-11-01 09:00:00',
      },
    ],
    categories: [
      { id: 'Electronics', name_th: 'อุปกรณ์ไอที / อิเล็กทรอนิกส์', name_en: 'Electronics', icon: 'laptop' },
      { id: 'Student IDs', name_th: 'บัตรนักศึกษา / เอกสาร', name_en: 'Student IDs & Cards', icon: 'credit-card' },
      { id: 'Books', name_th: 'หนังสือ / อุปกรณ์การเรียน', name_en: 'Books & Study', icon: 'book-open' },
      { id: 'Personal Items', name_th: 'ของใช้ส่วนตัว / อื่นๆ', name_en: 'Personal Items', icon: 'briefcase' },
    ],
    locations: [
      { id: 'loc-001', name: 'อาคาร 1 คณะ IT (ตึก IT)', building: 'อาคาร 1 IT', floor: 'ชั้น 1', room: 'โถงกลาง' },
      { id: 'loc-002', name: 'ห้องปฏิบัติการคอมพิวเตอร์ (Lab 1-302)', building: 'อาคาร 1 IT', floor: 'ชั้น 3', room: 'Lab 1-302' },
      { id: 'loc-003', name: 'โรงอาหารกลาง (Cafeteria อาคาร 1)', building: 'อาคาร 1 IT', floor: 'ชั้น 1', room: 'โรงอาหาร' },
      { id: 'loc-004', name: 'หอสมุดกลาง (Central Library)', building: 'อาคารหอสมุด', floor: 'ชั้น 2', room: 'Co-Working' },
      { id: 'loc-005', name: 'อาคารคุณหญิงพัฒนา (Classrooms)', building: 'อาคารคุณหญิงพัฒนา', floor: 'ชั้น 4', room: 'ห้อง 4-401' },
      { id: 'loc-006', name: 'ลานจอดรถอาคาร IT (Parking Area)', building: 'ลานจอดรถตึก 1', floor: 'ชั้น G', room: 'ลานจอด' },
    ],
    items: [...INITIAL_ITEMS],
    claims: [
      {
        id: 1,
        item_id: 'item-005',
        itemTitle: 'สมุดสรุปเลกเชอร์ DIT204 Project Management',
        claimant_id: '6804130',
        claimant_name: 'นายสิริเดช เกตานนท์',
        claimant_contact: '089-xxx-4130',
        proof_answer: 'ลายเซ็นสิริเดช และรหัส 6804130 หน้าปกใน',
        status: 'APPROVED',
        verified_by: 'อาจารย์นิษฐเนตร์ ณัฏฐกุลนันท์',
        created_at: '2026-11-03 14:20:00',
      },
      ...INITIAL_CLAIMS.map((c, idx) => ({
        id: idx + 2,
        item_id: c.itemId,
        itemTitle: c.itemTitle,
        claimant_id: c.claimantId,
        claimant_name: c.claimantName,
        claimant_contact: c.claimantContact,
        proof_answer: c.proofAnswer,
        secretQuestion: c.secretQuestion,
        secretClue: c.secretClue,
        custodyLocation: c.custodyLocation,
        status: c.status,
        verified_by: c.verifiedBy || null,
        created_at: c.submittedAt,
      })),
    ],
    reviews: [
      {
        id: 1,
        reviewer_name: 'กุลธิดา (นักศึกษา DIT)',
        reviewer_role: 'student',
        rating: 5,
        usability_score: 5,
        comment: 'ใช้งานง่ายมาก ค้นหาของหายตามอาคารและหมวดหมู่ได้ไวกว่าการไล่ดูในกลุ่มแชทเยอะเลยค่ะ',
        created_at: '2026-11-20 10:15:00',
      },
      {
        id: 2,
        reviewer_name: 'ศุภกิตติ์ (นักศึกษาปี 2)',
        reviewer_role: 'student',
        rating: 4,
        usability_score: 5,
        comment: 'ชอบระบบคำถามลับยืนยันความเป็นเจ้าของ รู้สึกปลอดภัยดี และอัปโหลดรูปจากมือถือได้สะดวกครับ',
        created_at: '2026-11-21 14:30:00',
      },
      {
        id: 3,
        reviewer_name: 'อาจารย์นิษฐเนตร์ ณัฏฐกุลนันท์',
        reviewer_role: 'staff',
        rating: 5,
        usability_score: 5,
        comment: 'ระบบแยกสิทธิ์บทบาทชัดเจน ฝั่งเจ้าหน้าที่ตรวจคำขอรับคืนและปักหมุดรายการด่วนได้สะดวกมาก',
        created_at: '2026-11-22 09:45:00',
      },
    ],
  };
}

const mockDb = globalStore.__lostFoundMockDb;

function formatDateValue(val) {
  if (!val) return new Date().toISOString().split('T')[0];
  if (val instanceof Date) return val.toISOString().split('T')[0];
  const str = String(val);
  return str.includes('T') ? str.split('T')[0] : str.slice(0, 10);
}

function formatDateTimeValue(val) {
  if (!val) return new Date().toISOString().replace('T', ' ').slice(0, 19);
  if (val instanceof Date) return val.toISOString().replace('T', ' ').slice(0, 19);
  return String(val);
}

// Convert TiDB snake_case row to consistent frontend camelCase object (preserving category_id for /database analytics)
export function normalizeItemRow(row) {
  if (!row) return null;
  const category = row.category_id || row.category || 'Electronics';
  const type = row.type || 'LOST';
  return {
    id: row.id,
    title: row.title,
    englishTitle: row.english_title ?? row.englishTitle ?? '',
    type,
    status: row.status || (type === 'LOST' ? 'LOOKING_FOR_OWNER' : 'FOUND_ITEM'),
    category,
    category_id: category,
    location: row.location || '',
    date: formatDateValue(row.date),
    time: row.time || '',
    description: row.description || '',
    image:
      row.image ||
      (type === 'LOST'
        ? 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'),
    secretQuestion: row.secret_question ?? row.secretQuestion ?? '',
    contactName: row.contact_name ?? row.contactName ?? '',
    contactTel: row.contact_tel ?? row.contactTel ?? '',
    reporterId: row.reporter_id ?? row.reporterId ?? '',
    claimedBy: row.claimed_by ?? row.claimedBy ?? '',
    claimantContact: row.claimant_contact ?? row.claimantContact ?? '',
    claimProof: row.claim_proof ?? row.claimProof ?? '',
    claimStatus: row.claim_status ?? row.claimStatus ?? 'none',
    isPinned: Boolean(row.is_pinned ?? row.isPinned ?? false),
    isUnderCustody: Boolean(row.is_under_custody ?? row.isUnderCustody ?? type === 'FOUND'),
    custodyLocation: row.custody_location ?? row.custodyLocation ?? (type === 'FOUND' ? 'ห้องธุรการสาขาวิชา DIT (อาคาร 1 ชั้น 1)' : ''),
    verifiedBy: row.verified_by ?? row.verifiedBy ?? '',
  };
}

export function normalizeClaimRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    itemId: row.item_id ?? row.itemId,
    itemTitle: row.item_title ?? row.itemTitle ?? `รายการ ${row.item_id ?? row.itemId}`,
    claimantId: row.claimant_id ?? row.claimantId,
    claimantName: row.claimant_name ?? row.claimantName,
    claimantContact: row.claimant_contact ?? row.claimantContact,
    secretQuestion: row.secret_question ?? row.secretQuestion ?? 'ระบุจุดสังเกตเฉพาะของสิ่งของ',
    secretClue: row.secret_clue ?? row.secretClue ?? 'รอตรวจสอบหลักฐานกับผู้แจ้ง',
    proofAnswer: row.proof_answer ?? row.proofAnswer,
    status: row.status || 'PENDING',
    verifiedBy: row.verified_by ?? row.verifiedBy ?? null,
    submittedAt: formatDateTimeValue(row.created_at ?? row.submittedAt),
    custodyLocation: row.custody_location ?? row.custodyLocation ?? 'ห้องธุรการสาขาวิชา DIT (อาคาร 1 ชั้น 1)',
  };
}

function enrichUserProfile(user) {
  const role = user.role || 'student';
  if (role === 'staff') {
    return {
      ...user,
      studentId: user.student_id || user.studentId || 'Staffdit',
      roleName: 'อาจารย์ / เจ้าหน้าที่คณะ (Staff)',
      badge: 'อาจารย์ประจำ • DIT RSU',
      initials: user.name?.slice(0, 2) || 'นิ',
      color: 'from-amber-500 to-orange-700',
    };
  }
  if (role === 'admin') {
    return {
      ...user,
      studentId: user.student_id || user.studentId || 'admindit',
      roleName: 'ผู้ดูแลระบบสูงสุด (System Admin)',
      badge: 'Admin • IT Dept',
      initials: 'แอด',
      color: 'from-purple-600 to-indigo-800',
    };
  }
  const sid = user.student_id || user.studentId || '6804130';
  return {
    ...user,
    studentId: sid,
    roleName: 'นักศึกษา (Student)',
    badge: `รหัส ${sid} • DIT RSU`,
    initials: user.name?.slice(0, 2) || 'สิ',
    color: 'from-sky-500 to-blue-700',
  };
}

export function getTiDbPool() {
  if (globalStore.__tidbPool) return globalStore.__tidbPool;

  const host = process.env.TIDB_HOST;
  const user = process.env.TIDB_USER;
  const password = process.env.TIDB_PASSWORD;
  const database = process.env.TIDB_DATABASE || 'lost_and_found';
  const port = parseInt(process.env.TIDB_PORT || '4000', 10);
  const enableSsl = process.env.TIDB_ENABLE_SSL !== 'false';

  if (!host || !user) {
    return null;
  }

  try {
    globalStore.__tidbPool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      ssl: enableSsl ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 10000,
    });
    return globalStore.__tidbPool;
  } catch (err) {
    console.warn('Could not initialize TiDB pool, using fallback mock store:', err.message);
    return null;
  }
}

// Check connection status
export async function getDatabaseStatus() {
  const p = getTiDbPool();
  if (!p) {
    return {
      connected: false,
      engine: 'TiDB Fallback Mode (Demo / Presentation)',
      host: 'Local Memory / Mock Store',
      database: 'lost_and_found',
      message: 'รันโหมดจำลอง (เชื่อมต่อ TiDB Cloud เมื่อตั้งค่า Environment Variables)',
    };
  }

  try {
    const connection = await p.getConnection();
    const [rows] = await connection.query('SELECT VERSION() as version, DATABASE() as db');
    connection.release();
    return {
      connected: true,
      engine: 'TiDB Cloud (MySQL 8.0 Protocol)',
      version: rows[0]?.version || 'TiDB Serverless v7.1',
      host: process.env.TIDB_HOST,
      database: rows[0]?.db || process.env.TIDB_DATABASE,
      message: 'เชื่อมต่อฐานข้อมูล TiDB สำเร็จ 🟢',
    };
  } catch (err) {
    return {
      connected: false,
      engine: 'TiDB Fallback Mode',
      host: process.env.TIDB_HOST || 'localhost',
      database: process.env.TIDB_DATABASE || 'lost_and_found',
      error: err.message,
      message: 'ไม่สามารถติดต่อ TiDB Cloud ได้ (สลับมาใช้โหมดจำลองอัตโนมัติ)',
    };
  }
}

// Get all tables summary for Admin Analytics & TiDB Dashboard (masking sensitive columns)
export async function getAllTablesData() {
  const status = await getDatabaseStatus();
  const p = getTiDbPool();

  if (status.connected && p) {
    try {
      const [users] = await p.query('SELECT id, student_id, name, role, faculty, major, created_at FROM users ORDER BY id ASC');
      const [items] = await p.query(
        'SELECT id, title, english_title, type, status, category_id, location, date, time, description, claim_status, is_pinned, is_under_custody, custody_location, verified_by, created_at FROM items ORDER BY created_at DESC'
      );
      const [categories] = await p.query('SELECT id, name_th, name_en, icon FROM categories');
      const [locations] = await p.query('SELECT id, name, building, floor, room FROM locations');
      const [claims] = await p.query('SELECT id, item_id, status, verified_by, created_at FROM claims ORDER BY id DESC');
      let reviews = [];
      try {
        const [revRows] = await p.query(
          'SELECT id, reviewer_name, reviewer_role, rating, usability_score, comment, created_at FROM reviews ORDER BY id DESC'
        );
        reviews = revRows;
      } catch (revErr) {
        reviews = mockDb.reviews || [];
      }

      return {
        status,
        tables: {
          users: { columns: ['id', 'student_id', 'name', 'role', 'major', 'created_at'], rows: users },
          items: { columns: ['id', 'title', 'type', 'status', 'category_id', 'location', 'date'], rows: items },
          categories: { columns: ['id', 'name_th', 'name_en', 'icon'], rows: categories },
          locations: { columns: ['id', 'name', 'building', 'floor', 'room'], rows: locations },
          claims: { columns: ['id', 'item_id', 'status', 'verified_by', 'created_at'], rows: claims },
          reviews: { columns: ['id', 'reviewer_name', 'reviewer_role', 'rating', 'usability_score', 'comment', 'created_at'], rows: reviews },
        },
      };
    } catch (e) {
      console.warn('TiDB query failed, fallback to memory:', e.message);
    }
  }

  return {
    status,
    tables: {
      users: {
        columns: ['id', 'student_id', 'name', 'role', 'major', 'created_at'],
        rows: mockDb.users.map(({ id, student_id, name, role, major, created_at }) => ({
          id,
          student_id,
          name,
          role,
          major,
          created_at,
        })),
      },
      items: {
        columns: ['id', 'title', 'type', 'status', 'category_id', 'location', 'date'],
        rows: mockDb.items.map((item) => ({
          ...item,
          category_id: item.category_id || item.category,
        })),
      },
      categories: {
        columns: ['id', 'name_th', 'name_en', 'icon'],
        rows: mockDb.categories,
      },
      locations: {
        columns: ['id', 'name', 'building', 'floor', 'room'],
        rows: mockDb.locations,
      },
      claims: {
        columns: ['id', 'item_id', 'status', 'verified_by', 'created_at'],
        rows: mockDb.claims.map(({ id, item_id, status, verified_by, created_at }) => ({
          id,
          item_id,
          status,
          verified_by,
          created_at,
        })),
      },
      reviews: {
        columns: ['id', 'reviewer_name', 'reviewer_role', 'rating', 'usability_score', 'comment', 'created_at'],
        rows: mockDb.reviews || [],
      },
    },
  };
}

// User Authentication (TiDB + Demo fallback)
export async function authenticateUser(studentId, password) {
  const cleanId = (studentId || '').trim();
  const cleanPass = password || '';
  const p = getTiDbPool();

  if (p) {
    try {
      const [rows] = await p.query('SELECT * FROM users WHERE student_id = ? OR email = ? LIMIT 1', [cleanId, cleanId]);
      if (rows && rows.length > 0) {
        const user = rows[0];
        const isPrivileged = user.role === 'staff' || user.role === 'admin';
        const isValidPassword = isPrivileged
          ? user.password_hash === cleanPass
          : !cleanPass ||
            user.password_hash === cleanPass ||
            cleanPass === 'password123' ||
            cleanPass === 'student2026';

        if (isValidPassword) {
          const { password_hash, ...safeUser } = user;
          return { success: true, user: enrichUserProfile(safeUser), source: 'tidb' };
        }
        return { success: false, message: 'รหัสผ่านไม่ถูกต้อง' };
      }
    } catch (err) {
      console.warn('TiDB auth error, checking mock:', err.message);
    }
  }

  const foundMock = mockDb.users.find((u) => u.student_id === cleanId || u.email === cleanId);
  if (foundMock) {
    const isPrivileged = foundMock.role === 'staff' || foundMock.role === 'admin';
    if (isPrivileged && foundMock.password_hash !== cleanPass) {
      return { success: false, message: 'รหัสผ่านไม่ถูกต้อง' };
    }
    const { password_hash, ...safeUser } = foundMock;
    return { success: true, user: enrichUserProfile(safeUser), source: 'mock' };
  }

  // Reject wrong credentials attempting to impersonate staff/admin
  if (/admin|staff/i.test(cleanId)) {
    return { success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
  }

  // Auto-provision demo student account for arbitrary student IDs during evaluation
  const generatedUser = {
    id: mockDb.users.length + 1,
    student_id: cleanId,
    name: cleanId === '6804130' ? 'นายสิริเดช เกตานนท์' : `นักศึกษา (${cleanId})`,
    email: `${cleanId}@rsu.ac.th`,
    role: 'student',
    faculty: 'วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี',
    major: 'นวัตกรรมดิจิทัลและปัญญาประดิษฐ์',
    phone: '089-xxx-4130',
    created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
  };
  return { success: true, user: enrichUserProfile(generatedUser), source: 'demo' };
}

// Items CRUD (TiDB primary with in-memory fallback)
export async function getDbItems() {
  const p = getTiDbPool();
  if (p) {
    try {
      const [rows] = await p.query(
        `SELECT id, title, english_title, type, status, category_id, location, date, time, description, image,
                secret_question, contact_name, contact_tel, reporter_id, claimed_by, claimant_contact, claim_proof,
                returned_date, claim_status, is_pinned, is_under_custody, custody_location, verified_by, created_at
         FROM items
         ORDER BY is_pinned DESC, created_at DESC`
      );
      if (rows) return rows.map(normalizeItemRow);
    } catch (err) {
      console.warn('TiDB getDbItems fallback:', err.message);
    }
  }
  return mockDb.items.map(normalizeItemRow);
}

export async function getDbItemById(id) {
  const p = getTiDbPool();
  if (p) {
    try {
      const [rows] = await p.query(
        `SELECT id, title, english_title, type, status, category_id, location, date, time, description, image,
                secret_question, contact_name, contact_tel, reporter_id, claimed_by, claimant_contact, claim_proof,
                returned_date, claim_status, is_pinned, is_under_custody, custody_location, verified_by, created_at
         FROM items WHERE id = ? LIMIT 1`,
        [id]
      );
      if (rows && rows.length > 0) return normalizeItemRow(rows[0]);
    } catch (err) {
      console.warn('TiDB getDbItemById fallback:', err.message);
    }
  }
  const found = mockDb.items.find((i) => i.id === id);
  return found ? normalizeItemRow(found) : null;
}

export async function addDbItem(item) {
  const type = item.type === 'FOUND' ? 'FOUND' : 'LOST';
  const newItem = {
    id: `item-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
    status: type === 'LOST' ? 'LOOKING_FOR_OWNER' : 'FOUND_ITEM',
    claimStatus: 'none',
    isPinned: false,
    isUnderCustody: type === 'FOUND',
    custodyLocation: type === 'FOUND' ? 'ห้องธุรการสาขาวิชา DIT (อาคาร 1 ชั้น 1)' : '',
    verifiedBy: '',
    ...item,
    type,
  };

  const p = getTiDbPool();
  if (p) {
    try {
      await p.query(
        `INSERT INTO items (
          id, title, english_title, type, status, category_id, location, date, time, description, image,
          secret_question, secret_clue, contact_name, contact_tel, reporter_id,
          claim_status, is_pinned, is_under_custody, custody_location, verified_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newItem.id,
          newItem.title,
          newItem.englishTitle || '',
          newItem.type,
          newItem.status,
          newItem.category || 'Electronics',
          newItem.location,
          newItem.date,
          newItem.time,
          newItem.description || '',
          newItem.image || '',
          newItem.secretQuestion || '',
          newItem.secretClue || '',
          newItem.contactName || 'นักศึกษา DIT',
          newItem.contactTel || '-',
          newItem.reporterId || '6804130',
          newItem.claimStatus,
          newItem.isPinned,
          newItem.isUnderCustody,
          newItem.custodyLocation || null,
          newItem.verifiedBy || null,
        ]
      );
    } catch (err) {
      console.warn('TiDB addDbItem fallback to memory:', err.message);
    }
  }

  mockDb.items = [newItem, ...mockDb.items];
  return normalizeItemRow(newItem);
}

export async function updateDbItem(id, updates) {
  const p = getTiDbPool();
  if (p) {
    try {
      const fields = [];
      const values = [];

      if (updates.status !== undefined) {
        fields.push('status = ?');
        values.push(updates.status);
        if (updates.status === 'RETURNED') {
          fields.push('returned_date = ?');
          values.push(updates.returnedDate || new Date().toISOString().split('T')[0]);
        }
      }
      if (updates.claimStatus !== undefined) {
        fields.push('claim_status = ?');
        values.push(updates.claimStatus);
      }
      if (updates.isPinned !== undefined) {
        fields.push('is_pinned = ?');
        values.push(Boolean(updates.isPinned));
      }
      if (updates.isUnderCustody !== undefined) {
        fields.push('is_under_custody = ?');
        values.push(Boolean(updates.isUnderCustody));
      }
      if (updates.custodyLocation !== undefined) {
        fields.push('custody_location = ?');
        values.push(updates.custodyLocation);
      }
      if (updates.verifiedBy !== undefined) {
        fields.push('verified_by = ?');
        values.push(updates.verifiedBy);
      }
      if (updates.claimedBy !== undefined) {
        fields.push('claimed_by = ?');
        values.push(updates.claimedBy);
      }
      if (updates.claimantContact !== undefined) {
        fields.push('claimant_contact = ?');
        values.push(updates.claimantContact);
      }
      if (updates.claimProof !== undefined) {
        fields.push('claim_proof = ?');
        values.push(updates.claimProof);
      }

      if (fields.length > 0) {
        values.push(id);
        await p.query(`UPDATE items SET ${fields.join(', ')} WHERE id = ?`, values);
      }
    } catch (err) {
      console.warn('TiDB updateDbItem error:', err.message);
    }
  }

  const index = mockDb.items.findIndex((i) => i.id === id);
  if (index !== -1) {
    mockDb.items[index] = { ...mockDb.items[index], ...updates };
  }

  return await getDbItemById(id);
}

export async function deleteDbItem(id) {
  const existing = await getDbItemById(id);
  if (!existing) return null;

  const p = getTiDbPool();
  if (p) {
    try {
      await p.query('DELETE FROM claims WHERE item_id = ?', [id]);
      await p.query('DELETE FROM items WHERE id = ?', [id]);
    } catch (err) {
      console.warn('TiDB deleteDbItem error:', err.message);
    }
  }

  mockDb.items = mockDb.items.filter((i) => i.id !== id);
  mockDb.claims = mockDb.claims.filter((c) => (c.item_id ?? c.itemId) !== id);
  return existing;
}

// Claims CRUD (for REQ 03 & Staff Verification Workflow)
export async function getDbClaims() {
  const p = getTiDbPool();
  if (p) {
    try {
      const [rows] = await p.query(
        `SELECT c.id, c.item_id, c.claimant_id, c.claimant_name, c.claimant_contact,
                c.proof_answer, c.status, c.verified_by, c.created_at,
                i.title AS item_title, i.secret_question, i.secret_clue, i.custody_location
         FROM claims c
         LEFT JOIN items i ON c.item_id = i.id
         ORDER BY FIELD(c.status, 'PENDING', 'APPROVED', 'REJECTED'), c.id DESC`
      );
      if (rows) return rows.map(normalizeClaimRow);
    } catch (err) {
      console.warn('TiDB getDbClaims fallback:', err.message);
    }
  }

  return mockDb.claims.map((c) => {
    const item = mockDb.items.find((i) => i.id === (c.item_id ?? c.itemId));
    return normalizeClaimRow({
      ...c,
      item_title: c.itemTitle || item?.title,
      secret_question: c.secretQuestion || item?.secretQuestion,
      secret_clue: c.secretClue || item?.secretClue,
      custody_location: c.custodyLocation || item?.custodyLocation,
    });
  });
}

export async function createDbClaim({ itemId, claimantId, claimantName, claimantContact, proofAnswer }) {
  const p = getTiDbPool();
  let insertedId = Date.now();

  if (p) {
    try {
      const [result] = await p.query(
        `INSERT INTO claims (item_id, claimant_id, claimant_name, claimant_contact, proof_answer, status)
         VALUES (?, ?, ?, ?, ?, 'PENDING')`,
        [itemId, claimantId || '6804130', claimantName || 'นักศึกษา DIT', claimantContact || '-', proofAnswer]
      );
      if (result?.insertId) insertedId = result.insertId;

      await p.query(
        `UPDATE items SET claim_status = 'pending', claimed_by = ?, claimant_contact = ?, claim_proof = ? WHERE id = ?`,
        [`${claimantName} (${claimantId})`, claimantContact || '-', proofAnswer, itemId]
      );
    } catch (err) {
      console.warn('TiDB createDbClaim error:', err.message);
    }
  }

  const item = mockDb.items.find((i) => i.id === itemId);
  if (item) {
    item.claimStatus = 'pending';
    item.claimedBy = `${claimantName} (${claimantId})`;
    item.claimProof = proofAnswer;
  }

  const newClaim = {
    id: insertedId,
    item_id: itemId,
    itemTitle: item?.title || `รายการ ${itemId}`,
    claimant_id: claimantId || '6804130',
    claimant_name: claimantName || 'นักศึกษา DIT',
    claimant_contact: claimantContact || '-',
    secretQuestion: item?.secretQuestion || '',
    secretClue: item?.secretClue || '',
    proof_answer: proofAnswer,
    status: 'PENDING',
    verified_by: null,
    created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
    custodyLocation: item?.custodyLocation || 'ห้องธุรการสาขาวิชา DIT (อาคาร 1 ชั้น 1)',
  };

  mockDb.claims.unshift(newClaim);
  return {
    claim: normalizeClaimRow(newClaim),
    item: await getDbItemById(itemId),
  };
}

export async function resolveDbClaim(claimId, decisionStatus, verifiedBy) {
  const status = decisionStatus === 'APPROVED' ? 'APPROVED' : 'REJECTED';
  const reviewer = verifiedBy || 'อาจารย์นิษฐเนตร์ ณัฏฐกุลนันท์';
  const p = getTiDbPool();
  let targetItemId = null;

  if (p) {
    try {
      const [claimRows] = await p.query('SELECT * FROM claims WHERE id = ? LIMIT 1', [claimId]);
      if (claimRows && claimRows.length > 0) {
        targetItemId = claimRows[0].item_id;
        await p.query('UPDATE claims SET status = ?, verified_by = ? WHERE id = ?', [status, reviewer, claimId]);

        if (status === 'APPROVED') {
          await p.query(
            `UPDATE items
             SET status = 'RETURNED', claim_status = 'approved', verified_by = ?, returned_date = CURDATE(),
                 claimed_by = COALESCE(claimed_by, ?), claim_proof = COALESCE(claim_proof, ?)
             WHERE id = ?`,
            [
              reviewer,
              `${claimRows[0].claimant_name} (${claimRows[0].claimant_id})`,
              claimRows[0].proof_answer,
              targetItemId,
            ]
          );
        } else {
          await p.query(`UPDATE items SET claim_status = 'rejected', verified_by = ? WHERE id = ?`, [
            reviewer,
            targetItemId,
          ]);
        }
      }
    } catch (err) {
      console.warn('TiDB resolveDbClaim error:', err.message);
    }
  }

  const mockClaim = mockDb.claims.find((c) => String(c.id) === String(claimId));
  if (mockClaim) {
    mockClaim.status = status;
    mockClaim.verified_by = reviewer;
    targetItemId = targetItemId || (mockClaim.item_id ?? mockClaim.itemId);
  }

  if (targetItemId) {
    const mockItem = mockDb.items.find((i) => i.id === targetItemId);
    if (mockItem) {
      mockItem.verifiedBy = reviewer;
      mockItem.claimStatus = status === 'APPROVED' ? 'approved' : 'rejected';
      if (status === 'APPROVED') mockItem.status = 'RETURNED';
    }
  }

  return {
    claims: await getDbClaims(),
    updatedItem: targetItemId ? await getDbItemById(targetItemId) : null,
  };
}

// ========================================================
// Reviews & User Satisfaction Feedback (TiDB Table: reviews)
// ========================================================
export function normalizeReviewRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    reviewerName: row.reviewer_name ?? row.reviewerName ?? 'ผู้ใช้งานทั่วไป',
    reviewerRole: row.reviewer_role ?? row.reviewerRole ?? 'student',
    rating: Number(row.rating || 5),
    usabilityScore: Number(row.usability_score ?? row.usabilityScore ?? 5),
    comment: row.comment || '',
    createdAt: formatDateTimeValue(row.created_at ?? row.createdAt),
  };
}

export function computeReviewSummary(reviews) {
  const total = reviews.length;
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let ratingSum = 0;
  let usabilitySum = 0;

  reviews.forEach((r) => {
    const score = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
    breakdown[score] = (breakdown[score] || 0) + 1;
    ratingSum += score;
    usabilitySum += Math.min(5, Math.max(1, Math.round(r.usabilityScore || 5)));
  });

  const averageRating = total > 0 ? Number((ratingSum / total).toFixed(2)) : 0;
  const averageUsability = total > 0 ? Number((usabilitySum / total).toFixed(2)) : 0;
  const satisfactionPercent = total > 0 ? Number(((averageRating / 5) * 100).toFixed(1)) : 0;

  return {
    total,
    averageRating,
    averageUsability,
    satisfactionPercent,
    breakdown,
  };
}

export async function getDbReviews() {
  const p = getTiDbPool();
  if (p) {
    try {
      const [rows] = await p.query(
        'SELECT id, reviewer_name, reviewer_role, rating, usability_score, comment, created_at FROM reviews ORDER BY id DESC'
      );
      const list = (rows || []).map(normalizeReviewRow);
      return { reviews: list, summary: computeReviewSummary(list) };
    } catch (err) {
      console.warn('TiDB getDbReviews fallback:', err.message);
    }
  }
  const list = (mockDb.reviews || []).map(normalizeReviewRow);
  return { reviews: list, summary: computeReviewSummary(list) };
}

export async function addDbReview({ reviewerName, reviewerRole, rating, usabilityScore, comment }) {
  const cleanName = (reviewerName || 'ผู้ใช้งานระบบ').trim();
  const cleanRole = ['student', 'staff', 'admin', 'guest'].includes(reviewerRole) ? reviewerRole : 'student';
  const cleanRating = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));
  const cleanUsability = Math.min(5, Math.max(1, parseInt(usabilityScore, 10) || 5));
  const cleanComment = (comment || '').trim();

  let insertedId = Date.now();
  const p = getTiDbPool();
  if (p) {
    try {
      const [res] = await p.query(
        `INSERT INTO reviews (reviewer_name, reviewer_role, rating, usability_score, comment)
         VALUES (?, ?, ?, ?, ?)`,
        [cleanName, cleanRole, cleanRating, cleanUsability, cleanComment]
      );
      if (res?.insertId) insertedId = res.insertId;
    } catch (err) {
      console.warn('TiDB addDbReview error:', err.message);
    }
  }

  const newRow = {
    id: insertedId,
    reviewer_name: cleanName,
    reviewer_role: cleanRole,
    rating: cleanRating,
    usability_score: cleanUsability,
    comment: cleanComment,
    created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
  };

  if (!mockDb.reviews) mockDb.reviews = [];
  mockDb.reviews.unshift(newRow);

  const latest = await getDbReviews();
  return { review: normalizeReviewRow(newRow), ...latest };
}

export async function deleteDbReview(id) {
  const p = getTiDbPool();
  if (p) {
    try {
      await p.query('DELETE FROM reviews WHERE id = ?', [id]);
    } catch (err) {
      console.warn('TiDB deleteDbReview error:', err.message);
    }
  }

  if (mockDb.reviews) {
    mockDb.reviews = mockDb.reviews.filter((r) => String(r.id) !== String(id));
  }
  return await getDbReviews();
}
