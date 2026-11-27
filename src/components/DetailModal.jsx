'use client';

import React from 'react';
import { X, MapPin, Clock, Phone, ShieldCheck, CheckSquare } from 'lucide-react';

export default function DetailModal({
  item,
  isOpen,
  onClose,
  onClaimItem,
  currentUser,
  itemClaimsCount = 0,
  itemPendingClaimsCount = 0,
  onOpenItemClaims,
}) {
  if (!isOpen || !item) return null;

  const isLost = item.type === 'LOST';
  const isReturned = item.status === 'RETURNED';
  const isStaffOrAdmin = currentUser?.role === 'staff' || currentUser?.role === 'admin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header bar with close button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          {/* Main Hero Image */}
          <div className="relative h-64 sm:h-72 w-full bg-slate-900">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>
            
            {/* Badges on hero */}
            <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    isLost ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                  }`}
                >
                  {isLost ? 'ของหาย (Lost)' : 'พบสิ่งของ (Found)'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-800 backdrop-blur-md">
                  {item.category}
                </span>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isReturned
                    ? 'bg-sky-500 text-white'
                    : item.status === 'FOUND_ITEM'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-500 text-white'
                }`}
              >
                {isReturned
                  ? '✓ ส่งคืนแล้ว (Returned)'
                  : item.status === 'FOUND_ITEM'
                  ? '● พบของแล้ว'
                  : '● กำลังตามหาเจ้าของ'}
              </span>
            </div>
          </div>

          {/* Details body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Title & basic info */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {item.title}
              </h2>
              {item.englishTitle && (
                <p className="text-sm font-medium text-slate-400 mt-1">
                  {item.englishTitle}
                </p>
              )}
            </div>

            {/* Location & Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">สถานที่</span>
                  <span className="text-sm font-bold text-slate-800">{item.location}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">วันและเวลาที่บันทึก</span>
                  <span className="text-sm font-bold text-slate-800">
                    {item.date} • {item.time || 'ไม่ระบุเวลา'}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                รายละเอียดและข้อมูลเพิ่มเติม
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                {item.description}
              </p>
            </div>

            {/* Ownership verification note */}
            {item.secretQuestion && (
              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-1">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>เงื่อนไขการตรวจสอบความเป็นเจ้าของ (Verification Policy)</span>
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  ผู้ขอรับคืนต้องตอบคำถามยืนยัน: <span className="font-semibold text-blue-900">&quot;{item.secretQuestion}&quot;</span> เพื่อป้องกันการสวมรอย
                </p>
              </div>
            )}

            {/* Reporter Contact */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow">
                  {item.contactName ? item.contactName.slice(0, 2) : 'ผู้'}
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">ผู้แจ้งข้อมูล / ผู้ดูแลสิ่งของ</span>
                  <span className="text-sm font-bold text-slate-800">{item.contactName || 'นักศึกษา DIT'}</span>
                </div>
              </div>

              {item.contactTel && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>{item.contactTel}</span>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5 border-t border-slate-100">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                ปิด
              </button>

              {isStaffOrAdmin && onOpenItemClaims && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenItemClaims(item);
                  }}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-all flex items-center gap-2"
                  title="ดูและตรวจสอบคำร้องขอรับคืนเฉพาะสิ่งของชิ้นนี้"
                >
                  <CheckSquare className="w-4 h-4 text-amber-700" />
                  <span>
                    ตรวจสอบสิทธิ์ ({itemClaimsCount} คำร้อง{itemPendingClaimsCount > 0 ? ` • รอตรวจ ${itemPendingClaimsCount}` : ''})
                  </span>
                </button>
              )}

              <button
                onClick={() => {
                  onClose();
                  onClaimItem(item);
                }}
                disabled={isReturned}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-2 ${
                  isReturned
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isReturned ? 'ส่งมอบสิ่งของเรียบร้อยแล้ว' : 'ยืนยันความเป็นเจ้าของ (Claim Item)'}</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

