import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { studentId, password } = body;

    if (!studentId) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกรหัสนักศึกษาหรือชื่อผู้ใช้งาน' },
        { status: 400 }
      );
    }

    const result = await authenticateUser(studentId, password || '');

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      data: result.user
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการตรวจสอบบัญชีผู้ใช้', error: error.message },
      { status: 500 }
    );
  }
}

