import { NextResponse } from 'next/server';
import { getDbUsers, createDbUser } from '@/lib/db';

export const dynamic = 'force-dynamic';

function isAdminRequest(request) {
  const role = request.headers.get('x-user-role');
  return role === 'admin';
}

export async function GET(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json(
      { success: false, message: 'จำกัดสิทธิ์เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น' },
      { status: 403 }
    );
  }

  try {
    const users = await getDbUsers();
    return NextResponse.json({
      success: true,
      data: { users },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json(
      { success: false, message: 'จำกัดสิทธิ์เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { studentId, name, email, password, role, faculty, major, phone } = body;

    if (!studentId || !String(studentId).trim()) {
      return NextResponse.json({ success: false, message: 'กรุณากรอก Username / รหัสนักศึกษา' }, { status: 400 });
    }
    if (!name || !String(name).trim()) {
      return NextResponse.json({ success: false, message: 'กรุณากรอกชื่อ-นามสกุลผู้ใช้งาน' }, { status: 400 });
    }
    if (!password || !String(password).trim()) {
      return NextResponse.json({ success: false, message: 'กรุณากรอกรหัสผ่าน (Password)' }, { status: 400 });
    }

    const result = await createDbUser({
      studentId,
      name,
      email,
      password,
      role,
      faculty,
      major,
      phone,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'เพิ่มบัญชีผู้ใช้งานใหม่เรียบร้อยแล้ว',
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    const status = error.message.includes('มีอยู่ในระบบแล้ว') ? 409 : 500;
    return NextResponse.json(
      { success: false, message: error.message || 'เกิดข้อผิดพลาดในการเพิ่มผู้ใช้งาน' },
      { status }
    );
  }
}
