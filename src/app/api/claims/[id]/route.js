import { NextResponse } from 'next/server';
import { resolveDbClaim } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, verifiedBy } = body;

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'สถานะต้องเป็น APPROVED หรือ REJECTED เท่านั้น' },
        { status: 400 }
      );
    }

    const result = await resolveDbClaim(id, status, verifiedBy);

    return NextResponse.json({
      success: true,
      message: status === 'APPROVED' ? 'อนุมัติการส่งมอบเรียบร้อยแล้ว' : 'ปฏิเสธคำขอรับคืนเรียบร้อยแล้ว',
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตสถานะคำขอ', error: error.message },
      { status: 500 }
    );
  }
}
