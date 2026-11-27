import { NextResponse } from 'next/server';
import { deleteDbReview } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function DELETE(request, { params }) {
  try {
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ success: false, message: 'ไม่พบรหัสรีวิวที่ต้องการลบ' }, { status: 400 });
    }

    const data = await deleteDbReview(id);
    return NextResponse.json({
      success: true,
      message: 'ลบรีวิวเรียบร้อยแล้ว',
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลบรีวิว', error: error.message },
      { status: 500 }
    );
  }
}
