'use client';

import React, { useState } from 'react';
import { X, Upload, PlusCircle, AlertCircle, CheckCircle, ShieldCheck, Link2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { CATEGORIES, LOCATIONS, STUDENT_PROFILE } from '@/data/initialItems';

export default function ReportModal({ isOpen, onClose, onItemCreated }) {
  const [formData, setFormData] = useState({
    type: 'FOUND', // 'LOST' or 'FOUND'
    title: '',
    englishTitle: '',
    category: 'Electronics',
    location: 'อาคาร 1 (IT Building)',
    locationDetail: '',
    description: '',
    contactName: STUDENT_PROFILE.name,
    contactTel: '089-xxx-4130',
    image: '',
    secretQuestion: '',
    secretClue: '',
  });

  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url'
  const [imageProcessing, setImageProcessing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Compress and convert selected image from computer/mobile into lightweight JPEG Data URL
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WEBP ฯลฯ)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('ไฟล์รูปภาพมีขนาดใหญ่เกิน 10MB กรุณาเลือกรูปที่เล็กลง');
      return;
    }

    setErrorMsg('');
    setImageProcessing(true);
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        try {
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let { width, height } = img;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.72);
          setFormData((prev) => ({ ...prev, image: compressedDataUrl }));
        } catch (err) {
          setErrorMsg('ไม่สามารถประมวลผลรูปภาพได้ กรุณาลองเลือกรูปอื่น');
        } finally {
          setImageProcessing(false);
        }
      };
      img.onerror = () => {
        setErrorMsg('ไม่สามารถอ่านไฟล์รูปภาพนี้ได้');
        setImageProcessing(false);
      };
      img.src = event.target?.result;
    };
    reader.onerror = () => {
      setErrorMsg('เกิดข้อผิดพลาดในการอ่านไฟล์');
      setImageProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setFormData((prev) => ({ ...prev, image: '' }));
    setUploadedFileName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.title.trim()) {
      setErrorMsg('กรุณาระบุชื่อสิ่งของ');
      return;
    }

    try {
      setSubmitting(true);
      const combinedLocation = formData.locationDetail.trim()
        ? `${formData.location} (${formData.locationDetail.trim()})`
        : formData.location;

      const payload = {
        ...formData,
        location: combinedLocation,
        image: formData.image || (formData.type === 'LOST' 
          ? 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'),
      };

      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || 'บันทึกข้อมูลไม่สำเร็จ');
      }

      setSuccessMsg('บันทึกประกาศสิ่งของสำเร็จแล้ว!');
      setTimeout(() => {
        onItemCreated(result.data);
        onClose();
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-900 to-blue-700 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-sky-300" />
              <h3 className="text-lg font-bold">แจ้งประกาศสิ่งของ (Report Item)</h3>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              สร้างรายการแจ้งของหาย หรือแจ้งของที่พบในมหาวิทยาลัย (REQ 01)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Type Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              ประเภทการแจ้ง (Item Type) *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, type: 'LOST' }))}
                className={`py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  formData.type === 'LOST'
                    ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-400/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>ฉันทำของหาย (Lost Item)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, type: 'FOUND' }))}
                className={`py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  formData.type === 'FOUND'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-400/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>ฉันเก็บของได้ (Found Item)</span>
              </button>
            </div>
          </div>

          {/* Item Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ชื่อสิ่งของ (ภาษาไทย) *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="เช่น หูฟังบลูทูธ Sony WH-1000XM4"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Item Title (English - Option)
              </label>
              <input
                type="text"
                name="englishTitle"
                value={formData.englishTitle}
                onChange={handleChange}
                placeholder="e.g. Wireless Noise-Cancelling Headphones"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                หมวดหมู่ (Category) *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
              >
                {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                อาคาร / สถานที่หลัก *
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
              >
                {LOCATIONS.filter((l) => l.id !== 'all').map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location detail */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              จุดที่พบ / รายละเอียดตำแหน่ง
            </label>
            <input
              type="text"
              name="locationDetail"
              value={formData.locationDetail}
              onChange={handleChange}
              placeholder="เช่น ชั้น 3 ห้อง Lab 1-302 โต๊ะด้านหลัง"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              รายละเอียดและตำหนิของสิ่งของ *
            </label>
            <textarea
              name="description"
              rows={3}
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="ระบุสี ลักษณะ ยี่ห้อ หรือข้อมูลประกอบที่เป็นประโยชน์..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
            ></textarea>
          </div>

          {/* Verification Clue for REQ 03 */}
          <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200/80 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>ระบบยืนยันความเป็นเจ้าของ (Ownership Verification - Doc REQ 03)</span>
            </div>
            <p className="text-[11px] text-blue-700 leading-relaxed">
              ตั้งคำถามหรือจุดสังเกตเฉพาะ เพื่อให้เจ้าของตัวจริงเท่านั้นที่ตอบได้ก่อนรับของคืน (ป้องกันคนแอบอ้าง)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                name="secretQuestion"
                value={formData.secretQuestion}
                onChange={handleChange}
                placeholder="คำถาม เช่น รูปบนพวงกุญแจ, วอลเปเปอร์?"
                className="w-full px-3 py-2 rounded-lg border border-blue-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="secretClue"
                value={formData.secretClue}
                onChange={handleChange}
                placeholder="คำตอบที่ถูกต้อง (เก็บเป็นความลับในระบบ)"
                className="w-full px-3 py-2 rounded-lg border border-blue-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Contact info & Image URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ชื่อผู้แจ้ง / ผู้ประสานงาน
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ช่องทางติดต่อ (เบอร์โทร / LINE ID)
              </label>
              <input
                type="text"
                name="contactTel"
                value={formData.contactTel}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Image Upload (Device/Mobile) or URL */}
          <div className="space-y-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>รูปภาพสิ่งของ (ใส่หรือไม่ใส่ก็ได้ มีภาพเริ่มต้นให้)</span>
              </label>

              <div className="inline-flex rounded-lg bg-slate-200/80 p-0.5 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
                    imageMode === 'upload'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>อัปโหลดจากเครื่อง/มือถือ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
                    imageMode === 'url'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Link2 className="w-3 h-3" />
                  <span>วางลิงก์ URL</span>
                </button>
              </div>
            </div>

            {imageMode === 'upload' ? (
              <div>
                <label className="flex flex-col items-center justify-center w-full py-4 px-4 border-2 border-dashed border-blue-200 rounded-xl bg-white hover:bg-blue-50/50 hover:border-blue-400 cursor-pointer transition-all text-center">
                  <Upload className="w-6 h-6 text-blue-500 mb-1.5" />
                  <span className="text-xs font-bold text-slate-700">
                    {imageProcessing
                      ? 'กำลังย่อขนาดและเตรียมรูปภาพ...'
                      : 'แตะเพื่อเลือกรูปจากเครื่อง หรือถ่ายรูปจากกล้องมือถือ'}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    รองรับ JPG, PNG, WEBP (ระบบจะย่อขนาดอัตโนมัติให้บันทึกได้เร็ว)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <input
                type="url"
                name="image"
                value={formData.image.startsWith('data:') ? '' : formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            )}

            {/* Image Preview */}
            {formData.image && (
              <div className="relative flex items-center gap-3 p-2.5 bg-white rounded-xl border border-slate-200">
                <img
                  src={formData.image}
                  alt="ตัวอย่างรูปสิ่งของ"
                  className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1 text-xs">
                  <div className="font-bold text-emerald-700 truncate">
                    {uploadedFileName || 'พร้อมแนบรูปภาพแล้ว'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {formData.image.startsWith('data:') ? 'อัปโหลดจากอุปกรณ์ (บีบอัดแล้ว)' : 'รูปภาพจาก URL'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                  title="ลบรูปภาพนี้"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              {submitting ? 'กำลังบันทึก...' : 'บันทึกประกาศ'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

