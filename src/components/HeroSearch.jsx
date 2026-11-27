'use client';

import React from 'react';
import { Search, MapPin, Tag, X, Sparkles, Building, Layers, RotateCcw } from 'lucide-react';
import { CATEGORIES, LOCATIONS } from '@/data/initialItems';

export default function HeroSearch({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  filterType,
  setFilterType,
  stats,
  onResetFilters,
}) {
  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || selectedLocation !== 'all' || filterType !== 'all';

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 text-white pt-10 pb-14 md:pt-16 md:pb-20">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none translate-y-1/3"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title & Tagline */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-badge text-blue-200 text-xs md:text-sm font-medium mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-sky-300" />
            <span>ระบบศูนย์กลางแจ้งของหายและตามหาเจ้าของสำหรับนักศึกษา IT</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            ทำของหายหรือเก็บของได้ในมหาลัย? <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-200 to-white">
              ค้นหาและส่งคืนได้อย่างปลอดภัยที่นี่
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg font-normal max-w-2xl mx-auto">
            University Lost & Found Web Application แก้ปัญหาโพสต์ตกหล่นในกรุ๊ปแชท 
            พร้อมระบบคัดกรองและยืนยันความเป็นเจ้าของ (Ownership Verification)
          </p>
        </div>

        {/* 2. Hero Search Bar & Filter Dropdowns Box (Stretches 100% full width, perfectly filled) */}
        <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-md p-3.5 sm:p-5 rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 text-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 w-full">
            
            {/* 1. Search Input (Takes 6 of 12 columns = 50% width on desktop) */}
            <div className="md:col-span-6 relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for items, electronics, student cards..."
                className="w-full pl-11 pr-10 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 2. Category Filter Dropdown (Takes 3 of 12 columns = 25% width on desktop) */}
            <div className="md:col-span-3 relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Tag className="w-4 h-4 text-blue-600" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-9 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white appearance-none cursor-pointer transition-all shadow-inner truncate"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* 3. Location Filter Dropdown (Takes 3 of 12 columns = 25% width on desktop) */}
            <div className="md:col-span-3 relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full pl-10 pr-9 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white appearance-none cursor-pointer transition-all shadow-inner truncate"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

          </div>

          {/* Quick Filter Tabs & Reset (Clean bottom bar spanning edge-to-edge) */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
                <Layers className="w-3.5 h-3.5" />
                สถานะ:
              </span>
              
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  filterType === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ทั้งหมด (All)
              </button>

              <button
                onClick={() => setFilterType('LOST')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  filterType === 'LOST'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                🔴 ของหาย (Looking for owner)
              </button>

              <button
                onClick={() => setFilterType('FOUND')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  filterType === 'FOUND'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                🟢 พบของแล้ว (Found items)
              </button>

              <button
                onClick={() => setFilterType('RETURNED')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  filterType === 'RETURNED'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                }`}
              >
                ✅ ประวัติส่งคืนแล้ว ({stats?.returnedItems ?? 0})
              </button>
            </div>

            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>รีเซ็ตตัวกรองทั้งหมด</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Highlights Counters from Stats */}
        {stats && (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-2xl font-black text-white">{stats.total}</div>
              <div className="text-xs text-blue-200 font-medium">ประกาศทั้งหมด</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-2xl font-black text-amber-300">{stats.lookingForOwner}</div>
              <div className="text-xs text-blue-200 font-medium">กำลังตามหาเจ้าของ</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-2xl font-black text-emerald-300">{stats.foundItems}</div>
              <div className="text-xs text-blue-200 font-medium">มีผู้แจ้งพบของ</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-2xl font-black text-sky-300">{stats.returnedItems}</div>
              <div className="text-xs text-blue-200 font-medium">ส่งคืนสำเร็จแล้ว</div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
