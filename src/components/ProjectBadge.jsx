'use client';

import React, { useState } from 'react';
import { STUDENT_PROFILE } from '@/data/initialItems';
import { BookOpen, GraduationCap, Award, CheckCircle2, ChevronDown, ChevronUp, FileText, Code2, Server } from 'lucide-react';

export default function ProjectBadge() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div id="project-info" className="mt-16 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-blue-900/50">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-sky-400 shrink-0 shadow-inner">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-blue-500/20 text-sky-300 rounded-md border border-blue-400/30">
                {STUDENT_PROFILE.course.split(' ')[0]}
              </span>
              <span className="text-xs text-slate-300">
                {STUDENT_PROFILE.faculty} • {STUDENT_PROFILE.university}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white mt-1">
              โครงงานระบบบอร์ดแจ้งของหายและตามหาเจ้าของ (University Lost & Found Website)
            </h3>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-sky-200 border border-white/10 transition-colors self-start md:self-auto"
        >
          <BookOpen className="w-4 h-4" />
          <span>{isExpanded ? 'ย่อรายละเอียดโครงงาน' : 'ดูรายละเอียดแผนงานบริหารโครงการ'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
        </button>
      </div>

      {/* Primary Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <span className="text-xs text-slate-400 block mb-1">ผู้จัดทำโครงงาน (Project Owner)</span>
          <div className="font-bold text-white text-base">{STUDENT_PROFILE.name}</div>
          <div className="text-xs text-sky-300 mt-0.5">รหัสนักศึกษา: {STUDENT_PROFILE.studentId}</div>
          <div className="text-xs text-slate-400 mt-0.5">{STUDENT_PROFILE.major}</div>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <span className="text-xs text-slate-400 block mb-1">อาจารย์ผู้ควบคุมและประเมินผล</span>
          <div className="font-bold text-white text-base">อ.นิษฐเนตร์ ณัฏฐกุลนันท์</div>
          <div className="font-semibold text-slate-300 text-xs mt-0.5">ผศ.ดร.กานต์ ยงศิริวิทย์</div>
          <div className="text-xs text-slate-400 mt-1">{STUDENT_PROFILE.semester}</div>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <span className="text-xs text-slate-400 block mb-1">สถาปัตยกรรม & เทคโนโลยี</span>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Next.js 14 (App Router) + React 18</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-sky-300 font-semibold mb-1">
            <Server className="w-4 h-4 text-sky-300" />
            <span>REST API Endpoints (/api/items, /api/stats)</span>
          </div>
          <div className="text-xs text-slate-400">Tailwind CSS (Responsive Modern UI)</div>
        </div>
      </div>

      {/* Expanded Project Charter & WBS Section */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-white/10 space-y-6 animate-fadeIn">
          
          {/* Target KPIs */}
          <div>
            <h4 className="text-sm font-bold text-sky-300 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>เกณฑ์เป้าหมายความสำเร็จ (Target KPIs & Acceptance Criteria)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-blue-900/30 p-3.5 rounded-xl border border-blue-500/30">
                <span className="text-xs text-slate-300 block">1. ฟังก์ชันหลักของระบบ</span>
                <span className="text-xl font-black text-emerald-400">≥ 85%</span>
                <p className="text-[11px] text-slate-400 mt-1">
                  ผ่านการทดสอบโพสต์ ค้นหา และปรับสถานะ (REQ 01)
                </p>
              </div>
              <div className="bg-blue-900/30 p-3.5 rounded-xl border border-blue-500/30">
                <span className="text-xs text-slate-300 block">2. ความแม่นยำในการค้นหา</span>
                <span className="text-xl font-black text-sky-400">≥ 80%</span>
                <p className="text-[11px] text-slate-400 mt-1">
                  กรองตามหมวดหมู่และอาคาร/สถานที่ได้อย่างถูกต้อง (REQ 02)
                </p>
              </div>
              <div className="bg-blue-900/30 p-3.5 rounded-xl border border-blue-500/30">
                <span className="text-xs text-slate-300 block">3. ความพึงพอใจผู้ใช้งาน</span>
                <span className="text-xl font-black text-amber-400">≥ 70%</span>
                <p className="text-[11px] text-slate-400 mt-1">
                  แบบประเมินผู้ใช้เพื่อนร่วมรุ่น DIT (≥ 3.5 จาก 5.0)
                </p>
              </div>
            </div>
          </div>

          {/* Traceability Table */}
          <div>
            <h4 className="text-sm font-bold text-sky-300 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>ตาราง Requirements Traceability Matrix (ตามรายงานบทที่ 4)</span>
            </h4>
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/10 text-slate-300 uppercase">
                  <tr>
                    <th className="p-3">Req ID</th>
                    <th className="p-3">Requirement</th>
                    <th className="p-3">WBS Package</th>
                    <th className="p-3">Test Case</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-slate-300">
                  <tr className="hover:bg-white/5">
                    <td className="p-3 font-bold text-sky-400">REQ 01</td>
                    <td className="p-3">ระบบโพสต์ประกาศแจ้งของหายและพบของ พร้อมระบบค้นหา</td>
                    <td className="p-3">1.2 System Development</td>
                    <td className="p-3">T01</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Approved</span></td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="p-3 font-bold text-sky-400">REQ 02</td>
                    <td className="p-3">หน้าจอ Responsive Design คัดกรองตามหมวดหมู่และสถานที่</td>
                    <td className="p-3">1.2 System Development</td>
                    <td className="p-3">T02</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Pass</span></td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="p-3 font-bold text-sky-400">REQ 03</td>
                    <td className="p-3">ระบบยืนยันความเป็นเจ้าของ (Ownership Verification) และบันทึกการส่งคืน</td>
                    <td className="p-3">1.2 System Development</td>
                    <td className="p-3">T03</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Pass</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

