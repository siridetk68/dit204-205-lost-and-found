'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ReviewSection from '@/components/ReviewSection';
import { ArrowLeft, Star } from 'lucide-react';

export default function ReviewsPage() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('lost_found_user');
      if (raw) {
        setCurrentUser(JSON.parse(raw));
      }
    } catch (e) {}
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col overflow-x-clip">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 min-h-[4rem] flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span className="sm:hidden">กลับ</span>
              <span className="hidden sm:inline">กลับสู่หน้าหลัก</span>
            </Link>
            <div className="h-4 w-px bg-slate-300 shrink-0"></div>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-sm shrink-0">
                <Star className="w-4 h-4 fill-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight truncate">
                  แบบประเมินความพึงพอใจและรีวิวผู้ใช้งาน
                </h1>
                <span className="text-[10px] text-slate-500 font-medium hidden sm:inline-block">
                  University Lost &amp; Found • DIT204 User Satisfaction Feedback
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors whitespace-nowrap shrink-0"
          >
            ไปหน้าแจ้งของหาย
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ReviewSection currentUser={currentUser} standalone />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-700">
            ระบบประเมินความพึงพอใจ Lost &amp; Found • วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี มหาวิทยาลัยรังสิต (DIT204)
          </p>
        </div>
      </footer>
    </div>
  );
}
