const fs = require('fs');
const path = require('path');

const cssContent = fs.readFileSync(path.join(__dirname, 'public', 'style.css'), 'utf8');

const htmlContent = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RSU IT Lost & Found - ระบบบอร์ดแจ้งของหายและตามหาเจ้าของ</title>
  
  <!-- Embedded Offline-First Tailwind CSS (Works 100% without internet or CDN) -->
  <style>
${cssContent}

    /* Custom Polish & Font */
    @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap');
    body {
      font-family: 'Prompt', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
    }
    .glass-badge {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.25);
    }
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  </style>
</head>
<body class="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-blue-500 selection:text-white">

  <!-- 1. NAVIGATION BAR (Clean, perfectly proportioned, no awkward line-breaks) -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 md:h-18">
        
        <!-- Logo on the left: Lost & Found with minimalist search icon -->
        <a href="#" class="flex items-center gap-2.5 group text-left shrink-0">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-1.5 whitespace-nowrap">
              <span class="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                Lost & Found
              </span>
              <span class="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 rounded-md border border-blue-200">
                IT DEPT
              </span>
            </div>
            <span class="text-[11px] text-slate-500 font-medium whitespace-nowrap hidden sm:inline-block">
              วิทยาลัยนวัตกรรมดิจิทัลฯ ม.รังสิต
            </span>
          </div>
        </a>

        <!-- Menu links in the center (Single-line, elegant spacing) -->
        <nav class="hidden lg:flex items-center gap-1 xl:gap-2">
          <a href="#" class="px-3.5 py-2 rounded-lg text-sm font-bold text-blue-600 bg-blue-50 whitespace-nowrap">
            Home
          </a>
          <a href="#items-feed" class="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all whitespace-nowrap">
            Browse Items
          </a>
          <button onclick="openReportModal()" class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all whitespace-nowrap">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v8m-4-4h8"></path></svg>
            <span>Report Found Item</span>
          </button>
          <a href="#project-info" class="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all whitespace-nowrap">
            ข้อมูลวิชา DIT204
          </a>
          <!-- TiDB Database Link (Hidden for Student, Visible for Staff & Admin) -->
          <a id="nav-tidb-link" href="database.html" class="hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 transition-all whitespace-nowrap border border-sky-200">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ฐานข้อมูล TiDB</span>
          </a>

          <!-- Staff Role Badge -->
          <span id="nav-staff-badge" class="hidden inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <svg class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            <span>โหมดอาจารย์/เจ้าหน้าที่</span>
          </span>

          <!-- Admin Role Badge -->
          <span id="nav-admin-badge" class="hidden inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
            <span class="w-2 h-2 rounded-full bg-purple-600 animate-ping"></span>
            <span>ระบบ Admin Console</span>
          </span>
        </nav>

        <!-- User profile badge and action button on the right -->
        <div class="flex items-center gap-3 shrink-0">
          <button onclick="openReportModal()" class="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v8m-4-4h8"></path></svg>
            <span>โพสต์ประกาศ</span>
          </button>

          <!-- Dynamic Profile Badge (Links to Login Page) -->
          <a href="login.html" title="เข้าสู่ระบบ / สลับบัญชีผู้ใช้" class="relative group block">
            <div class="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-sm transition-all shrink-0">
              <div class="relative shrink-0">
                <div id="nav-user-avatar" class="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-blue-700 text-white font-bold text-xs flex items-center justify-center shadow-inner">
                  สิ
                </div>
                <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div class="text-left hidden sm:block whitespace-nowrap">
                <div id="nav-user-name" class="text-xs font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                  นายสิริเดช เกตานนท์
                </div>
                <div id="nav-user-badge" class="flex items-center gap-1.5 text-[11px] text-slate-500 leading-tight mt-0.5">
                  <span>รหัส 6804130</span>
                  <span class="text-blue-600 font-semibold">• DIT RSU</span>
                </div>
              </div>
              <svg class="w-3.5 h-3.5 text-slate-400 hidden sm:block" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </a>

          <!-- Mobile menu button -->
          <button onclick="toggleMobileMenu()" class="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>

      </div>
    </div>

    <!-- Mobile Nav Drawer -->
    <div id="mobile-menu" class="hidden lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1.5 shadow-lg">
      <a href="#" class="block px-3 py-2 rounded-lg text-sm font-bold text-blue-700 bg-blue-50">Home</a>
      <a href="#items-feed" onclick="toggleMobileMenu()" class="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100">Browse Items</a>
      <button onclick="toggleMobileMenu(); openReportModal()" class="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-blue-700 bg-blue-50">
        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v8m-4-4h8"></path></svg>
        <span>Report Found Item (แจ้งของหาย/พบของ)</span>
      </button>
      <a href="#project-info" onclick="toggleMobileMenu()" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">ข้อมูลวิชา DIT204</a>
      <a href="login.html" class="block px-3 py-2 rounded-lg text-sm font-bold text-blue-600 bg-blue-50/70 hover:bg-blue-100">🔐 เข้าสู่ระบบ / สลับบัญชี (Login)</a>
    </div>
  </header>

  <!-- Role Indicator Banner (แยก 3 หน้าจอตามบทบาทผู้ใช้) -->
  <div id="role-indicator-banner" class="border-b text-xs py-2 px-4 transition-all bg-slate-900 text-slate-300 border-slate-800">
    <div class="max-w-7xl mx-auto flex items-center gap-2">
      <span id="role-pill-badge" class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-blue-600 text-white shrink-0">
        🎓 Student Role
      </span>
      <span id="role-user-name" class="font-semibold text-white truncate">
        นายสิริเดช เกตานนท์
      </span>
      <span class="text-slate-400 hidden sm:inline">|</span>
      <span id="role-desc" class="text-[11px] text-slate-300 hidden sm:inline truncate">
        สิทธิ์: นักศึกษา • ค้นหาของหาย, โพสต์แจ้งของหาย/พบของ (REQ 01), ยื่นขอรับของคืน (REQ 03)
      </span>
    </div>
  </div>

  <!-- 2. HERO / SEARCH SECTION -->
  <section class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 text-white pt-10 pb-14 md:pt-16 md:pb-20">
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
    <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none translate-y-1/3"></div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center max-w-3xl mx-auto mb-8 md:mb-10">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-badge text-blue-200 text-xs md:text-sm font-medium mb-4 shadow-sm">
          <svg class="w-4 h-4 text-sky-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          <span>ระบบศูนย์กลางแจ้งของหายและตามหาเจ้าของสำหรับนักศึกษา IT</span>
        </div>
        
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
          ทำของหายหรือเก็บของได้ในมหาลัย? <br class="hidden sm:inline">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-200 to-white">
            ค้นหาและส่งคืนได้อย่างปลอดภัยที่นี่
          </span>
        </h1>

        <p class="text-slate-300 text-sm sm:text-base md:text-lg font-normal max-w-2xl mx-auto">
          University Lost & Found System แก้ปัญหาข้อมูลกระจัดกระจายในแชท 
          พร้อมระบบยืนยันความเป็นเจ้าของ (Ownership Verification)
        </p>
      </div>

      <!-- Prominent search bar & filter dropdowns box (Stretches 100% full width, perfectly filled) -->
      <div class="max-w-5xl mx-auto bg-white/95 backdrop-blur-md p-3.5 sm:p-5 rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 text-slate-800">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3 w-full">
          
          <!-- 1. Search input (6 of 12 columns = 50% width on desktop) -->
          <div class="md:col-span-6 relative w-full">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              id="search-input"
              type="text"
              oninput="filterItems()"
              placeholder="Search for items, electronics, student cards..."
              class="w-full pl-11 pr-10 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-inner"
            >
          </div>

          <!-- 2. Category filter dropdown (3 of 12 columns = 25% width on desktop) -->
          <div class="md:col-span-3 relative w-full">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
            </div>
            <select
              id="category-select"
              onchange="filterItems()"
              class="w-full pl-10 pr-9 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white appearance-none cursor-pointer transition-all shadow-inner truncate"
            >
              <option value="all">ทุกหมวดหมู่ (All Categories)</option>
              <option value="Electronics">Electronics (อิเล็กทรอนิกส์)</option>
              <option value="Student IDs">Student IDs (บัตรนักศึกษา)</option>
              <option value="Books">Books (หนังสือ / อุปกรณ์เรียน)</option>
              <option value="Personal Items">Personal Items (ของใช้ส่วนตัว)</option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          <!-- 3. Location filter dropdown (3 of 12 columns = 25% width on desktop) -->
          <div class="md:col-span-3 relative w-full">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <select
              id="location-select"
              onchange="filterItems()"
              class="w-full pl-10 pr-9 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white appearance-none cursor-pointer transition-all shadow-inner truncate"
            >
              <option value="all">ทุกสถานที่ (All Locations)</option>
              <option value="อาคาร 1">อาคาร 1 คณะ IT (ตึก IT)</option>
              <option value="ห้อง Lab">ห้อง Lab คอมพิวเตอร์ (Lab 1-302)</option>
              <option value="โรงอาหาร">โรงอาหารกลาง (Cafeteria)</option>
              <option value="หอสมุด">หอสมุดกลาง (Library)</option>
              <option value="อาคารคุณหญิงพัฒนา">อาคารคุณหญิงพัฒนา (Classrooms)</option>
              <option value="ลานจอดรถ">ลานจอดรถอาคาร IT (Parking)</option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

        </div>

        <!-- Filter status pills (Full width bottom bar) -->
        <div class="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
          <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span class="text-xs font-semibold text-slate-400 mr-1">สถานะ:</span>
            <button onclick="setStatusFilter('all')" id="btn-status-all" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow-sm transition-all whitespace-nowrap">ทั้งหมด (All)</button>
            <button onclick="setStatusFilter('LOST')" id="btn-status-lost" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 transition-all whitespace-nowrap">🔴 ของหาย (Looking for owner)</button>
            <button onclick="setStatusFilter('FOUND')" id="btn-status-found" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all whitespace-nowrap">🟢 พบของแล้ว (Found items)</button>
          </div>
          <button onclick="resetFilters()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-slate-100 transition-colors whitespace-nowrap">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            <span>รีเซ็ตตัวกรองทั้งหมด</span>
          </button>
        </div>
      </div>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            <span>รีเซ็ตตัวกรอง</span>
          </button>
        </div>
      </div>

      <!-- Quick Stats Counters -->
      <div class="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-center">
        <div class="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
          <div id="stat-total" class="text-2xl font-black text-white">6</div>
          <div class="text-xs text-blue-200 font-medium">ประกาศทั้งหมด</div>
        </div>
        <div class="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
          <div id="stat-lost" class="text-2xl font-black text-amber-300">3</div>
          <div class="text-xs text-blue-200 font-medium">กำลังตามหาเจ้าของ</div>
        </div>
        <div class="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
          <div id="stat-found" class="text-2xl font-black text-emerald-300">2</div>
          <div class="text-xs text-blue-200 font-medium">มีผู้แจ้งพบของ</div>
        </div>
        <div class="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
          <div id="stat-returned" class="text-2xl font-black text-sky-300">1</div>
          <div class="text-xs text-blue-200 font-medium">ส่งคืนสำเร็จแล้ว</div>
        </div>
      </div>

    </div>
  </section>

  <!-- 3. MAIN CONTENT GRID (ITEMS FEED) -->
  <main id="items-feed" class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    
    <!-- Quick Category Chips -->
    <div class="py-2 mb-6 overflow-x-auto no-scrollbar">
      <div class="flex items-center gap-2 min-w-max pb-1">
        <button onclick="selectCategoryChip('all')" id="chip-all" class="chip-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border bg-blue-600 text-white border-blue-600 shadow-md">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          <span>ทุกหมวดหมู่</span>
        </button>
        <button onclick="selectCategoryChip('Electronics')" id="chip-Electronics" class="chip-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border bg-white text-slate-700 border-slate-200 hover:bg-slate-50">
          <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          <span>อุปกรณ์อิเล็กทรอนิกส์</span>
        </button>
        <button onclick="selectCategoryChip('Student IDs')" id="chip-Student IDs" class="chip-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border bg-white text-slate-700 border-slate-200 hover:bg-slate-50">
          <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" stroke-linecap="round" stroke-linejoin="round"></rect><line x1="7" y1="8" x2="11" y2="8"></line><line x1="7" y1="12" x2="17" y2="12"></line></svg>
          <span>บัตรนักศึกษา / เอกสาร</span>
        </button>
        <button onclick="selectCategoryChip('Books')" id="chip-Books" class="chip-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border bg-white text-slate-700 border-slate-200 hover:bg-slate-50">
          <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          <span>หนังสือ / อุปกรณ์เรียน</span>
        </button>
        <button onclick="selectCategoryChip('Personal Items')" id="chip-Personal Items" class="chip-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border bg-white text-slate-700 border-slate-200 hover:bg-slate-50">
          <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          <span>ของใช้ส่วนตัว</span>
        </button>
      </div>
    </div>

    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900">
          รายการสิ่งของล่าสุด (Latest Items Feed)
        </h2>
        <p class="text-xs sm:text-sm text-slate-500">
          แสดงรายการของหายและของที่เก็บได้ภายในมหาวิทยาลัยรังสิต
        </p>
      </div>
      <button onclick="openReportModal()" class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200">
        <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v8m-4-4h8"></path></svg>
        <span>เพิ่มประกาศใหม่</span>
      </button>
    </div>

    <!-- Items Grid Container -->
    <div id="items-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
      <!-- Cards rendered via JavaScript -->
    </div>

    <!-- Empty State -->
    <div id="empty-state" class="hidden bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm my-6">
      <div class="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </div>
      <h3 class="text-lg font-bold text-slate-900 mb-2">ไม่พบรายการสิ่งของที่ตรงกับเงื่อนไขการค้นหา</h3>
      <p class="text-sm text-slate-500 mb-6">ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองสถานที่และหมวดหมู่</p>
      <button onclick="resetFilters()" class="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-md">
        ล้างตัวกรองทั้งหมด
      </button>
    </div>

    <!-- 4. ACADEMIC PROJECT BADGE (DIT204 RSU) -->
    <div id="project-info" class="mt-16 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-blue-900/50">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-sky-400 shrink-0 shadow-inner">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-5.825-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-blue-500/20 text-sky-300 rounded-md border border-blue-400/30">
                DIT204
              </span>
              <span class="text-xs text-slate-300">วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี • มหาวิทยาลัยรังสิต</span>
            </div>
            <h3 class="text-lg sm:text-xl font-black text-white mt-1">
              โครงงานระบบบอร์ดแจ้งของหายและตามหาเจ้าของ (University Lost & Found System)
            </h3>
          </div>
        </div>
        <span class="text-xs px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold self-start md:self-auto">
          สถานะ: พร้อมส่งตรวจรับงาน
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
        <div class="bg-white/5 rounded-2xl p-4 border border-white/10">
          <span class="text-xs text-slate-400 block mb-1">ผู้จัดทำโครงงาน (Project Owner)</span>
          <div class="font-bold text-white text-base">นายสิริเดช เกตานนท์</div>
          <div class="text-xs text-sky-300 mt-0.5">รหัสนักศึกษา: 6804130</div>
          <div class="text-xs text-slate-400 mt-0.5">สาขาวิชานวัตกรรมดิจิทัลและปัญญาประดิษฐ์</div>
        </div>

        <div class="bg-white/5 rounded-2xl p-4 border border-white/10">
          <span class="text-xs text-slate-400 block mb-1">อาจารย์ผู้ควบคุมและประเมินผล</span>
          <div class="font-bold text-white text-base">อาจารย์นิษฐเนตร์ ณัฏฐกุลนันท์</div>
          <div class="font-semibold text-slate-300 text-xs mt-0.5">ผศ.ดร.กานต์ ยงศิริวิทย์</div>
          <div class="text-xs text-slate-400 mt-1">ภาคการศึกษาที่ 1/2569</div>
        </div>

        <div class="bg-white/5 rounded-2xl p-4 border border-white/10">
          <span class="text-xs text-slate-400 block mb-1">เกณฑ์เป้าหมายความสำเร็จ (Target KPIs)</span>
          <div class="text-xs text-emerald-400 font-semibold mb-1">✓ Functional Test Pass: ≥ 85% (REQ 01)</div>
          <div class="text-xs text-sky-300 font-semibold mb-1">✓ Search Accuracy: ≥ 80% (REQ 02)</div>
          <div class="text-xs text-amber-300 font-semibold">✓ User Satisfaction: ≥ 70% (REQ 03)</div>
        </div>
      </div>
    </div>

  </main>

  <!-- MODAL: REPORT FOUND / LOST ITEM -->
  <div id="report-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
    <div class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
      <div class="px-6 py-5 bg-gradient-to-r from-blue-900 to-blue-700 text-white flex items-center justify-between">
        <div>
          <h3 class="text-lg font-bold flex items-center gap-2">
            <svg class="w-5 h-5 text-sky-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v8m-4-4h8"></path></svg>
            <span>แจ้งประกาศสิ่งของ (Report Item - REQ 01)</span>
          </h3>
          <p class="text-xs text-blue-200 mt-0.5">บันทึกรายการของหายหรือของที่พบภายในมหาวิทยาลัย</p>
        </div>
        <button onclick="closeReportModal()" class="p-1.5 rounded-full text-white/80 hover:text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <form onsubmit="handleCreateItem(event)" class="p-6 overflow-y-auto space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1.5">ประเภทการแจ้ง *</label>
          <div class="grid grid-cols-2 gap-3">
            <label class="cursor-pointer border p-3 rounded-xl flex items-center gap-2 border-slate-200 hover:bg-slate-50">
              <input type="radio" name="item-type" value="LOST" class="text-rose-600 focus:ring-rose-500">
              <span class="text-xs font-bold text-rose-700">ฉันทำของหาย (Lost)</span>
            </label>
            <label class="cursor-pointer border p-3 rounded-xl flex items-center gap-2 border-emerald-300 bg-emerald-50">
              <input type="radio" name="item-type" value="FOUND" checked class="text-emerald-600 focus:ring-emerald-500">
              <span class="text-xs font-bold text-emerald-700">ฉันเก็บของได้ (Found)</span>
            </label>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">ชื่อสิ่งของ *</label>
            <input id="new-title" type="text" required placeholder="เช่น หูฟังบลูทูธ Sony หรือ บัตรนักศึกษา" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">English Title (อุปกรณ์)</label>
            <input id="new-english" type="text" placeholder="e.g. Wireless Headphones" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">หมวดหมู่ *</label>
            <select id="new-category" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white">
              <option value="Electronics">Electronics (อุปกรณ์อิเล็กทรอนิกส์)</option>
              <option value="Student IDs">Student IDs (บัตรนักศึกษา / เอกสาร)</option>
              <option value="Books">Books (หนังสือ / อุปกรณ์การเรียน)</option>
              <option value="Personal Items">Personal Items (ของใช้ส่วนตัว)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">สถานที่ *</label>
            <input id="new-location" type="text" required placeholder="เช่น อาคาร 1 (IT) ห้อง Lab 1-302" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none">
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">รายละเอียดและตำหนิ *</label>
          <textarea id="new-description" rows="3" required placeholder="ระบุสี ลักษณะ ยี่ห้อ หรือข้อมูลประกอบ..." class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"></textarea>
        </div>

        <div class="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200">
          <label class="block text-xs font-bold text-blue-900 mb-1">คำถามยืนยันความเป็นเจ้าของ (REQ 03 Ownership Verification)</label>
          <input id="new-question" type="text" placeholder="เช่น รูปบนสติกเกอร์ หรือ วอลเปเปอร์หน้าจอล็อก?" class="w-full px-3 py-2 rounded-xl border border-blue-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button type="button" onclick="closeReportModal()" class="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100">ยกเลิก</button>
          <button type="submit" class="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md">บันทึกประกาศ</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: CLAIM ITEM -->
  <div id="claim-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
    <div class="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
      <div class="px-6 py-5 bg-gradient-to-r from-blue-900 to-indigo-800 text-white flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          <div>
            <h3 class="text-base sm:text-lg font-bold">ยืนยันความเป็นเจ้าของ (Claim Item)</h3>
            <p class="text-xs text-blue-200">โมดูลตรวจสอบหลักฐานและบันทึกการส่งคืน (REQ 03 / T03)</p>
          </div>
        </div>
        <button onclick="closeClaimModal()" class="p-1.5 rounded-full text-white/80 hover:text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <form onsubmit="handleClaimSubmit(event)" class="p-6 overflow-y-auto space-y-4">
        <div id="claim-target-summary" class="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-sm">
        </div>

        <div class="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
          <div class="font-bold flex items-center gap-1.5">
            <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path stroke-linecap="round" stroke-linejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01"></path></svg>
            <span id="claim-question-text">คำถามยืนยันกรรมสิทธิ์</span>
          </div>
          <p class="text-[11px] text-amber-700">* ข้อมูลนี้ใช้พิสูจน์ว่าคุณคือเจ้าของตัวจริง ป้องกันการสวมรอยตามรายงาน DIT204</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">คำตอบ / รายละเอียดเฉพาะเพื่อพิสูจน์ความเป็นเจ้าของ *</label>
          <textarea id="claim-answer" rows="2" required placeholder="เช่น สีเคส รหัสผ่าน รูปภาพบนหน้าจอ หรือสติกเกอร์ลับ..." class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">ชื่อผู้ขอรับคืน</label>
            <input type="text" id="claim-name" value="นายสิริเดช เกตานนท์" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">รหัสนักศึกษา</label>
            <input type="text" id="claim-id" value="6804130" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs">
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button type="button" onclick="closeClaimModal()" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">ปิด</button>
          <button type="submit" class="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md">ส่งหลักฐานยืนยัน & ขอรับของ</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: VIEW DETAILS -->
  <div id="detail-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
    <div class="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
      <button onclick="closeDetailModal()" class="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-md">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      <div class="overflow-y-auto">
        <div class="relative h-60 w-full bg-slate-900">
          <img id="detail-img" src="" alt="" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>
          <div class="absolute bottom-4 left-6 right-6 flex items-center justify-between">
            <span id="detail-badge-type" class="px-3 py-1 rounded-full text-xs font-bold text-white bg-rose-600">LOST</span>
            <span id="detail-badge-status" class="px-3 py-1 rounded-full text-xs font-bold text-white bg-amber-500">Looking for owner</span>
          </div>
        </div>

        <div class="p-6 space-y-4">
          <h2 id="detail-title" class="text-xl font-bold text-slate-900"></h2>
          <p id="detail-english" class="text-xs text-slate-400 font-medium -mt-2"></p>
          
          <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
            <div class="flex items-center gap-2 text-slate-700">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span id="detail-location" class="font-bold"></span>
            </div>
            <div class="flex items-center gap-2 text-slate-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span id="detail-date"></span>
            </div>
          </div>

          <div>
            <h4 class="text-xs font-bold uppercase text-slate-400 mb-1">รายละเอียด</h4>
            <p id="detail-desc" class="text-sm text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-100"></p>
          </div>

          <div class="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button onclick="closeDetailModal()" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">ปิด</button>
            <button id="detail-claim-btn" onclick="triggerClaimFromDetail()" class="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md">
              ยืนยันความเป็นเจ้าของ (Claim Item)
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <footer class="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500 mt-auto">
    <div class="max-w-7xl mx-auto px-4 space-y-2">
      <div class="flex flex-wrap items-center justify-center gap-4 text-slate-600 font-medium">
        <span>Lost & Found IT Department</span>
        <span>•</span>
        <span>วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี มหาวิทยาลัยรังสิต</span>
        <span>•</span>
        <span>DIT204 Information System Project Management</span>
      </div>
      <p class="text-slate-400">
        จัดทำโดย 6804130 นายสิริเดช เกตานนท์ สำหรับส่งอาจารย์นิษฐเนตร์ ณัฏฐกุลนันท์ และ ผศ.ดร.กานต์ ยงศิริวิทย์
      </p>
    </div>
  </footer>

  <!-- SCRIPT -->
  <script>
    let itemsData = [
      {
        id: "item-001",
        title: "หูฟังไร้สาย Apple AirPods Pro 2",
        englishTitle: "Wireless Bluetooth Headphones (AirPods Pro 2)",
        type: "LOST",
        status: "LOOKING_FOR_OWNER",
        category: "Electronics",
        location: "อาคาร 1 (IT Building) ห้อง Lab 1-302",
        date: "2026-11-05",
        time: "14:30 น.",
        description: "ลืมไว้ที่โต๊ะคอมพิวเตอร์แถวหลังสุด ห้องแล็บปฏิบัติการคอมพิวเตอร์ 1-302 หลังคาบเรียน DIT204 ตัวเคสสีขาวมีเคสกันกระแทกสีน้ำเงินใส",
        contactName: "นายสิริเดช เกตานนท์ (นักศึกษา DIT)",
        contactTel: "089-xxx-4130",
        image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80",
        secretQuestion: "สติกเกอร์ที่ติดอยู่มุมล่างขวาของเคสหูฟังคือรูปอะไร?"
      },
      {
        id: "item-002",
        title: "บัตรประจำตัวนักศึกษา มหาวิทยาลัยรังสิต",
        englishTitle: "Student ID Card (RSU)",
        type: "FOUND",
        status: "FOUND_ITEM",
        category: "Student IDs",
        location: "โรงอาหารกลาง (Cafeteria อาคาร 1)",
        date: "2026-11-06",
        time: "11:45 น.",
        description: "เก็บได้ที่โต๊ะทานข้าวฝั่งร้านข้าวมันไก่ ในซองใส่บัตรสีน้ำเงินพร้อมสายคล้องคอสีส้มของมหาวิทยาลัยรังสิต ส่งไว้ที่โต๊ะธุรการชั้น 1",
        contactName: "เจ้าหน้าที่ธุรการคณะ DIT",
        contactTel: "02-997-2200 ต่อ 3100",
        image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
        secretQuestion: "ระบุรหัสนักศึกษา 3 ตัวท้าย และชื่อบนบัตรเพื่อยืนยันตัวตน"
      },
      {
        id: "item-003",
        title: "Apple iPad Gen 9 (Space Gray) พร้อมปากกา",
        englishTitle: "iPad Gen 9 (Space Gray) with Stylus",
        type: "LOST",
        status: "LOOKING_FOR_OWNER",
        category: "Electronics",
        location: "หอสมุดกลาง ชั้น 2 (Library)",
        date: "2026-11-04",
        time: "17:15 น.",
        description: "วางลืมไว้ที่โซน Co-Working Space โต๊ะกลมสีขาวใกล้ชั้นหนังสือหมวดคอมพิวเตอร์ เคสแม่เหล็กสีน้ำเงินเข้ม มีไฟล์สไลด์วิชาอาจารย์นิษฐเนตร์",
        contactName: "กุลธิดา (เพื่อนร่วมรุ่น DIT)",
        contactTel: "081-xxx-8899",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
        secretQuestion: "วอลเปเปอร์หน้าจอล็อก (Lock Screen) ของ iPad คือภาพอะไร?"
      },
      {
        id: "item-004",
        title: "กระเป๋าสตางค์หนังแท้สีดำ (Leather Wallet)",
        englishTitle: "Black Leather Bi-Fold Wallet",
        type: "FOUND",
        status: "FOUND_ITEM",
        category: "Personal Items",
        location: "อาคารคุณหญิงพัฒนา ชั้น 4 (Classrooms)",
        date: "2026-11-05",
        time: "16:00 น.",
        description: "พบตกอยู่ใต้เก้าอี้แถวกลางในห้องบรรยาย 4-401 หลังเลิกคลาส มีบัตรประชาชนและธนบัตรบางส่วน ติดต่อรับคืนได้ที่ห้องพักอาจารย์",
        contactName: "อาจารย์ผู้ช่วยสอน (TA DIT204)",
        contactTel: "086-xxx-1234",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
        secretQuestion: "ระบุชื่อยี่ห้อกระเป๋าหรือจำนวนบัตรที่มีอยู่ด้านในอย่างถูกต้อง"
      },
      {
        id: "item-005",
        title: "สมุดสรุปเลกเชอร์ DIT204 Project Management",
        englishTitle: "Lecture Notebook - DIT204",
        type: "FOUND",
        status: "RETURNED",
        category: "Books",
        location: "อาคาร 1 (IT Building) โถงบันไดชั้น 2",
        date: "2026-11-03",
        time: "10:00 น.",
        description: "สมุดปกสีน้ำตาล Muji สรุปเนื้อหา WBS, Gantt Chart เตรียมส่งอาจารย์ ผศ.ดร.กานต์ มีการส่งมอบคืนเจ้าของเรียบร้อยแล้ว",
        contactName: "นายสิริเดช เกตานนท์",
        contactTel: "089-xxx-4130",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
        secretQuestion: "ลายมือชื่อหรือสัญลักษณ์ที่เขียนไว้หน้าปกในคืออะไร?"
      },
      {
        id: "item-006",
        title: "พวงกุญแจรถยนต์ Honda พร้อมสายคล้อง DIT ม.รังสิต",
        englishTitle: "Car Smart Key with RSU Lanyard",
        type: "LOST",
        status: "LOOKING_FOR_OWNER",
        category: "Personal Items",
        location: "ลานจอดรถ อาคาร 1 (Parking Area)",
        date: "2026-11-06",
        time: "09:15 น.",
        description: "กุญแจรีโมตสมาร์ตคีย์ Honda City พร้อมสายคล้องคอสีฟ้า DIT RSU และพวงกุญแจเป็ดสีเหลือง",
        contactName: "ศุภกิตติ์ (นักศึกษาปี 2)",
        contactTel: "092-xxx-7766",
        image: "https://images.unsplash.com/photo-1590483256037-7ef3f5e921d7?auto=format&fit=crop&w=800&q=80",
        secretQuestion: "ตุ๊กตาที่ห้อยคู่กับกุญแจมีลักษณะพิเศษอย่างไร?"
      }
    ];

    let currentStatusFilter = 'all';
    let currentItemInModal = null;

    function renderCards(items) {
      const grid = document.getElementById('items-grid');
      const empty = document.getElementById('empty-state');
      grid.innerHTML = '';

      if (items.length === 0) {
        empty.classList.remove('hidden');
        return;
      }
      empty.classList.add('hidden');

      items.forEach(item => {
        const isLost = item.type === 'LOST';
        const isReturned = item.status === 'RETURNED';

        let badgeBg = isLost ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
        let badgeDot = isLost ? 'bg-rose-500' : 'bg-emerald-500';
        let statusLabel = isLost ? 'Looking for owner' : 'Found item';

        if (isReturned) {
          badgeBg = 'bg-sky-50 text-sky-700 border-sky-200';
          badgeDot = 'bg-sky-500';
          statusLabel = 'Returned (ส่งคืนแล้ว)';
        }

        const card = document.createElement('div');
        card.className = "group bg-white rounded-2xl border border-slate-200 shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1";
        card.innerHTML = \`
          <div class="relative h-48 w-full overflow-hidden bg-slate-100">
            <img src="\${item.image}" alt="\${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20"></div>
            
            <div class="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
              <span class="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white/90 text-slate-800 shadow-sm">\${item.category}</span>
              <span class="px-2.5 py-1 text-[11px] font-extrabold rounded-lg text-white \${isLost ? 'bg-rose-600/90' : 'bg-emerald-600/90'}">
                \${isLost ? 'ของหาย' : 'เก็บได้'}
              </span>
            </div>

            <div class="absolute bottom-3 left-3">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border \${badgeBg}">
                <span class="w-2 h-2 rounded-full \${badgeDot} animate-pulse"></span>
                \${statusLabel}
              </span>
            </div>
          </div>

          <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 class="text-base sm:text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">\${item.title}</h3>
              <p class="text-xs text-slate-400 font-medium mb-2.5 truncate">\${item.englishTitle || ''}</p>
              <p class="text-xs text-slate-600 line-clamp-2 mb-3.5 leading-relaxed">\${item.description}</p>
              
              <div class="space-y-1.5 text-xs text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div class="flex items-center gap-2 text-slate-700">
                  <svg class="w-3.5 h-3.5 text-blue-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span class="font-medium truncate">\${item.location}</span>
                </div>
                <div class="flex items-center gap-2 text-slate-500">
                  <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>\${item.date} • \${item.time || 'ไม่ระบุเวลา'}</span>
                </div>
              </div>
            </div>

            <div class="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button onclick="openDetailModal('\${item.id}')" class="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                <span>View Details</span>
              </button>

              <button onclick="openClaimModal('\${item.id}')" \${isReturned ? 'disabled' : ''} class="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm \${isReturned ? 'bg-slate-100 text-slate-400 cursor-not-allowed border' : 'bg-blue-600 hover:bg-blue-700 text-white'}">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                <span>\${isReturned ? 'ส่งมอบแล้ว' : 'Claim Item'}</span>
              </button>
            </div>
          </div>
        \`;
        grid.appendChild(card);
      });

      document.getElementById('stat-total').innerText = itemsData.length;
      document.getElementById('stat-lost').innerText = itemsData.filter(i => i.status === 'LOOKING_FOR_OWNER').length;
      document.getElementById('stat-found').innerText = itemsData.filter(i => i.status === 'FOUND_ITEM').length;
      document.getElementById('stat-returned').innerText = itemsData.filter(i => i.status === 'RETURNED').length;
    }

    function filterItems() {
      const q = document.getElementById('search-input').value.toLowerCase().trim();
      const cat = document.getElementById('category-select').value;
      const loc = document.getElementById('location-select').value;

      const filtered = itemsData.filter(item => {
        if (q) {
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchEng = (item.englishTitle || '').toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchLoc = item.location.toLowerCase().includes(q);
          if (!matchTitle && !matchEng && !matchDesc && !matchLoc) return false;
        }

        if (cat !== 'all' && item.category !== cat) return false;
        if (loc !== 'all' && !item.location.includes(loc)) return false;
        if (currentStatusFilter !== 'all' && item.type !== currentStatusFilter) return false;

        return true;
      });

      renderCards(filtered);
    }

    function selectCategoryChip(catId) {
      document.getElementById('category-select').value = catId;
      document.querySelectorAll('.chip-btn').forEach(b => {
        b.className = "chip-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border bg-white text-slate-700 border-slate-200 hover:bg-slate-50";
      });
      const activeChip = document.getElementById('chip-' + catId);
      if (activeChip) {
        activeChip.className = "chip-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border bg-blue-600 text-white border-blue-600 shadow-md";
      }
      filterItems();
    }

    function setStatusFilter(status) {
      currentStatusFilter = status;
      ['all', 'lost', 'found'].forEach(s => {
        const btn = document.getElementById('btn-status-' + s);
        btn.className = (s === status.toLowerCase())
          ? 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow-sm transition-all whitespace-nowrap'
          : 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all whitespace-nowrap';
      });
      filterItems();
    }

    function resetFilters() {
      document.getElementById('search-input').value = '';
      document.getElementById('category-select').value = 'all';
      document.getElementById('location-select').value = 'all';
      selectCategoryChip('all');
      currentStatusFilter = 'all';
      setStatusFilter('all');
    }

    function toggleMobileMenu() {
      document.getElementById('mobile-menu').classList.toggle('hidden');
    }

    function openReportModal() {
      document.getElementById('report-modal').classList.remove('hidden');
    }
    function closeReportModal() {
      document.getElementById('report-modal').classList.add('hidden');
    }

    function handleCreateItem(e) {
      e.preventDefault();
      const type = document.querySelector('input[name="item-type"]:checked').value;
      const title = document.getElementById('new-title').value.trim();
      const englishTitle = document.getElementById('new-english').value.trim();
      const category = document.getElementById('new-category').value;
      const location = document.getElementById('new-location').value.trim();
      const description = document.getElementById('new-description').value.trim();
      const secretQuestion = document.getElementById('new-question').value.trim();

      const newItem = {
        id: 'item-' + Date.now(),
        title,
        englishTitle,
        type,
        status: type === 'LOST' ? 'LOOKING_FOR_OWNER' : 'FOUND_ITEM',
        category,
        location,
        date: new Date().toISOString().split('T')[0],
        time: 'เพิ่งแจ้ง',
        description,
        secretQuestion: secretQuestion || 'ระบุจุดสังเกตเฉพาะหรือตำหนิ',
        image: type === 'LOST'
          ? 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
      };

      itemsData.unshift(newItem);
      closeReportModal();
      filterItems();
      alert('สร้างประกาศสำเร็จเรียบร้อย! (REQ 01)');
    }

    function openClaimModal(id) {
      const item = itemsData.find(i => i.id === id);
      if (!item) return;
      currentItemInModal = item;

      document.getElementById('claim-target-summary').innerHTML = \`
        <div class="flex items-center gap-3">
          <img src="\${item.image}" class="w-12 h-12 rounded-xl object-cover border">
          <div>
            <div class="font-bold text-slate-900">\${item.title}</div>
            <div class="text-xs text-slate-500">\${item.location} • \${item.category}</div>
          </div>
        </div>
      \`;

      document.getElementById('claim-question-text').innerText = item.secretQuestion || 'ระบุจุดสังเกตเฉพาะของสิ่งของ';
      document.getElementById('claim-answer').value = '';
      document.getElementById('claim-modal').classList.remove('hidden');
    }

    function closeClaimModal() {
      document.getElementById('claim-modal').classList.add('hidden');
    }

    function handleClaimSubmit(e) {
      e.preventDefault();
      if (!currentItemInModal) return;

      currentItemInModal.status = 'RETURNED';
      closeClaimModal();
      filterItems();
      alert('ยืนยันความเป็นเจ้าของสำเร็จ! ระบบบันทึกสถานะเป็น "ส่งคืนแล้ว (Returned)" ตามเกณฑ์ REQ 03 เรียบร้อยแล้ว');
    }

    function openDetailModal(id) {
      const item = itemsData.find(i => i.id === id);
      if (!item) return;
      currentItemInModal = item;

      document.getElementById('detail-img').src = item.image;
      document.getElementById('detail-title').innerText = item.title;
      document.getElementById('detail-english').innerText = item.englishTitle || '';
      document.getElementById('detail-location').innerText = item.location;
      document.getElementById('detail-date').innerText = item.date + ' • ' + (item.time || '');
      document.getElementById('detail-desc').innerText = item.description;

      const isLost = item.type === 'LOST';
      const isReturned = item.status === 'RETURNED';

      const typeBadge = document.getElementById('detail-badge-type');
      typeBadge.innerText = isLost ? 'ของหาย (Lost)' : 'พบสิ่งของ (Found)';
      typeBadge.className = isLost ? 'px-3 py-1 rounded-full text-xs font-bold text-white bg-rose-600' : 'px-3 py-1 rounded-full text-xs font-bold text-white bg-emerald-600';

      const statusBadge = document.getElementById('detail-badge-status');
      statusBadge.innerText = isReturned ? 'ส่งคืนแล้ว (Returned)' : (item.status === 'FOUND_ITEM' ? 'พบของแล้ว' : 'กำลังตามหาเจ้าของ');
      statusBadge.className = isReturned ? 'px-3 py-1 rounded-full text-xs font-bold text-white bg-sky-500' : 'px-3 py-1 rounded-full text-xs font-bold text-white bg-amber-500';

      const claimBtn = document.getElementById('detail-claim-btn');
      if (isReturned) {
        claimBtn.disabled = true;
        claimBtn.innerText = 'ส่งมอบสิ่งของเรียบร้อยแล้ว';
        claimBtn.className = 'px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 bg-slate-200 cursor-not-allowed';
      } else {
        claimBtn.disabled = false;
        claimBtn.innerText = 'ยืนยันความเป็นเจ้าของ (Claim Item)';
        claimBtn.className = 'px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md';
      }

      document.getElementById('detail-modal').classList.remove('hidden');
    }

    function closeDetailModal() {
      document.getElementById('detail-modal').classList.add('hidden');
    }

    function triggerClaimFromDetail() {
      if (currentItemInModal) {
        const id = currentItemInModal.id;
        closeDetailModal();
        openClaimModal(id);
      }
    }

    function syncUserBadge() {
      try {
        const raw = localStorage.getItem('lost_found_user');
        const u = raw ? JSON.parse(raw) : {
          role: 'student',
          name: 'นายสิริเดช เกตานนท์',
          badge: 'รหัส 6804130 • DIT RSU',
          initials: 'สิ',
          color: 'from-sky-500 to-blue-700'
        };

        const avatarEl = document.getElementById('nav-user-avatar');
        const nameEl = document.getElementById('nav-user-name');
        const badgeEl = document.getElementById('nav-user-badge');
        const tidbLink = document.getElementById('nav-tidb-link');
        const staffBadge = document.getElementById('nav-staff-badge');
        const adminBadge = document.getElementById('nav-admin-badge');
        const roleBanner = document.getElementById('role-indicator-banner');
        const rolePill = document.getElementById('role-pill-badge');
        const roleUserName = document.getElementById('role-user-name');
        const roleDesc = document.getElementById('role-desc');

        if (avatarEl && u.initials) {
          avatarEl.innerText = u.initials;
          avatarEl.className = 'w-8 h-8 rounded-full bg-gradient-to-tr ' + (u.color || 'from-sky-500 to-blue-700') + ' text-white font-bold text-xs flex items-center justify-center shadow-inner';
        }
        if (nameEl && u.name) {
          nameEl.innerText = u.name;
        }
        if (badgeEl && u.badge) {
          badgeEl.innerHTML = '<span>' + u.badge + '</span>';
        }

        // Role-based visibility controls:
        if (u.role === 'staff') {
          // Staff Mode — ซ่อน TiDB Link (เฉพาะ Admin เท่านั้น)
          if (tidbLink) tidbLink.classList.add('hidden');
          if (staffBadge) staffBadge.classList.remove('hidden');
          if (adminBadge) adminBadge.classList.add('hidden');
          if (roleBanner) roleBanner.className = 'border-b text-xs py-2 px-4 transition-all bg-amber-900 text-amber-100 border-amber-800';
          if (rolePill) {
            rolePill.className = 'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-900';
            rolePill.innerText = '🏫 Staff Role';
          }
          if (roleUserName) roleUserName.innerText = u.name;
          if (roleDesc) roleDesc.innerText = 'สิทธิ์: อาจารย์/เจ้าหน้าที่ • ตรวจสอบคำขอคืนของ (Ownership Verification), อนุมัติการส่งมอบ, ปักหมุดประกาศสำคัญ';
        } else if (u.role === 'admin') {
          // Admin Mode
          if (tidbLink) tidbLink.classList.remove('hidden');
          if (adminBadge) adminBadge.classList.remove('hidden');
          if (staffBadge) staffBadge.classList.add('hidden');
          if (roleBanner) roleBanner.className = 'border-b text-xs py-2 px-4 transition-all bg-purple-900 text-purple-100 border-purple-800';
          if (rolePill) {
            rolePill.className = 'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-purple-500 text-white';
            rolePill.innerText = '🛡️ Admin Role';
          }
          if (roleUserName) roleUserName.innerText = u.name;
          if (roleDesc) roleDesc.innerText = 'สิทธิ์: ผู้ดูแลระบบสูงสุด • จัดการฐานข้อมูล TiDB Cloud ครบ 5 ตาราง และควบคุมความปลอดภัย';
        } else {
          // Student Mode (Hide TiDB Link)
          if (tidbLink) tidbLink.classList.add('hidden');
          if (staffBadge) staffBadge.classList.add('hidden');
          if (adminBadge) adminBadge.classList.add('hidden');
          if (roleBanner) roleBanner.className = 'border-b text-xs py-2 px-4 transition-all bg-slate-900 text-slate-300 border-slate-800';
          if (rolePill) {
            rolePill.className = 'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-blue-600 text-white';
            rolePill.innerText = '🎓 Student Role';
          }
          if (roleUserName) roleUserName.innerText = u.name;
          if (roleDesc) roleDesc.innerText = 'สิทธิ์: นักศึกษา • ค้นหาของหาย, โพสต์แจ้งของหาย/พบของ (REQ 01), ยื่นขอรับของคืน (REQ 03)';
        }
      } catch(e) {}
    }

    document.addEventListener('DOMContentLoaded', () => {
      syncUserBadge();
      renderCards(itemsData);
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'public', 'index.html'), htmlContent, 'utf8');
console.log('Successfully generated self-contained public/index.html with embedded CSS and SVGs!');

