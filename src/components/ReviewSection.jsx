'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, Send, CheckCircle2, AlertCircle, ThumbsUp, Trash2, Sparkles, User, Download } from 'lucide-react';

const RATING_LABELS = {
  1: 'ต้องปรับปรุง (1/5)',
  2: 'พอใช้ (2/5)',
  3: 'ปานกลาง (3/5)',
  4: 'ดีมาก (4/5)',
  5: 'ดีเยี่ยม (5/5)',
};

const ROLE_LABELS = {
  student: { label: 'นักศึกษา', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  staff: { label: 'อาจารย์/เจ้าหน้าที่', badge: 'bg-amber-50 text-amber-800 border-amber-200' },
  admin: { label: 'ผู้ดูแลระบบ', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
  guest: { label: 'ผู้เยี่ยมชม', badge: 'bg-slate-100 text-slate-700 border-slate-200' },
};

export default function ReviewSection({ currentUser, standalone = false }) {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    averageRating: 0,
    averageUsability: 0,
    satisfactionPercent: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);

  // Form state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRole, setReviewerRole] = useState('student');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [usabilityScore, setUsabilityScore] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (currentUser?.name && !reviewerName) {
      setReviewerName(currentUser.name);
    }
    if (currentUser?.role) {
      setReviewerRole(currentUser.role);
    }
  }, [currentUser, reviewerName]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setReviews(json.data.reviews || []);
          setSummary(json.data.summary || summary);
        }
      }
    } catch (e) {
      console.warn('Could not load reviews:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedbackMsg({ type: '', text: '' });

    if (!comment.trim()) {
      setFeedbackMsg({ type: 'error', text: 'กรุณาพิมพ์ความคิดเห็นหรือข้อเสนอแนะก่อนส่ง' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewerName: reviewerName.trim() || currentUser?.name || 'ผู้ใช้งานทั่วไป',
          reviewerRole: reviewerRole || currentUser?.role || 'student',
          rating,
          usabilityScore,
          comment: comment.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'ส่งรีวิวไม่สำเร็จ');
      }

      if (json.data?.reviews) setReviews(json.data.reviews);
      if (json.data?.summary) setSummary(json.data.summary);

      setComment('');
      setRating(5);
      setUsabilityScore(5);
      setFeedbackMsg({
        type: 'success',
        text: 'ส่งความคิดเห็นและคะแนนประเมินเรียบร้อยแล้ว! ขอบคุณที่ร่วมประเมินระบบครับ',
      });
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (typeof window !== 'undefined' && !window.confirm('ยืนยันการลบความคิดเห็นนี้ใช่หรือไม่?')) {
      return;
    }
    try {
      const res = await fetch(`/api/reviews?id=${reviewId}`, { method: 'DELETE' });
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setReviews(json.data.reviews || []);
        setSummary(json.data.summary || summary);
      }
    } catch (e) {
      console.error('Failed to delete review:', e);
    }
  };

  const handleExportCsv = () => {
    if (!reviews.length) return;
    const headers = ['ID', 'ชื่อผู้ประเมิน', 'บทบาท', 'คะแนนความพึงพอใจ (เต็ม 5)', 'คะแนนความง่ายในการใช้งาน (เต็ม 5)', 'ความคิดเห็น/ข้อเสนอแนะ', 'วันที่บันทึก'];
    const escapeCsv = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const rows = reviews.map((r) => [
      r.id,
      r.reviewerName,
      ROLE_LABELS[r.reviewerRole]?.label || r.reviewerRole,
      r.rating,
      r.usabilityScore,
      r.comment,
      r.createdAt,
    ]);
    const csvContent = '\uFEFF' + [headers, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lost-and-found-reviews-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isAdmin = currentUser?.role === 'admin';
  const activeStars = hoverRating || rating;
  const kpiPassed = summary.satisfactionPercent >= 70;

  return (
    <section id="reviews-section" className={standalone ? '' : 'mt-14 scroll-mt-24'}>
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft overflow-hidden">
        {/* Section Header */}
        <div className="px-6 sm:px-8 py-6 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-[11px] font-bold text-sky-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>User Satisfaction &amp; Feedback (DIT204 KPI ≥ 70%)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              ประเมินความพึงพอใจและข้อเสนอแนะจากผู้ใช้งาน
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 mt-1">
              ร่วมให้คะแนนและแสดงความคิดเห็นเพื่อพัฒนาเว็บไซต์ Lost &amp; Found (บันทึกข้อมูลลงฐานข้อมูล TiDB Cloud โดยตรง)
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 shrink-0">
            <div className="text-right">
              <div className="text-[11px] text-blue-200 font-semibold">ความพึงพอใจเฉลี่ย</div>
              <div className="flex items-baseline gap-1.5 justify-end">
                <span className="text-2xl font-black text-amber-300">{summary.satisfactionPercent}%</span>
                <span className="text-xs text-blue-100">({summary.averageRating}/5)</span>
              </div>
            </div>
            <div
              className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold border ${
                kpiPassed
                  ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                  : 'bg-amber-500/20 text-amber-200 border-amber-400/40'
              }`}
            >
              {summary.total > 0 ? (kpiPassed ? '✓ ผ่าน KPI ≥ 70%' : 'กำลังเก็บผล') : 'รอผลประเมิน'}
            </div>
          </div>
        </div>

        {/* Top Grid: Rating Summary + Review Form */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 border-b border-slate-100">
          {/* Left: Summary & Breakdown (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between space-y-5">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center min-w-[110px] shadow-sm">
                <div className="text-3xl font-black text-slate-900">{summary.averageRating.toFixed(1)}</div>
                <div className="flex items-center justify-center gap-0.5 my-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= Math.round(summary.averageRating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-[11px] font-semibold text-slate-500">{summary.total} รีวิว</div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="font-extrabold text-slate-900 text-sm">สรุปผลประเมินระบบ</div>
                <div className="text-slate-600">
                  อัตราความพึงพอใจรวม:{' '}
                  <strong className="text-emerald-700">{summary.satisfactionPercent}%</strong>
                </div>
                <div className="text-slate-600">
                  ความง่ายในการใช้งาน:{' '}
                  <strong className="text-blue-700">{summary.averageUsability.toFixed(1)} / 5.0</strong>
                </div>
                <div className="text-[11px] text-slate-400">
                  เกณฑ์ประเมินรายวิชา DIT204: ≥ 70%
                </div>
              </div>
            </div>

            {/* Star Distribution Bars */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = summary.breakdown?.[star] || 0;
                const percent = summary.total > 0 ? Math.round((count / summary.total) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-2.5 text-xs">
                    <span className="w-10 font-bold text-slate-700 flex items-center gap-1 shrink-0">
                      {star} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    </span>
                    <div className="flex-1 h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-16 text-right text-[11px] text-slate-500 font-semibold shrink-0">
                      {count} ({percent}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Submit Review Form (7 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquarePlus className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-extrabold text-slate-900">เขียนรีวิว / ข้อเสนอแนะของคุณ</h3>
            </div>

            {feedbackMsg.text && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  feedbackMsg.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-700'
                }`}
              >
                {feedbackMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                )}
                <span>{feedbackMsg.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Overall Star Rating */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                <label className="block text-xs font-bold text-amber-900 mb-1.5">
                  ความพึงพอใจโดยรวม *
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-0.5 transition-transform hover:scale-110 focus:outline-none"
                      aria-label={`ให้ ${star} ดาว`}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= activeStars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300 hover:text-amber-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-amber-800">
                    {RATING_LABELS[activeStars]}
                  </span>
                </div>
              </div>

              {/* Usability Score */}
              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/80">
                <label className="block text-xs font-bold text-blue-900 mb-1.5">
                  ความง่ายและความสะดวกในการใช้งาน
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setUsabilityScore(score)}
                      className={`w-8 h-8 rounded-lg text-xs font-extrabold transition-all border ${
                        usabilityScore === score
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-600 border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                  <span className="ml-1.5 text-[11px] font-semibold text-blue-800 flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5" /> {usabilityScore}/5
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อผู้ประเมิน (ใส่ชื่อเล่นหรือรหัสนักศึกษาได้)
                </label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="เช่น นายสิริเดช (6804130) หรือ ผู้ใช้งานทั่วไป"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  สถานะผู้ประเมิน
                </label>
                <select
                  value={reviewerRole}
                  onChange={(e) => setReviewerRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all"
                >
                  <option value="student">นักศึกษา</option>
                  <option value="staff">อาจารย์ / เจ้าหน้าที่</option>
                  <option value="guest">บุคคลทั่วไป</option>
                  {currentUser?.role === 'admin' && <option value="admin">ผู้ดูแลระบบ (Admin)</option>}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ความคิดเห็น / รีวิวการใช้งาน / ข้อเสนอแนะเพิ่มเติม *
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="บอกเล่าประสบการณ์การใช้งาน จุดที่ชอบ หรือสิ่งที่อยากให้ปรับปรุงเพิ่มเติม..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'กำลังบันทึก...' : 'ส่งรีวิวและข้อเสนอแนะ'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Bottom: Comments & Reviews List */}
        <div className="p-6 sm:p-8 bg-slate-50/60">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                ความคิดเห็นและรีวิวล่าสุดจากผู้ใช้งาน ({reviews.length} รายการ)
              </h3>
              <span className="text-[11px] text-slate-500">จัดเก็บจริงในฐานข้อมูล TiDB (ตาราง reviews)</span>
            </div>
            {reviews.length > 0 && (
              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm transition-colors"
                title="ดาวน์โหลดข้อมูลรีวิวทั้งหมดเป็นไฟล์ CSV สำหรับเปิดใน Excel เพื่อทำรายงาน"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV (Excel)</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200 p-4" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-300 text-xs text-slate-500">
              ยังไม่มีความคิดเห็น เป็นคนแรกที่มารีวิวระบบนี้เลย!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((rev) => {
                const roleMeta = ROLE_LABELS[rev.reviewerRole] || ROLE_LABELS.student;
                return (
                  <div
                    key={rev.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col justify-between gap-3 hover:border-blue-300 transition-colors"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-sky-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {rev.reviewerName}
                            </div>
                            <span
                              className={`inline-block mt-0.5 px-2 py-0.2 rounded text-[10px] font-bold border ${roleMeta.badge}`}
                            >
                              {roleMeta.label}
                            </span>
                          </div>
                        </div>

                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                            title="ลบรีวิวนี้ (Admin)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                          ใช้งานง่าย {rev.usabilityScore}/5
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>บันทึกเมื่อ {rev.createdAt}</span>
                      <span className="font-bold text-emerald-600">✓ ยืนยันแล้ว</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
