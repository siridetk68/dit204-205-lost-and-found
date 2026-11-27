'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProjectBadge from '@/components/ProjectBadge';
import TestVerificationModal from '@/components/TestVerificationModal';
import { INITIAL_ITEMS } from '@/data/initialItems';
import { ArrowLeft, FlaskConical, GraduationCap, CheckCircle2 } from 'lucide-react';

export default function ProjectPage() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('/api/items');
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data) && json.data.length > 0) {
            setItems(json.data);
          }
        }
      } catch (e) {
        console.warn('Using fallback items for test cases:', e);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col overflow-x-clip">
      {/* Top Header */}
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight truncate">
                  ข้อมูลโครงงาน DIT204 &amp; ทดสอบระบบ
                </h1>
                <span className="text-[10px] text-slate-500 font-medium hidden sm:inline-block">
                  แผนบริหารโครงการ, Traceability Matrix และ Automated Test Cases (T01–T03)
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsTestModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all whitespace-nowrap shrink-0"
          >
            <FlaskConical className="w-4 h-4 shrink-0" />
            <span>รัน Test Cases (T01-T03)</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Automated Test Runner Card */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 border border-indigo-100 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                  เครื่องมือทดสอบระบบอัตโนมัติ (Test Cases T01–T03)
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Evidence E03</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                ตรวจสอบการทำงานจริงของระบบตามข้อกำหนด REQ 01 (โพสต์/แสดงรายการ), REQ 02 (ค้นหา/กรองข้อมูล), และ REQ 03 (ยืนยันความเป็นเจ้าของ) จากฐานข้อมูล ({items.length} รายการ)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTestModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 shadow-soft transition-all whitespace-nowrap shrink-0"
            title="ทดสอบระบบอัตโนมัติสำหรับภาคผนวก ข (Evidence E03)"
          >
            <FlaskConical className="w-4 h-4 text-indigo-600" />
            <span>รัน Test Cases (T01-T03)</span>
          </button>
        </section>

        {/* Academic Project Showcase */}
        <ProjectBadge compactMargin />
      </main>

      {/* Test Verification Modal */}
      <TestVerificationModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        items={items}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-700">
            โครงงานระบบ Lost &amp; Found • วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี มหาวิทยาลัยรังสิต (DIT204)
          </p>
          <p className="text-slate-400 mt-1">
            จัดทำโดย 6804130 นายสิริเดช เกตานนท์ • เสนอ อ.นิษฐเนตร์ ณัฏฐกุลนันท์ และ ผศ.ดร.กานต์ ยงศิริวิทย์
          </p>
        </div>
      </footer>
    </div>
  );
}
