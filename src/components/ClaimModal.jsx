'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, HelpCircle, MapPin } from 'lucide-react';
import { STUDENT_PROFILE } from '@/data/initialItems';

export default function ClaimModal({ item, isOpen, onClose, onItemUpdated, onClaimSubmitted }) {
  const [claimantName, setClaimantName] = useState(STUDENT_PROFILE.name);
  const [claimantId, setClaimantId] = useState(STUDENT_PROFILE.studentId);
  const [claimantContact, setClaimantContact] = useState('089-xxx-4130');
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (isOpen) {
      setStatusMessage({ type: '', text: '' });
      setAnswer('');
      try {
        const saved = localStorage.getItem('lost_found_user');
        if (saved) {
          const u = JSON.parse(saved);
          if (u.name) setClaimantName(u.name);
          if (u.studentId || u.student_id) setClaimantId(u.studentId || u.student_id);
          if (u.phone) setClaimantContact(u.phone);
        }
      } catch (e) {}
    }
  }, [isOpen, item?.id]);

  if (!isOpen || !item) return null;

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });

    if (!answer.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'กรุณากรอกข้อมูลยืนยันหรือคำตอบเพื่อพิสูจน์ความเป็นเจ้าของ',
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.id,
          claimantName: claimantName.trim() || STUDENT_PROFILE.name,
          claimantId: claimantId.trim() || STUDENT_PROFILE.studentId,
          claimantContact: claimantContact.trim() || '-',
          proofAnswer: answer.trim(),
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || 'เกิดข้อผิดพลาดในการส่งคำขอรับคืน');
      }

      setStatusMessage({
        type: 'success',
        text: 'ส่งคำขอรับคืนสำเร็จ! คำตอบของคุณถูกส่งไปยังอาจารย์/เจ้าหน้าที่เพื่อตรวจสอบและอนุมัติการส่งมอบ (REQ 03)',
      });

      setTimeout(() => {
        if (result.data?.item && onItemUpdated) {
          onItemUpdated(result.data.item);
        }
        if (result.data?.claim && onClaimSubmitted) {
          onClaimSubmitted(result.data.claim);
        }
        onClose();
      }, 1200);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-900 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">ยืนยันความเป็นเจ้าของ (Claim Item)</h3>
              <p className="text-xs text-blue-200">
                โมดูลตรวจสอบหลักฐานและบันทึกการส่งคืน (REQ 03 / T03)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleClaimSubmit} className="p-6 overflow-y-auto space-y-4">
          
          {/* Target Item Summary */}
          <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <img
              src={item.image}
              alt={item.title}
              className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                {item.category}
              </span>
              <h4 className="text-sm font-bold text-slate-900 truncate mt-1">{item.title}</h4>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span className="truncate">{item.location}</span>
              </div>
            </div>
          </div>

          {statusMessage.text && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Verification Question Prompt */}
          <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>คำถามยืนยันกรรมสิทธิ์ (Secret Verification):</span>
            </div>
            <p className="text-xs font-medium text-amber-800 bg-white/80 p-2.5 rounded-xl border border-amber-200">
              {item.secretQuestion || 'ระบุจุดสังเกตเฉพาะ หรือตำหนิของสิ่งของที่ผู้อื่นไม่ทราบ'}
            </p>
            <p className="text-[11px] text-amber-700 leading-tight">
              * ข้อมูลนี้ใช้พิสูจน์ว่าคุณคือเจ้าของตัวจริง ป้องกันการสวมรอยตามเอกสารรายงานโครงการ DIT204
            </p>
          </div>

          {/* Claimant Answer */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              คำตอบ / รายละเอียดเฉพาะเพื่อพิสูจน์ความเป็นเจ้าของ *
            </label>
            <textarea
              rows={2}
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="เช่น สีเคส รหัสผ่าน รอยตำหนิ รูปภาพบนหน้าจอ หรือสติกเกอร์ลับ..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
            ></textarea>
            <p className="text-[11px] text-slate-400 mt-1">
              คำตอบนี้จะถูกส่งไปให้อาจารย์/เจ้าหน้าที่เทียบกับข้อมูลลับในระบบก่อนอนุมัติส่งมอบ
            </p>
          </div>

          {/* Student Info Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ชื่อผู้ขอรับคืน (Claimant Name)
              </label>
              <input
                type="text"
                value={claimantName}
                onChange={(e) => setClaimantName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                รหัสนักศึกษา / บุคลากร
              </label>
              <input
                type="text"
                value={claimantId}
                onChange={(e) => setClaimantId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              เบอร์โทรศัพท์สำหรับนัดรับของ
            </label>
            <input
              type="text"
              value={claimantContact}
              onChange={(e) => setClaimantContact(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              ปิดหน้าต่าง
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{submitting ? 'กำลังส่งข้อมูล...' : 'ส่งหลักฐานยืนยัน & ขอรับของ'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

