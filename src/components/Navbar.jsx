'use client';

import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Menu, X, ShieldCheck, GraduationCap, ChevronDown, LogOut, UserCheck } from 'lucide-react';
import { STUDENT_PROFILE } from '@/data/initialItems';

export default function Navbar({ onOpenReport, onScrollToSection, activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Dynamic user state loaded from localStorage (synced with /login)
  const [currentUser, setCurrentUser] = useState({
    name: STUDENT_PROFILE.name,
    studentId: STUDENT_PROFILE.studentId,
    role: 'student',
    roleName: 'นักศึกษา (Student)',
    badge: `รหัส ${STUDENT_PROFILE.studentId} • DIT RSU`,
    initials: 'สิ',
    faculty: STUDENT_PROFILE.faculty,
    major: STUDENT_PROFILE.major,
    color: 'from-sky-500 to-blue-700'
  });

  useEffect(() => {
    const loadUser = () => {
      try {
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('lost_found_user');
          if (saved) {
            const u = JSON.parse(saved);
            setCurrentUser(u);
          }
        }
      } catch (e) {
        console.warn('Could not read user from localStorage:', e);
      }
    };

    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lost_found_user');
      window.location.href = '/login';
    }
  };

  const getAvatarGradient = (role) => {
    if (role === 'admin') return 'bg-purple-700 bg-gradient-to-tr from-purple-600 to-indigo-800';
    if (role === 'staff') return 'bg-amber-600 bg-gradient-to-tr from-amber-500 to-orange-700';
    return 'bg-blue-600 bg-gradient-to-tr from-sky-500 to-blue-700';
  };

  const avatarGradient = getAvatarGradient(currentUser.role);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm w-full">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          
          {/* 1. Left Group: Logo + Navigation Links right next to it */}
          <div className="flex items-center gap-3 xl:gap-5 min-w-0">
            <button 
              onClick={() => { setActiveTab('all'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-2 sm:gap-2.5 group text-left focus:outline-none shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                    Lost & Found
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 rounded-md border border-blue-200">
                    IT DEPT
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap hidden md:inline-block">
                  วิทยาลัยนวัตกรรมดิจิทัลฯ ม.รังสิต
                </span>
              </div>
            </button>

            <div className="hidden xl:block h-6 w-px bg-slate-200 shrink-0" />

            {/* Menu Links attached directly after Logo */}
            <nav className="hidden xl:flex items-center gap-1 min-w-0">
              <button
                onClick={() => {
                  setActiveTab('all');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'text-blue-600 bg-blue-50 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => {
                  setActiveTab('browse');
                  onScrollToSection('items-feed');
                }}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'browse'
                    ? 'text-blue-600 bg-blue-50 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Browse
              </button>

              <button
                onClick={() => onScrollToSection('reviews-section')}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-amber-600 hover:bg-amber-50/70 transition-all whitespace-nowrap"
              >
                ⭐ รีวิว &amp; ประเมิน
              </button>

              {/* เมนูเฉพาะ Admin: สถิติ TiDB และ โครงงาน/Test Cases */}
              {currentUser.role === 'admin' && (
                <>
                  <a
                    href="/database"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 transition-all whitespace-nowrap shrink-0 border border-sky-200 ml-1"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                    <span>สถิติ &amp; ระบบ TiDB</span>
                  </a>
                  <a
                    href="/project"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-all whitespace-nowrap shrink-0 border border-indigo-200"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>โครงงาน &amp; Test</span>
                  </a>
                </>
              )}

              {/* ป้ายสิทธิ์เฉพาะของ Staff */}
              {currentUser.role === 'staff' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap shrink-0 ml-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>โหมดอาจารย์</span>
                </span>
              )}

              {/* ป้ายสิทธิ์เฉพาะของ Admin */}
              {currentUser.role === 'admin' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200 whitespace-nowrap shrink-0">
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping shrink-0"></span>
                  <span>Admin Console</span>
                </span>
              )}
            </nav>
          </div>

          {/* 2. Right Group: Action Button & User Profile Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* CTA Button (แสดงบนมือถือด้วย) */}
            <button
              onClick={onOpenReport}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>โพสต์ประกาศ</span>
            </button>

            {/* User Profile Badge (Dynamic Role) */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 shrink-0"
                title={`โปรไฟล์: ${currentUser.name}`}
              >
                <div className="relative shrink-0">
                  <div className={`w-8 h-8 rounded-full ${avatarGradient} text-white font-bold text-xs flex items-center justify-center shadow-inner`}>
                    {currentUser.initials || (currentUser.role === 'admin' ? 'AD' : currentUser.name?.slice(0, 2) || 'สิ')}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                <div className="text-left hidden md:block max-w-[130px] 2xl:max-w-[180px] min-w-0">
                  <div className="text-xs font-bold text-slate-800 leading-tight truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-slate-500 leading-tight mt-0.5 truncate">
                    {currentUser.badge || `รหัส ${currentUser.studentId} • DIT RSU`}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block shrink-0" />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 text-slate-800 animate-fadeIn"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className={`w-11 h-11 rounded-full ${avatarGradient} text-white font-bold text-sm flex items-center justify-center shadow shrink-0`}>
                      {currentUser.initials || (currentUser.role === 'admin' ? 'AD' : currentUser.name?.slice(0, 2) || 'สิ')}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{currentUser.name}</h4>
                      <p className="text-xs text-slate-500 truncate">
                        {currentUser.role === 'student' ? `รหัสนักศึกษา: ${currentUser.studentId}` : (currentUser.role === 'staff' ? 'อาจารย์ประจำสาขา DIT' : 'ระบบควบคุมส่วนกลาง')}
                      </p>
                      <span className={`inline-block px-2 py-0.5 mt-1 text-[10px] font-bold rounded-md border ${
                        currentUser.role === 'admin'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : (currentUser.role === 'staff' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200')
                      }`}>
                        {currentUser.roleName || (currentUser.role === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : (currentUser.role === 'staff' ? 'อาจารย์/เจ้าหน้าที่ (Staff)' : 'นักศึกษา (Student)'))}
                      </span>
                    </div>
                  </div>

                  <div className="py-2.5 space-y-2 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <GraduationCap className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-800">{currentUser.major || STUDENT_PROFILE.major}</span>
                        <div className="text-slate-500">{currentUser.faculty || STUDENT_PROFILE.faculty}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 pt-1.5 border-t border-slate-100">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-800">วิชา: {STUDENT_PROFILE.course}</span>
                        <div className="text-slate-500 text-[11px]">อาจารย์ที่ปรึกษา: {STUDENT_PROFILE.instructors}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={handleLogout}
                      className="font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 hover:underline text-[11px]"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>ออกจากระบบ</span>
                    </button>
                    <a
                      href="/login"
                      className="font-bold text-blue-600 hover:text-blue-800 hover:underline text-[11px]"
                    >
                      สลับบัญชี / Login
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile / Tablet menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile / Tablet Role Quick Bar (แสดงปุ่ม TiDB & ป้ายสิทธิ์ทันทีเมื่อจอเล็กกว่า xl) */}
      {(currentUser.role === 'admin' || currentUser.role === 'staff') && (
        <div className="xl:hidden border-t border-slate-100 bg-slate-50/90 px-3 sm:px-6 py-2">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2">
            {currentUser.role === 'admin' && (
              <>
                <a
                  href="/database"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 active:scale-95 transition-all whitespace-nowrap border border-sky-200 shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  <span>สถิติ &amp; ระบบ TiDB</span>
                </a>
                <a
                  href="/project"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 active:scale-95 transition-all whitespace-nowrap border border-indigo-200 shadow-sm"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>โครงงาน &amp; Test</span>
                </a>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping shrink-0"></span>
                  <span>ระบบ Admin Console</span>
                </span>
              </>
            )}

            {currentUser.role === 'staff' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>โหมดอาจารย์/เจ้าหน้าที่</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Mobile / Tablet Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1.5 shadow-lg">
          <button
            onClick={() => {
              setActiveTab('all');
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Home
          </button>
          <button
            onClick={() => {
              setActiveTab('browse');
              setMobileMenuOpen(false);
              onScrollToSection('items-feed');
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Browse Items
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollToSection('reviews-section');
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100"
          >
            ⭐ รีวิว &amp; ประเมินความพึงพอใจ
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenReport();
            }}
            className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-blue-700 bg-blue-50"
          >
            <PlusCircle className="w-4 h-4 text-blue-600" />
            <span>โพสต์ประกาศ / Report Found Item</span>
          </button>

          {currentUser.role === 'admin' && (
            <div className="pt-2 mt-2 border-t border-slate-100 space-y-2">
              <a
                href="/database"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>สถิติ &amp; ระบบ TiDB</span>
                </span>
                <span className="text-[11px] font-semibold text-sky-600">เปิดดู →</span>
              </a>
              <a
                href="/project"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200"
              >
                <span className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>ข้อมูลโครงงาน DIT204 &amp; Test Cases</span>
                </span>
                <span className="text-[11px] font-semibold text-indigo-600">เปิดดู →</span>
              </a>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping"></span>
                <span>ระบบ Admin Console</span>
              </div>
            </div>
          )}

          {currentUser.role === 'staff' && (
            <div className="pt-2 mt-2 border-t border-slate-100">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>โหมดอาจารย์/เจ้าหน้าที่</span>
              </span>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
