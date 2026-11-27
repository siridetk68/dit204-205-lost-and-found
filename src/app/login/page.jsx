'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Lock, Mail, User, ShieldCheck, GraduationCap, ArrowLeft, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { STUDENT_PROFILE } from '@/data/initialItems';

export default function LoginPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState(STUDENT_PROFILE.studentId);
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student'); // 'student', 'staff', 'admin'
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ type: '', message: '' });

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, password }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        setLoading(false);
        setNotification({
          type: 'error',
          message: result.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
        });
        return;
      }

      const apiUser = result.data || {};
      const userData = {
        ...apiUser,
        loginTime: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('lost_found_user', JSON.stringify(userData));
      }

      setLoading(false);
      setNotification({
        type: 'success',
        message: 'เข้าสู่ระบบสำเร็จ! กำลังนำท่านเข้าสู่ระบบ Lost & Found...',
      });

      setTimeout(() => {
        router.push('/');
      }, 600);
    } catch (err) {
      setLoading(false);
      setNotification({
        type: 'error',
        message: 'ไม่สามารถเชื่อมต่อระบบยืนยันตัวตนได้ กรุณาลองใหม่อีกครั้ง',
      });
    }
  };

  const setDemoAccount = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'student') {
      setStudentId('6804130');
      setPassword('student2026');
    } else if (selectedRole === 'staff') {
      setStudentId('ajarn.nittanate');
      setPassword('staffPass2026');
    } else {
      setStudentId('admin.dit');
      setPassword('adminSecurePass');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background ambient decorative blurs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none translate-y-1/2"></div>

      {/* Top back button */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับไปยังหน้าหลัก (Back to Home)</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        
        {/* Card Header Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/30 mb-3">
            <Search className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Lost & Found
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 rounded-md border border-blue-200">
              IT DEPT
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            ระบบยืนยันตัวตนนศ.และบุคลากร • มหาวิทยาลัยรังสิต (DIT204)
          </p>
        </div>

        {/* Main Login Form Box */}
        <div className="bg-white py-8 px-6 shadow-card rounded-3xl border border-slate-200/90 sm:px-10 relative">
          
          {/* Role Selector Tabs */}
          <div className="mb-6">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              เข้าใช้งานในฐานะ (Select Role)
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setDemoAccount('student')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  role === 'student'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                👨‍🎓 นักศึกษา
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('staff')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  role === 'staff'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                👩‍🏫 อาจารย์
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('admin')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  role === 'admin'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🛡️ ผู้ดูแล
              </button>
            </div>
          </div>

          {/* Feedback Notification */}
          {notification.message && (
            <div
              className={`mb-5 p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                notification.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span>{notification.message}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Student ID / Username */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {role === 'student' ? 'รหัสนักศึกษา (Student ID)' : 'ชื่อผู้ใช้ / รหัสบุคลากร'}
              </label>
              <div className="relative rounded-xl shadow-inner">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder={role === 'student' ? 'เช่น 6804130' : 'username'}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  รหัสผ่าน (Password)
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('สำหรับทดสอบในรายวิชา DIT204 สามารถเข้าใช้งานด้วยรหัสผ่านจำลองได้ทันทีครับ'); }} className="text-[11px] font-semibold text-blue-600 hover:underline">
                  ลืมรหัสผ่าน?
                </a>
              </div>
              <div className="relative rounded-xl shadow-inner">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 text-blue-600" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-600 font-medium">จดจำการเข้าสู่ระบบ</span>
              </label>

              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SSL Secured</span>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ (Sign In)'}</span>
            </button>

          </form>

          {/* Quick Demo Credentials Footer */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              บัญชีทดสอบสำหรับอาจารย์ผู้ประเมิน (Demo Credentials)
            </span>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left text-[11px] text-slate-600 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">👨‍🎓 นักศึกษา:</span>
                <span className="font-mono text-blue-700">6804130 / student2026</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">👩‍🏫 อาจารย์ (Staff):</span>
                <span className="font-mono text-amber-700">ajarn.nittanate / staffPass2026</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">🛡️ ผู้ดูแล (Admin):</span>
                <span className="font-mono text-purple-700">admin.dit / adminSecurePass</span>
              </div>
            </div>
          </div>

        </div>

        {/* Academic Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี มหาวิทยาลัยรังสิต <br />
          วิชา DIT204 Information System Project Management
        </p>

      </div>
    </div>
  );
}

