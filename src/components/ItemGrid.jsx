'use client';

import React from 'react';
import ItemCard from './ItemCard';
import { SearchX, Sparkles, PlusCircle } from 'lucide-react';

export default function ItemGrid({ items, loading, onViewDetails, onClaimItem, onOpenReport, currentUser, onTogglePin, onOpenStaffReview, onDeleteItem }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl h-80 border border-slate-200 p-4">
            <div className="bg-slate-200 h-44 rounded-xl mb-4"></div>
            <div className="bg-slate-200 h-5 w-3/4 rounded mb-2"></div>
            <div className="bg-slate-200 h-4 w-1/2 rounded mb-4"></div>
            <div className="bg-slate-200 h-8 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
          ไม่พบรายการสิ่งของที่ตรงกับเงื่อนไขการค้นหา
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองสถานที่และหมวดหมู่ หรือหากคุณเป็นผู้พบของ สามารถสร้างประกาศใหม่ได้ทันที
        </p>
        <button
          onClick={onOpenReport}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>แจ้งของหาย / โพสต์พบของ</span>
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            รายการสิ่งของล่าสุด (Latest Items Feed)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            แสดงรายการของหายและพบของภายในมหาวิทยาลัย ({items.length} รายการ)
          </p>
        </div>
        
        <button
          onClick={onOpenReport}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>เพิ่มประกาศใหม่</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {[...items]
          .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
          .map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onViewDetails={onViewDetails}
              onClaimItem={onClaimItem}
              currentUser={currentUser}
              onTogglePin={onTogglePin}
              onOpenStaffReview={onOpenStaffReview}
              onDeleteItem={onDeleteItem}
            />
          ))}
      </div>
    </div>
  );
}

