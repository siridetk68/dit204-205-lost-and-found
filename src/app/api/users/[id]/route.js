import { NextResponse } from 'next/server';
import { updateDbUser, deleteDbUser } from '@/lib/db';

export const dynamic = 'force-dynamic';

function isAdminRequest(request) {
  const role = request.headers.get('x-user-role');
  return role === 'admin';
}

export async function PATCH(request, { params }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json(
      { success: false, message: 'จำกัดสิทธิ์เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น' },
      { status: 403 }
    );
  }

  try {
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ success: false, message: 'ไม่พบรหัสบัญชีผู้ใช้' }, { status: 400 });
    }

    const body = await request.json();
    const result = await updateDbUser(id, body);

    return NextResponse.json({
      success: true,
      message: 'อัปเดตข้อมูลผู้ใช้งานเรียบร้อยแล้ว',
      data: result,
    });
  } catch (error) {
    const status = error.message.includes('ถูกใช้โดยบัญชีอื่นแล้ว') ? 409 : 500;
    return NextResponse.json(
      { success: false, message: error.message || 'เกิดข้อผิดพลาดในการอัปเดตผู้ใช้งาน' },
      { status }
    );
  }
}

export async function DELETE(request, { params }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json(
      { success: false, message: 'จำกัดสิทธิ์เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น' },
      { status: 403 }
    );
  }

  try {
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ success: false, message: 'ไม่พบรหัสบัญชีผู้ใช้' }, { status: 400 });
    }

    const result = await deleteDbUser(id);
    return NextResponse.json({
      success: true,
      message: 'ลบบัญชีผู้ใช้งานเรียบร้อยแล้ว',
      data: result,
    });
  } catch (error) {
    const status = error.message.includes('ไม่สามารถลบ') ? 400 : 500;
    return NextResponse.json(
      { success: false, message: error.message || 'เกิดข้อผิดพลาดในการลบผู้ใช้งาน' },
      { status }
    );
  }
}
