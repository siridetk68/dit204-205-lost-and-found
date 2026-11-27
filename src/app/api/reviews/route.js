import { NextResponse } from 'next/server';
import { getDbReviews, addDbReview, deleteDbReview } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getDbReviews();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลรีวิว', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const reviewerName = String(body.reviewerName || '').trim() || 'ผู้ใช้งานทั่วไป';
    const reviewerRole = ['student', 'staff', 'admin', 'guest'].includes(body.reviewerRole)
      ? body.reviewerRole
      : 'student';
    const rating = Number(body.rating);
    const usabilityScore = Number(body.usabilityScore || rating || 5);
    const comment = String(body.comment || '').trim();

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'กรุณาให้คะแนนความพึงพอใจตั้งแต่ 1 ถึง 5 ดาว' },
        { status: 400 }
      );
    }

    if (!comment) {
      return NextResponse.json(
        { success: false, message: 'กรุณาพิมพ์ความคิดเห็นหรือข้อเสนอแนะเพิ่มเติม' },
        { status: 400 }
      );
    }

    const data = await addDbReview({
      reviewerName: reviewerName.slice(0, 100),
      reviewerRole,
      rating,
      usabilityScore,
      comment: comment.slice(0, 2000),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'บันทึกรีวิวและความคิดเห็นเรียบร้อยแล้ว ขอบคุณครับ!',
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการบันทึกรีวิว', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'กรุณาระบุรหัสรีวิวที่ต้องการลบ' },
        { status: 400 }
      );
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
