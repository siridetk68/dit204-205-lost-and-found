'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  KeyRound,
  Shield,
  Save,
} from 'lucide-react';

const ROLE_STYLES = {
  admin: { label: 'Admin (ผู้ดูแลระบบ)', cls: 'bg-purple-100 text-purple-800 border-purple-200' },
  staff: { label: 'Staff (อาจารย์/เจ้าหน้าที่)', cls: 'bg-amber-100 text-amber-800 border-amber-200' },
  student: { label: 'Student (นักศึกษา)', cls: 'bg-blue-100 text-blue-800 border-blue-200' },
};

const EMPTY_FORM = {
  studentId: '',
  password: '',
  name: '',
  email: '',
  role: 'student',
  major: 'นวัตกรรมดิจิทัลและปัญญาประดิษฐ์',
  phone: '',
};

export default function AdminUserManager({ currentUser, onUsersChanged }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Modal state (Add / Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  const fetchUsers = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const res = await fetch('/api/users', {
        headers: { 'x-user-role': 'admin' },
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setUsers(json.data?.users || []);
      }
    } catch (e) {
      console.error('Failed to load users:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const q = searchTerm.toLowerCase();
    return users.filter(
      (u) =>
        (u.studentId || '').toLowerCase().includes(q) ||
        (u.name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.role || '').toLowerCase().includes(q)
    );
  }, [users, searchTerm]);

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setShowFormPassword(true);
    setFeedback({ type: '', text: '' });
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      studentId: user.studentId || '',
      password: user.password || '',
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'student',
      major: user.major || '',
      phone: user.phone || '',
    });
    setShowFormPassword(true);
    setFeedback({ type: '', text: '' });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', text: '' });

    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'admin',
        },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'บันทึกข้อมูลไม่สำเร็จ');
      }

      setUsers(json.data?.users || []);
      setModalOpen(false);
      setFeedback({
        type: 'success',
        text: editingUser
          ? `อัปเดตบัญชี "${form.studentId}" เรียบร้อยแล้ว`
          : `เพิ่มบัญชีผู้ใช้ "${form.studentId}" ลง TiDB Cloud เรียบร้อยแล้ว`,
      });
      if (onUsersChanged) onUsersChanged();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user) => {
    if (
      typeof window !== 'undefined' &&
      !window.confirm(`ยืนยันการลบบัญชี "${user.studentId}" (${user.name}) ออกจากฐานข้อมูลใช่หรือไม่?`)
    ) {
      return;
    }

    setFeedback({ type: '', text: '' });
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
        headers: { 'x-user-role': 'admin' },
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'ลบบัญชีไม่สำเร็จ');
      }
      setUsers(json.data?.users || []);
      setFeedback({ type: 'success', text: `ลบบัญชี "${user.studentId}" เรียบร้อยแล้ว` });
      if (onUsersChanged) onUsersChanged();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  if (!isAdmin) return null;

  return (
    <section
      id="user-management"
      className="bg-white rounded-2xl p-5 border border-purple-200/80 shadow-soft space-y-4 scroll-mt-20"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-purple-600" />
              <span>จัดการบัญชีผู้ใช้งาน (Username, Password &amp; Role)</span>
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-700 border border-purple-200">
              <Shield className="w-3 h-3" />
              <span>Admin Only</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ดูและจัดการข้อมูลผู้ใช้ทุกบัญชีในฐานข้อมูล TiDB Cloud (เพิ่มบัญชี, แก้ Username/รหัสผ่าน, เปลี่ยนบทบาท, หรือลบบัญชี)
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all whitespace-nowrap shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>เพิ่มบัญชีผู้ใช้</span>
        </button>
      </div>

      {/* Feedback alert */}
      {feedback.text && !modalOpen && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback({ type: '', text: '' })}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหา Username, ชื่อ, อีเมล หรือบทบาท..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          ทั้งหมด <strong className="text-slate-800">{filteredUsers.length}</strong> บัญชี
        </span>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-bold">Username / รหัส</th>
              <th className="px-4 py-3 font-bold">ชื่อ-นามสกุล &amp; อีเมล</th>
              <th className="px-4 py-3 font-bold">บทบาท</th>
              <th className="px-4 py-3 font-bold">Password</th>
              <th className="px-4 py-3 font-bold text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  กำลังโหลดรายชื่อบัญชีผู้ใช้จาก TiDB Cloud...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  ไม่พบบัญชีผู้ใช้ที่ตรงกับคำค้นหา
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const roleInfo = ROLE_STYLES[u.role] || ROLE_STYLES.student;
                const isPwdVisible = Boolean(visiblePasswords[u.id]);
                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {u.studentId}
                    </td>
                    <td className="px-4 py-3 min-w-[180px]">
                      <div className="font-bold text-slate-800">{u.name}</div>
                      <div className="text-[11px] text-slate-500">{u.email}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${roleInfo.cls}`}
                      >
                        {roleInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="inline-flex items-center gap-2 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                        <span className="font-mono text-xs text-slate-800">
                          {isPwdVisible ? u.password : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(u.id)}
                          className="text-slate-500 hover:text-purple-700 transition-colors"
                          title={isPwdVisible ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                        >
                          {isPwdVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(u)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>แก้ไข</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(u)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>ลบ</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <h4 className="font-extrabold text-sm sm:text-base">
                  {editingUser ? `แก้ไขบัญชีผู้ใช้: ${editingUser.studentId}` : 'เพิ่มบัญชีผู้ใช้งานใหม่'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {feedback.text && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{feedback.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Username / รหัสนักศึกษา *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.studentId}
                    onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                    placeholder="เช่น 6804130 หรือ Staffdit"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    รหัสผ่าน (Password) *
                  </label>
                  <div className="relative">
                    <input
                      type={showFormPassword ? 'text' : 'password'}
                      required
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="กรอกรหัสผ่าน"
                      className="w-full pl-3.5 pr-9 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:bg-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFormPassword(!showFormPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showFormPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อ-นามสกุล *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="เช่น นายสิริเดช เกตานนท์"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    บทบาท (Role) *
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:bg-white focus:outline-none"
                  >
                    <option value="student">Student (นักศึกษา)</option>
                    <option value="staff">Staff (อาจารย์/เจ้าหน้าที่)</option>
                    <option value="admin">Admin (ผู้ดูแลระบบ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    อีเมล (Email)
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="เว้นว่างเพื่อใช้ username@rsu.ac.th"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    สาขาวิชา / หน่วยงาน
                  </label>
                  <input
                    type="text"
                    value={form.major}
                    onChange={(e) => setForm({ ...form, major: e.target.value })}
                    placeholder="สาขาวิชา DIT"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="08x-xxx-xxxx"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
