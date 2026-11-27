import { NextResponse } from 'next/server';
import { getDbItemById, updateDbItem, deleteDbItem } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const item = await getDbItemById(id);

    if (!item) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบรายการที่ค้นหา' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล', error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const updated = await updateDbItem(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบรายการที่ต้องการแก้ไข' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'อัปเดตข้อมูลลงฐานข้อมูล TiDB สำเร็จ',
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'ไม่สามารถอัปเดตข้อมูลได้', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const deleted = await deleteDbItem(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบรายการที่ต้องการลบ' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ลบรายการออกจากฐานข้อมูล TiDB สำเร็จ',
      data: deleted,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'ไม่สามารถลบรายการได้', error: error.message },
      { status: 500 }
    );
  }
}
