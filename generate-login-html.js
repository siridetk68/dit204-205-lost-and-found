const fs = require('fs');
const path = require('path');

const cssContent = fs.readFileSync(path.join(__dirname, 'public', 'style.css'), 'utf8');

const htmlContent = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>เข้าสู่ระบบ - RSU IT Lost & Found</title>
  
  <style>
${cssContent}

    @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap');
    body {
      font-family: 'Prompt', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
    }
  </style>
</head>
<body class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
  
  <div class="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
  <div class="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none translate-y-1/2"></div>

  <!-- Back to Home -->
  <div class="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
    <a href="index.html" class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      <span>กลับไปยังหน้าหลัก (Back to Home)</span>
    </a>
  </div>

  <div class="sm:mx-auto sm:w-full sm:max-w-md px-4">
    
    <!-- Logo & Header -->
    <div class="text-center mb-6">
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/30 mb-3">
        <svg class="w-7 h-7 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>
      <div class="flex items-center justify-center gap-1.5">
        <h2 class="text-2xl font-black tracking-tight text-slate-900">
          Lost & Found
        </h2>
        <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 rounded-md border border-blue-200">
          IT DEPT
        </span>
      </div>
      <p class="mt-1 text-xs text-slate-500 font-medium">
        ระบบยืนยันตัวตนนศ.และบุคลากร • มหาวิทยาลัยรังสิต (DIT204)
      </p>
    </div>

    <!-- Login Box -->
    <div class="bg-white py-8 px-6 shadow-card rounded-3xl border border-slate-200/90 sm:px-10 relative">
      
      <!-- Role Selector -->
      <div class="mb-5">
        <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
          เข้าใช้งานในฐานะ (Select Role)
        </label>
        <div class="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button type="button" onclick="selectRole('student')" id="role-student" class="py-1.5 text-xs font-bold rounded-lg transition-all bg-white text-blue-700 shadow-sm">
            👨‍🎓 นักศึกษา
          </button>
          <button type="button" onclick="selectRole('staff')" id="role-staff" class="py-1.5 text-xs font-bold rounded-lg transition-all text-slate-600 hover:text-slate-900">
            👩‍🏫 อาจารย์
          </button>
          <button type="button" onclick="selectRole('admin')" id="role-admin" class="py-1.5 text-xs font-bold rounded-lg transition-all text-slate-600 hover:text-slate-900">
            🛡️ ผู้ดูแล
          </button>
        </div>
      </div>

      <!-- Notification message -->
      <div id="login-alert" class="hidden mb-4 p-3 rounded-xl border text-xs flex items-center gap-2"></div>

      <form onsubmit="handleLoginSubmit(event)" class="space-y-4">
        
        <!-- User ID -->
        <div>
          <label id="label-user" class="block text-xs font-bold text-slate-700 mb-1.5">
            รหัสนักศึกษา (Student ID)
          </label>
          <div class="relative rounded-xl shadow-inner">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <input
              id="input-username"
              type="text"
              required
              value="6804130"
              class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all"
            >
          </div>
        </div>

        <!-- Password -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-xs font-bold text-slate-700">
              รหัสผ่าน (Password)
            </label>
            <a href="#" onclick="alert('สำหรับทดสอบในรายวิชา DIT204 สามารถเข้าใช้งานด้วยรหัสผ่านจำลองได้ทันทีครับ')" class="text-[11px] font-semibold text-blue-600 hover:underline">
              ลืมรหัสผ่าน?
            </a>
          </div>
          <div class="relative rounded-xl shadow-inner">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0110 0v4"></path></svg>
            </div>
            <input
              id="input-password"
              type="password"
              required
              value="password123"
              class="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all"
            >
            <button
              type="button"
              onclick="togglePasswordVisibility()"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <svg id="eye-icon" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            </button>
          </div>
        </div>

        <!-- Remember Me -->
        <div class="flex items-center justify-between pt-1">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked
              class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            >
            <span class="text-xs text-slate-600 font-medium">จดจำการเข้าสู่ระบบ</span>
          </label>

          <span class="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            <span>SSL Secured</span>
          </span>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          id="btn-login"
          class="w-full py-3 px-4 mt-2 bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-5.825-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
          <span>เข้าสู่ระบบ (Sign In)</span>
        </button>

      </form>

      <!-- Demo Credentials -->
      <div class="mt-6 pt-5 border-t border-slate-100 text-center">
        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          บัญชีทดสอบสำหรับอาจารย์ผู้ประเมิน (Demo Credentials)
        </span>
        <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-left text-xs text-slate-600 space-y-1">
          <div class="flex justify-between">
            <span class="font-bold text-slate-800">รหัสนักศึกษา:</span>
            <span class="font-mono text-blue-700">6804130 (นายสิริเดช)</span>
          </div>
          <div class="flex justify-between">
            <span class="font-bold text-slate-800">รหัสผ่าน:</span>
            <span class="font-mono text-slate-500">กรอกอะไรก็ได้ (Mock Auth)</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Academic Footer -->
    <p class="text-center text-xs text-slate-400 mt-6">
      วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี มหาวิทยาลัยรังสิต <br>
      วิชา DIT204 Information System Project Management
    </p>

  </div>

  <script>
    let currentRole = 'student';

    function selectRole(role) {
      currentRole = role;
      const userInput = document.getElementById('input-username');
      const labelUser = document.getElementById('label-user');

      ['student', 'staff', 'admin'].forEach(r => {
        const btn = document.getElementById('role-' + r);
        if (r === role) {
          btn.className = "py-1.5 text-xs font-bold rounded-lg transition-all bg-white text-blue-700 shadow-sm";
        } else {
          btn.className = "py-1.5 text-xs font-bold rounded-lg transition-all text-slate-600 hover:text-slate-900";
        }
      });

      if (role === 'student') {
        labelUser.innerText = 'รหัสนักศึกษา (Student ID)';
        userInput.value = '6804130';
      } else if (role === 'staff') {
        labelUser.innerText = 'ชื่อผู้ใช้อาจารย์ (Staff Username)';
        userInput.value = 'ajarn.nittanate';
      } else {
        labelUser.innerText = 'ชื่อผู้ใช้ผู้ดูแลระบบ (Admin Username)';
        userInput.value = 'admin.dit';
      }
    }

    function togglePasswordVisibility() {
      const passInput = document.getElementById('input-password');
      if (passInput.type === 'password') {
        passInput.type = 'text';
      } else {
        passInput.type = 'password';
      }
    }

    function handleLoginSubmit(e) {
      e.preventDefault();
      const btn = document.getElementById('btn-login');
      const alertBox = document.getElementById('login-alert');

      btn.disabled = true;
      btn.innerText = 'กำลังเข้าสู่ระบบ...';

      let userData = {};
      if (currentRole === 'staff') {
        userData = {
          name: 'อาจารย์นิษฐเนตร์ ณัฏฐกุลนันท์',
          studentId: 'ajarn.nittanate',
          role: 'staff',
          roleName: 'อาจารย์ / เจ้าหน้าที่คณะ (Staff)',
          badge: 'อาจารย์ประจำ • DIT RSU',
          initials: 'นิ',
          faculty: 'วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี',
          major: 'อาจารย์ที่ปรึกษาโครงงาน DIT204',
          email: 'nittanate.n@rsu.ac.th',
          color: 'from-amber-500 to-orange-700'
        };
      } else if (currentRole === 'admin') {
        userData = {
          name: 'ผู้ดูแลระบบ DIT Lost & Found',
          studentId: 'admin.dit',
          role: 'admin',
          roleName: 'ผู้ดูแลระบบสูงสุด (System Admin)',
          badge: 'Admin • IT Dept',
          initials: 'แอด',
          faculty: 'สำนักงานเทคโนโลยีสารสนเทศ',
          major: 'ศูนย์ควบคุมและบริหารระบบ Lost & Found',
          email: 'admin.dit@rsu.ac.th',
          color: 'from-purple-600 to-indigo-800'
        };
      } else {
        userData = {
          name: 'นายสิริเดช เกตานนท์',
          studentId: '6804130',
          role: 'student',
          roleName: 'นักศึกษา (Student)',
          badge: 'รหัส 6804130 • DIT RSU',
          initials: 'สิ',
          faculty: 'วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี',
          major: 'นวัตกรรมดิจิทัลและปัญญาประดิษฐ์',
          email: 's6804130@rsu.ac.th',
          color: 'from-sky-500 to-blue-700'
        };
      }

      try {
        localStorage.setItem('lost_found_user', JSON.stringify(userData));
      } catch (err) {}

      setTimeout(() => {
        alertBox.className = "mb-4 p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2";
        alertBox.innerHTML = '<svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg><span>เข้าสู่ระบบสำเร็จ! เข้าใช้งานในฐานะ ' + userData.name + ' (' + userData.roleName + ')</span>';
        alertBox.classList.remove('hidden');

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 800);
      }, 600);
    }
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'public', 'login.html'), htmlContent, 'utf8');
console.log('Successfully generated public/login.html!');

