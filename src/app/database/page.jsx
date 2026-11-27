'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Database,
  Server,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  Shield,
  FileCode2,
  PackageSearch,
  PackageCheck,
  Sparkles,
  BarChart3,
  Layers,
  MapPin,
  Lock,
  Users,
  ClipboardCheck,
  Search,
  Filter,
  X,
} from 'lucide-react';

export default function DatabasePage() {
  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSqlSchema, setShowSqlSchema] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Search & Category filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('lost_found_user');
      if (raw) {
        setCurrentUser(JSON.parse(raw));
      } else {
        setCurrentUser({ role: 'student', name: 'นายสิริเดช เกตานนท์', badge: 'รหัส 6804130 • DIT RSU' });
      }
    } catch (e) {}
  }, []);

  const fetchDatabase = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/database');
      const json = await res.json();
      if (json.success) {
        setDbData(json.data);
      }
    } catch (e) {
      console.error('Failed to load database:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabase();
  }, []);

  // คำนวณสถิติจากข้อมูลจริงใน TiDB (รองรับการค้นหาและกรองตามหมวดหมู่)
  const analytics = useMemo(() => {
    const tables = dbData?.tables || {};
    const allItems = tables.items?.rows || [];
    const users = tables.users?.rows || [];
    const categories = tables.categories?.rows || [];
    const locations = tables.locations?.rows || [];
    const claims = tables.claims?.rows || [];

    // กรองรายการตาม Search, Category และ Type
    const items = allItems.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (item.title || '').toLowerCase().includes(q);
        const matchLocation = (item.location || '').toLowerCase().includes(q);
        const matchCat = (item.category_id || item.category || '').toLowerCase().includes(q);
        const matchDesc = (item.description || '').toLowerCase().includes(q);
        if (!matchTitle && !matchLocation && !matchCat && !matchDesc) return false;
      }
      if (selectedCategory !== 'all' && (item.category_id || item.category) !== selectedCategory) {
        return false;
      }
      if (selectedType !== 'all' && item.type !== selectedType) {
        return false;
      }
      return true;
    });

    const totalItems = items.length;
    const lostItems = items.filter((i) => i.type === 'LOST');
    const foundItems = items.filter((i) => i.type === 'FOUND');

    const lookingCount = items.filter((i) => i.status === 'LOOKING_FOR_OWNER').length;
    const foundWaitingCount = items.filter((i) => i.status === 'FOUND_ITEM').length;
    const returnedCount = items.filter((i) => i.status === 'RETURNED').length;

    const pct = (count, total) => (total > 0 ? ((count / total) * 100).toFixed(1) : '0.0');

    const lostPct = pct(lostItems.length, totalItems);
    const foundPct = pct(foundItems.length, totalItems);
    const lookingPct = pct(lookingCount, totalItems);
    const foundWaitingPct = pct(foundWaitingCount, totalItems);
    const returnedPct = pct(returnedCount, totalItems);

    // สถิติแยกตามหมวดหมู่
    const categoryMap = {};
    items.forEach((item) => {
      const cat = item.category_id || item.category || 'อื่นๆ';
      if (!categoryMap[cat]) {
        categoryMap[cat] = { name: cat, total: 0, lost: 0, found: 0 };
      }
      categoryMap[cat].total += 1;
      if (item.type === 'LOST') categoryMap[cat].lost += 1;
      else categoryMap[cat].found += 1;
    });
    const categoryStats = Object.values(categoryMap).sort((a, b) => b.total - a.total);

    // สถิติแยกตามสถานที่
    const locationMap = {};
    items.forEach((item) => {
      const loc = item.location || 'ไม่ระบุสถานที่';
      locationMap[loc] = (locationMap[loc] || 0) + 1;
    });
    const locationStats = Object.entries(locationMap)
      .map(([name, count]) => ({ name, count, percent: pct(count, totalItems) }))
      .sort((a, b) => b.count - a.count);

    // สรุปบทบาทผู้ใช้ (แบบปกปิดข้อมูลส่วนบุคคล)
    const roleCounts = {
      student: users.filter((u) => u.role === 'student').length,
      staff: users.filter((u) => u.role === 'staff').length,
      admin: users.filter((u) => u.role === 'admin').length,
    };

    // สรุปคำขอรับคืน
    const approvedClaims = claims.filter((c) => c.status === 'APPROVED').length;
    const pendingClaims = claims.filter((c) => c.status === 'PENDING').length;

    return {
      allItemsCount: allItems.length,
      categoriesList: categories,
      totalItems,
      lostCount: lostItems.length,
      foundCount: foundItems.length,
      lostPct,
      foundPct,
      lookingCount,
      foundWaitingCount,
      returnedCount,
      lookingPct,
      foundWaitingPct,
      returnedPct,
      categoryStats,
      locationStats,
      roleCounts,
      totalUsers: users.length,
      totalCategories: categories.length,
      totalLocations: locations.length,
      totalClaims: claims.length,
      approvedClaims,
      pendingClaims,
      recentItemsSummary: items,
    };
  }, [dbData, searchQuery, selectedCategory, selectedType]);

  const hasActiveFilter = searchQuery.trim() !== '' || selectedCategory !== 'all' || selectedType !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
  };

  // Role Guard: จำกัดการเข้าถึงเฉพาะ Admin เท่านั้น
  if (currentUser && currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-rose-100 text-center space-y-5 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-700 uppercase tracking-wider">
              Access Restricted (RBAC)
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-2">
              จำกัดการเข้าถึงเฉพาะ Admin เท่านั้น
            </h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              หน้าต่างรายงานสถิติและภาพรวมระบบฐานข้อมูล TiDB Cloud อนุญาตให้เข้าถึงได้เฉพาะบทบาท <strong>ผู้ดูแลระบบ (Admin)</strong> เท่านั้น ตามข้อกำหนดการรักษาความปลอดภัยของระบบ
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left text-xs text-slate-600">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">บัญชีปัจจุบันที่กำลังใช้งาน</span>
            <div className="font-bold text-slate-800">{currentUser.name}</div>
            <div className="text-[11px] text-blue-600 font-semibold">
              {currentUser.badge || (currentUser.role === 'staff' ? 'อาจารย์/เจ้าหน้าที่' : 'รหัสนักศึกษา 6804130 • นักศึกษา')}
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/login"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-700 to-sky-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              สลับเข้าสู่ระบบเป็น Admin เพื่อเข้าถึงแดชบอร์ด
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              กลับสู่หน้าหลัก
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-700 to-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight truncate">
                  Admin Analytics &amp; TiDB Dashboard
                </h1>
                <span className="text-[10px] text-slate-500 font-medium hidden sm:inline-block">
                  สรุปสถิติของหาย-ของที่เจอ และภาพรวมข้อมูลระบบ (Privacy-Safe View)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowSqlSchema(!showSqlSchema)}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors whitespace-nowrap"
            >
              <FileCode2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{showSqlSchema ? 'ปิดโครงสร้าง DB' : 'โครงสร้าง DB'}</span>
            </button>
            <button
              onClick={fetchDatabase}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors whitespace-nowrap"
            >
              <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${loading ? 'animate-spin' : ''}`} />
              <span>รีเฟรช</span>
            </button>
            <Link
              href="/login"
              title="โปรไฟล์ Admin / สลับบัญชี"
              className="inline-flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 transition-colors shrink-0"
            >
              <div className="w-7 h-7 rounded-full bg-purple-700 bg-gradient-to-tr from-purple-600 to-indigo-800 text-white font-bold text-[11px] flex items-center justify-center shadow-inner shrink-0">
                {currentUser?.initials || 'แอด'}
              </div>
              <span className="hidden md:inline text-xs font-bold text-purple-900 whitespace-nowrap">
                {currentUser?.studentId || 'admindit'}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TiDB Connection Status Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-blue-900/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-3 bg-blue-500/20 border border-blue-400/30 rounded-xl text-sky-400 shrink-0">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                    TiDB Cloud Analytics
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{dbData?.status?.engine || 'TiDB Cloud (Serverless)'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/20 text-purple-200 border border-purple-400/30">
                    <Lock className="w-3 h-3" />
                    <span>ซ่อนข้อมูลดิบส่วนบุคคล (PDPA Safe)</span>
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white mt-1">
                  แดชบอร์ดวิเคราะห์สถิติสิ่งของสูญหายและสถานะฐานข้อมูล TiDB
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 mt-1">
                  <span>Host: <strong className="text-sky-200">{dbData?.status?.host || 'TiDB Serverless Cloud'}</strong></span>
                  <span>Database: <strong className="text-sky-200">{dbData?.status?.database || 'lost_and_found'}</strong></span>
                  <span>Protocol: <strong className="text-emerald-300">SSL Encrypted</strong></span>
                </div>
              </div>
            </div>

            <div className="text-left md:text-right self-start md:self-auto">
              <span className="text-[11px] text-slate-400 block">สถานะการเชื่อมต่อ</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{dbData?.status?.message || 'เชื่อมต่อฐานข้อมูล TiDB สำเร็จ 🟢'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* SQL Schema Preview (Optional Toggle) */}
        {showSqlSchema && (
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 border border-slate-700 shadow-lg animate-fadeIn text-xs font-mono">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-700">
              <span className="text-sky-400 font-bold">schema.sql (โครงสร้างความสัมพันธ์ 5 ตารางใน TiDB)</span>
              <span className="text-[10px] text-slate-400">MySQL 8.0 / TiDB Compatible</span>
            </div>
            <pre className="overflow-x-auto max-h-56 p-2 bg-slate-950 rounded-lg text-slate-300">
{`-- สรุปความสัมพันธ์ฐานข้อมูล (ไม่เปิดเผยข้อมูลจริงในหน้านี้)
1. users       (id, student_id, name, role, faculty, major)
2. categories  (id, name_th, name_en, icon)
3. locations   (id, name, building, floor, room)
4. items       (id, title, type ['LOST'|'FOUND'], status, category_id -> categories.id)
5. claims      (id, item_id -> items.id, status ['PENDING'|'APPROVED'|'REJECTED'])`}
            </pre>
          </div>
        )}

        {/* Search & Category Filter Bar */}
        <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-soft">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อสิ่งของ, สถานที่, หรือรายละเอียด..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200"
                  title="ล้างคำค้นหา"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Selector */}
            <div className="md:col-span-4 relative">
              <Filter className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer transition-all"
              >
                <option value="all">ทุกหมวดหมู่ (All Categories)</option>
                {analytics.categoriesList.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_th ? `${cat.name_th} (${cat.id})` : cat.id}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter + Reset */}
            <div className="md:col-span-3 flex items-center gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer transition-all"
              >
                <option value="all">ทุกประเภท</option>
                <option value="LOST">เฉพาะของหาย (LOST)</option>
                <option value="FOUND">เฉพาะของที่เจอ (FOUND)</option>
              </select>

              {hasActiveFilter && (
                <button
                  onClick={handleResetFilters}
                  className="px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shrink-0"
                  title="ล้างตัวกรองทั้งหมด"
                >
                  รีเซ็ต
                </button>
              )}
            </div>
          </div>

          {hasActiveFilter && (
            <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>
                กำลังแสดงผลที่ตรงกับตัวกรอง: <strong className="text-blue-700">{analytics.totalItems}</strong> จากทั้งหมด {analytics.allItemsCount} รายการ
              </span>
              <span className="text-[11px] text-slate-400">
                สถิติและเปอร์เซ็นต์ด้านล่างคำนวณตามผลลัพธ์ที่กรอง
              </span>
            </div>
          )}
        </section>

        {/* Section 1: KPI Cards — ของที่หาย vs ของที่เจอ (จำนวนชิ้น + %) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>สถิติสิ่งของในระบบ (จำนวนชิ้น และสัดส่วนเปอร์เซ็นต์)</span>
            </h2>
            <span className="text-xs text-slate-500">
              อัปเดตจากฐานข้อมูลจริง ({analytics.totalItems} รายการ)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Items */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">รายการสิ่งของทั้งหมด</span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">
                  {loading ? '...' : analytics.totalItems}
                </span>
                <span className="text-xs font-bold text-slate-500">ชิ้น</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                คิดเป็น <strong className="text-blue-700">100%</strong> ของรายการทั้งหมดใน TiDB
              </div>
            </div>

            {/* Lost Items */}
            <div className="bg-white rounded-2xl p-5 border border-rose-200/80 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700">ของที่หาย (LOST)</span>
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <PackageSearch className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-rose-600">
                    {loading ? '...' : analytics.lostCount}
                  </span>
                  <span className="text-xs font-bold text-slate-500">ชิ้น</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-700">
                  {analytics.lostPct}%
                </span>
              </div>
              <div className="mt-3 w-full bg-rose-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analytics.lostPct}%` }}
                />
              </div>
            </div>

            {/* Found Items */}
            <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700">ของที่เจอ (FOUND)</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <PackageCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-emerald-600">
                    {loading ? '...' : analytics.foundCount}
                  </span>
                  <span className="text-xs font-bold text-slate-500">ชิ้น</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-700">
                  {analytics.foundPct}%
                </span>
              </div>
              <div className="mt-3 w-full bg-emerald-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analytics.foundPct}%` }}
                />
              </div>
            </div>

            {/* Returned Items */}
            <div className="bg-white rounded-2xl p-5 border border-sky-200/80 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-700">ส่งคืนสำเร็จแล้ว (RETURNED)</span>
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-sky-600">
                    {loading ? '...' : analytics.returnedCount}
                  </span>
                  <span className="text-xs font-bold text-slate-500">ชิ้น</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-sky-100 text-sky-700">
                  {analytics.returnedPct}%
                </span>
              </div>
              <div className="mt-3 w-full bg-sky-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-sky-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analytics.returnedPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stacked Comparison Bar: สัดส่วนเปรียบเทียบ LOST vs FOUND และสถานะการส่งคืน */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>สัดส่วนประเภทประกาศ: ของที่หาย vs ของที่เจอ</span>
                <span className="text-slate-500">{analytics.totalItems} ชิ้น</span>
              </div>
              <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden flex">
                <div
                  className="bg-rose-500 h-full transition-all duration-500"
                  style={{ width: `${analytics.lostPct}%` }}
                  title={`ของที่หาย ${analytics.lostCount} ชิ้น (${analytics.lostPct}%)`}
                />
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${analytics.foundPct}%` }}
                  title={`ของที่เจอ ${analytics.foundCount} ชิ้น (${analytics.foundPct}%)`}
                />
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs">
                <span className="inline-flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  ของที่หาย (LOST): <strong>{analytics.lostCount} ชิ้น ({analytics.lostPct}%)</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  ของที่เจอ (FOUND): <strong>{analytics.foundCount} ชิ้น ({analytics.foundPct}%)</strong>
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>สัดส่วนสถานะการติดตามและส่งมอบ</span>
                <span className="text-slate-500">100%</span>
              </div>
              <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden flex">
                <div
                  className="bg-amber-500 h-full transition-all duration-500"
                  style={{ width: `${analytics.lookingPct}%` }}
                />
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${analytics.foundWaitingPct}%` }}
                />
                <div
                  className="bg-sky-500 h-full transition-all duration-500"
                  style={{ width: `${analytics.returnedPct}%` }}
                />
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs">
                <span className="inline-flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  ตามหาเจ้าของ: <strong>{analytics.lookingCount} ({analytics.lookingPct}%)</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  รอเจ้าของรับคืน: <strong>{analytics.foundWaitingCount} ({analytics.foundWaitingPct}%)</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                  ส่งคืนแล้ว: <strong>{analytics.returnedCount} ({analytics.returnedPct}%)</strong>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Breakdown by Category & Top Locations */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">สถิติแยกตามหมวดหมู่สิ่งของ</h3>
                <p className="text-[11px] text-slate-500">แสดงจำนวนชิ้นและเปอร์เซ็นต์ของแต่ละหมวดหมู่</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-bold">
                {analytics.totalCategories} หมวดหมู่
              </span>
            </div>

            <div className="space-y-3">
              {analytics.categoryStats.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">กำลังโหลดข้อมูลสถิติ...</p>
              ) : (
                analytics.categoryStats.map((cat) => {
                  const percent = analytics.totalItems > 0 ? ((cat.total / analytics.totalItems) * 100).toFixed(1) : '0.0';
                  return (
                    <div key={cat.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{cat.name}</span>
                        <span className="text-slate-600">
                          <strong>{cat.total} ชิ้น</strong> ({percent}%) •{' '}
                          <span className="text-rose-600">หาย {cat.lost}</span> /{' '}
                          <span className="text-emerald-600">เจอ {cat.found}</span>
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-sky-500 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Location Breakdown */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>สถิติแยกตามสถานที่เกิดเหตุ</span>
                </h3>
                <p className="text-[11px] text-slate-500">สรุปจุดที่มีการแจ้งของหาย/พบของมากที่สุด</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-bold">
                {analytics.totalLocations} จุดในระบบ
              </span>
            </div>

            <div className="space-y-2.5">
              {analytics.locationStats.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">กำลังโหลดข้อมูลสถานที่...</p>
              ) : (
                analytics.locationStats.map((loc) => (
                  <div key={loc.name} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="font-semibold text-slate-800 truncate pr-3">{loc.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-slate-900">{loc.count} ชิ้น</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-extrabold text-[10px]">
                        {loc.percent}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Section 3: Privacy-Safe Database Summary (แทนการโชว์ตารางดิบโดยตรง) */}
        <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-600" />
                <span>สรุปข้อมูลระบบฐานข้อมูล TiDB (ไม่แสดงข้อมูลดิบส่วนบุคคล)</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                แสดงเฉพาะยอดรวมเชิงสถิติของทั้ง 5 ตาราง โดยปกปิดอีเมล เบอร์โทรศัพท์ และคำเฉลยยืนยันตัวตนเพื่อความปลอดภัย
              </p>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
              <Lock className="w-3 h-3" />
              <span>Data Masked &amp; Aggregated</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>1. บัญชีผู้ใช้ (users)</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{analytics.totalUsers} บัญชี</div>
              <div className="text-[11px] text-slate-500 mt-1">
                นศ. {analytics.roleCounts.student} • Staff {analytics.roleCounts.staff} • Admin {analytics.roleCounts.admin}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>2. สิ่งของ (items)</span>
                <PackageSearch className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{analytics.totalItems} รายการ</div>
              <div className="text-[11px] text-slate-500 mt-1">
                หาย {analytics.lostCount} ({analytics.lostPct}%) • เจอ {analytics.foundCount} ({analytics.foundPct}%)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>3. หมวดหมู่ (categories)</span>
                <Layers className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{analytics.totalCategories} หมวด</div>
              <div className="text-[11px] text-slate-500 mt-1">
                Electronics, IDs, Books, Personal
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>4. สถานที่ (locations)</span>
                <MapPin className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{analytics.totalLocations} จุด</div>
              <div className="text-[11px] text-slate-500 mt-1">
                อาคารเรียน, Lab, หอสมุด, โรงอาหาร
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>5. คำขอรับคืน (claims)</span>
                <ClipboardCheck className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{analytics.totalClaims} คำขอ</div>
              <div className="text-[11px] text-slate-500 mt-1">
                อนุมัติแล้ว {analytics.approvedClaims} • รอตรวจ {analytics.pendingClaims}
              </div>
            </div>
          </div>

          {/* Masked Recent Activity Summary */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-700">
                รายการสิ่งของตามตัวกรอง ({analytics.recentItemsSummary.length} รายการ • ปกปิดข้อมูลผู้แจ้งและคำเฉลย)
              </h4>
            </div>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
              {analytics.recentItemsSummary.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-slate-400 bg-white">
                  ไม่พบรายการที่ตรงกับคำค้นหาหรือหมวดหมู่ที่เลือก
                </div>
              ) : (
                analytics.recentItemsSummary.map((item) => (
                  <div key={item.id} className="px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-white hover:bg-slate-50">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                          item.type === 'LOST' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {item.type === 'LOST' ? 'ของหาย' : 'พบของ'}
                      </span>
                      <span className="font-semibold text-slate-800 truncate">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-[11px] text-slate-500">
                      <span>{item.category_id}</span>
                      <span>•</span>
                      <span className="hidden md:inline truncate max-w-[180px]">{item.location}</span>
                      <span className="hidden md:inline">•</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          item.status === 'RETURNED'
                            ? 'bg-sky-100 text-sky-700'
                            : item.status === 'FOUND_ITEM'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {item.status === 'RETURNED' ? 'ส่งคืนแล้ว' : item.status === 'FOUND_ITEM' ? 'รอเจ้าของรับคืน' : 'กำลังตามหา'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Academic Citation Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-700">
            โครงงานระบบ Lost &amp; Found • ภาควิชานวัตกรรมดิจิทัลเทคโนโลยี มหาวิทยาลัยรังสิต (DIT204)
          </p>
          <p className="text-slate-400 mt-1">
            เชื่อมต่อฐานข้อมูล TiDB Cloud (Distributed SQL) โดย 6804130 นายสิริเดช เกตานนท์
          </p>
        </div>
      </footer>
    </div>
  );
}
