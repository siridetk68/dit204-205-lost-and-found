'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, XCircle, AlertCircle, User, Phone, HelpCircle, Check, KeyRound, Building2 } from 'lucide-react';

export default function StaffClaimReviewModal({
  isOpen,
  onClose,
  claims,
  onApproveClaim,
  onRejectClaim,
  filterItem = null,
  onClearFilter,
}) {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'history'

  if (!isOpen) return null;

  const scopedClaims = filterItem ? claims.filter((c) => c.itemId === filterItem.id) : claims;
  const pendingClaims = scopedClaims.filter((c) => c.status === 'PENDING');
  const resolvedClaims = scopedClaims.filter((c) => c.status !== 'PENDING');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-amber-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/25">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-white/25 text-white">
                  Staff Management
                </span>
                <span className="text-xs text-amber-100 font-medium">อาจารย์นิษฐเนตร์ ณัฏฐกุลนันท์</span>
              </div>
              <h3 className="text-lg font-black tracking-tight text-white mt-0.5">
                {filterItem
                  ? `ตรวจสอบสิทธิ์เฉพาะรายการ: ${filterItem.title}`
                  : 'ตรวจสอบและอนุมัติคำขอรับของคืนทั้งหมด (Claim Review)'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-header Tabs & Count */}
        <div className="bg-amber-50/80 border-b border-amber-100 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'pending'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-amber-100/60'
              }`}
            >
              <span>รอดำเนินการ (Pending)</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === 'pending' ? 'bg-amber-800 text-white' : 'bg-rose-100 text-rose-700'
              }`}>
                {pendingClaims.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-amber-100/60'
              }`}
            >
              <span>ประวัติการตรวจสอบ ({resolvedClaims.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {filterItem && onClearFilter ? (
              <button
                onClick={onClearFilter}
                className="px-3 py-1 rounded-lg text-[11px] font-bold bg-white text-amber-800 border border-amber-300 hover:bg-amber-100 transition-colors"
              >
                ดูคำร้องทั้งหมด ({claims.length})
              </button>
            ) : (
              <span className="text-[11px] text-amber-800 font-medium hidden sm:inline">
                จุดรับมอบ: ห้องธุรการสาขา DIT (อาคาร 1 ชั้น 1)
              </span>
            )}
          </div>
        </div>

        {/* Modal Body - Claim List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
          {activeTab === 'pending' ? (
            pendingClaims.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-800">ไม่มีคำขอรับของคืนที่ค้างอยู่</h4>
                <p className="text-xs text-slate-500 mt-1">
                  คำขอทั้งหมดได้รับการตรวจสอบและดำเนินการส่งมอบเรียบร้อยแล้ว
                </p>
              </div>
            ) : (
              pendingClaims.map((claim) => (
                <div 
                  key={claim.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-amber-300 transition-colors"
                >
                  {/* Item & Claimant Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {claim.itemId}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 mt-1">
                        {claim.itemTitle}
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      ยื่นเมื่อ: {claim.submittedAt}
                    </span>
                  </div>

                  {/* Claimant Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-700">
                      <User className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>ผู้ยื่นขอ: <strong>{claim.claimantName}</strong> (รหัส {claim.claimantId})</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>เบอร์ติดต่อ: <strong>{claim.claimantContact}</strong></span>
                    </div>
                  </div>

                  {/* Secret Verification Proof Comparison */}
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                        <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                        <span>คำถามลับยืนยันความเป็นเจ้าของ (Secret Question):</span>
                      </div>
                      <p className="text-slate-700 pl-5">{claim.secretQuestion}</p>
                      
                      <div className="mt-2 pt-2 border-t border-amber-200/60 pl-5 flex items-start gap-1.5">
                        <span className="font-bold text-emerald-800 shrink-0">คำเฉลยในระบบ:</span>
                        <span className="text-emerald-900 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300">
                          {claim.secretClue}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/80">
                      <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
                        <HelpCircle className="w-3.5 h-3.5 text-blue-700" />
                        <span>คำตอบ/หลักฐานที่นักศึกษากรอกมา:</span>
                      </div>
                      <p className="text-slate-800 font-medium pl-5 bg-white p-2 rounded-lg border border-blue-100">
                        "{claim.proofAnswer}"
                      </p>
                    </div>
                  </div>

                  {/* Staff Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>จุดส่งมอบ: {claim.custodyLocation}</span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => onRejectClaim(claim.id, claim.itemId)}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>ปฏิเสธ (Reject)</span>
                      </button>

                      <button
                        onClick={() => onApproveClaim(claim.id, claim.itemId)}
                        className="flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>อนุมัติการส่งมอบ (Approve)</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            resolvedClaims.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 text-xs text-slate-500">
                ยังไม่มีประวัติการตรวจสอบ
              </div>
            ) : (
              resolvedClaims.map((claim) => (
                <div 
                  key={claim.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{claim.itemTitle}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        claim.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {claim.status === 'APPROVED' ? 'อนุมัติแล้ว' : 'ปฏิเสธ'}
                      </span>
                    </div>
                    <div className="text-slate-500 mt-1">
                      ผู้รับ: {claim.claimantName} ({claim.claimantId}) • ตรวจสอบโดย: {claim.verifiedBy || 'อาจารย์นิษฐเนตร์'}
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    {claim.resolvedAt || claim.submittedAt}
                  </span>
                </div>
              ))
            )
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-white px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            ระบบบริหารจัดการจุดรับคืนสิ่งของ • DIT204 RSU
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            ปิดหน้าต่าง (Close)
          </button>
        </div>
      </div>
    </div>
  );
}
