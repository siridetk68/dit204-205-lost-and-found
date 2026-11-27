'use client';

import React from 'react';
import { MapPin, Clock, ShieldCheck, Eye, CheckCircle2, AlertCircle, Pin, Building2, CheckSquare, Trash2 } from 'lucide-react';

export default function ItemCard({ item, onViewDetails, onClaimItem, currentUser, onTogglePin, onOpenStaffReview, onDeleteItem }) {
  // Determine badge styling based on status & type
  const isLost = item.type === 'LOST';
  const isReturned = item.status === 'RETURNED';
  const isStaffOrAdmin = currentUser?.role === 'staff' || currentUser?.role === 'admin';

  let statusConfig = {
    label: 'Looking for owner (ตามหาเจ้าของ)',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    icon: AlertCircle,
  };

  if (item.status === 'FOUND_ITEM') {
    statusConfig = {
      label: 'Found item (พบของแล้ว)',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      icon: CheckCircle2,
    };
  } else if (isReturned) {
    statusConfig = {
      label: 'Returned (ส่งคืนแล้ว)',
      bg: 'bg-sky-50 text-sky-700 border-sky-200',
      dot: 'bg-sky-500',
      icon: ShieldCheck,
    };
  }

  return (
    <div
      onClick={() => onViewDetails && onViewDetails(item)}
      className={`group bg-white rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1 relative cursor-pointer ${
        item.isPinned
          ? 'border-amber-400 shadow-md ring-2 ring-amber-400/25'
          : 'border-slate-200/90 shadow-soft hover:shadow-card-hover'
      }`}
    >
      
      {/* 📌 Pinned Announcement Ribbon */}
      {item.isPinned && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-slate-900 text-[10px] font-black px-3 py-1 flex items-center justify-between tracking-wide">
          <div className="flex items-center gap-1.5 text-white">
            <Pin className="w-3 h-3 fill-white" />
            <span>ปักหมุดประกาศสำคัญ (Urgent Item)</span>
          </div>
          <span className="text-[9px] text-amber-100 font-semibold">Verified by Staff</span>
        </div>
      )}

      {/* 1. Image Placeholder / Preview Header */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={item.image || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {/* Item Category */}
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white/90 backdrop-blur-md text-slate-800 shadow-sm border border-white/40">
            {item.category}
          </span>

          {/* Type Badge: Lost vs Found */}
          <span
            className={`px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide rounded-lg shadow-sm backdrop-blur-md ${
              isLost
                ? 'bg-rose-600/90 text-white'
                : 'bg-emerald-600/90 text-white'
            }`}
          >
            {isLost ? 'ของหาย (LOST)' : 'เก็บได้ (FOUND)'}
          </span>
        </div>

        {/* Bottom Status Badge on Image */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-1.5">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${statusConfig.bg}`}
          >
            <span className={`w-2 h-2 rounded-full ${statusConfig.dot} animate-pulse`}></span>
            {statusConfig.label}
          </span>

          {item.claimStatus === 'pending' && !isReturned && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/95 text-white shadow-sm">
              ⏳ รอ Staff ตรวจคำขอ
            </span>
          )}
        </div>
      </div>

      {/* 2. Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Item Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>
          {item.englishTitle && (
            <p className="text-xs text-slate-400 font-medium mb-2 truncate">
              {item.englishTitle}
            </p>
          )}

          {/* Official Custody Tag (Feature 2) */}
          {(item.isUnderCustody || item.type === 'FOUND') && (
            <div className="flex items-start gap-1.5 text-[11px] text-amber-900 bg-amber-50/90 px-2.5 py-1.5 rounded-xl border border-amber-200 mb-2.5">
              <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span className="leading-tight">
                <strong>จุดรับคืน:</strong> {item.custodyLocation || 'ห้องธุรการสาขาวิชา DIT (อาคาร 1 ชั้น 1)'} • ฝากไว้ที่ห้องธุรการ
              </span>
            </div>
          )}

          {/* Description snippet */}
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-3 leading-relaxed">
            {item.description}
          </p>

          {/* Location & Date Tags */}
          <div className="space-y-1.5 text-xs text-slate-500 mb-3 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="font-medium truncate">{item.location}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                {item.date} • {item.time || 'ไม่ระบุเวลา'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Action Buttons */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="space-y-2 pt-2 border-t border-slate-100 cursor-default"
        >
          
          {/* Staff Exclusive Management Controls (Feature 2 + Delete) */}
          {isStaffOrAdmin && (
            <div className="flex items-center gap-1.5 pb-2 border-b border-dashed border-slate-200">
              <button
                onClick={() => onTogglePin && onTogglePin(item.id)}
                className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors ${
                  item.isPinned
                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-800'
                }`}
                title="ปักหมุดประกาศสำคัญไว้บนสุดของฟีด"
              >
                <Pin className="w-3 h-3" />
                <span>{item.isPinned ? 'ถอนหมุด' : 'ปักหมุดด่วน'}</span>
              </button>

              {item.type === 'FOUND' && onOpenStaffReview && (
                <button
                  onClick={() => onOpenStaffReview(item)}
                  className="flex-1 py-1 px-2 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center gap-1 transition-colors"
                  title="ตรวจสอบหลักฐานคำขอยืนยันสิทธิ์เฉพาะรายการนี้"
                >
                  <CheckSquare className="w-3 h-3" />
                  <span>ตรวจคำขอ</span>
                </button>
              )}

              {onDeleteItem && (
                <button
                  onClick={() => onDeleteItem(item)}
                  className="py-1 px-2 rounded-lg text-[11px] font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-colors"
                  title="ลบประกาศนี้"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Standard User CTAs */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onViewDetails(item)}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-all focus:outline-none"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Details</span>
            </button>

            <button
              onClick={() => onClaimItem(item)}
              disabled={isReturned}
              className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                isReturned
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 hover:shadow-md'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isReturned ? 'ส่งมอบแล้ว' : 'Claim Item'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

