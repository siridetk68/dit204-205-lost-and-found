import { NextResponse } from 'next/server';
import { getAllTablesData } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getAllTablesData();
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลตารางฐานข้อมูล', error: error.message },
      { status: 500 }
    );
  }
}

