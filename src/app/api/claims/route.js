import { NextResponse } from 'next/server';
import { getDbClaims, createDbClaim } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const claims = await getDbClaims();
    return NextResponse.json({
      success: true,
      count: claims.length,
      data: claims,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'ไม่สามารถดึงข้อมูลคำขอรับคืนได้', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { itemId, claimantId, claimantName, claimantContact, proofAnswer } = body;

    if (!itemId || !proofAnswer || !proofAnswer.trim()) {
      return NextResponse.json(
        { success: false, message: 'กรุณาระบุรหัสรายการและคำตอบเพื่อยืนยันความเป็นเจ้าของ' },
        { status: 400 }
      );
    }

    const result = await createDbClaim({
      itemId,
      claimantId,
      claimantName,
      claimantContact,
      proofAnswer: proofAnswer.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'ส่งคำขอรับคืนสำเร็จ! คำขอถูกส่งไปยังอาจารย์/เจ้าหน้าที่เพื่อตรวจสอบแล้ว',
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการบันทึกคำขอรับคืน', error: error.message },
      { status: 500 }
    );
  }
}
