'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import HeroSearch from '@/components/HeroSearch';
import CategoryChips from '@/components/CategoryChips';
import ItemGrid from '@/components/ItemGrid';
import ReportModal from '@/components/ReportModal';
import ClaimModal from '@/components/ClaimModal';
import DetailModal from '@/components/DetailModal';
import StaffClaimReviewModal from '@/components/StaffClaimReviewModal';
import { INITIAL_ITEMS, INITIAL_CLAIMS } from '@/data/initialItems';
import { ShieldCheck } from 'lucide-react';

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [filterType, setFilterType] = useState('all'); // 'all', 'LOST', 'FOUND'
  const [activeTab, setActiveTab] = useState('all');

  // Modals state
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isStaffReviewOpen, setIsStaffReviewOpen] = useState(false);
  const [staffReviewFilterItem, setStaffReviewFilterItem] = useState(null);
  const [selectedItemForClaim, setSelectedItemForClaim] = useState(null);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState(null);
  const [claims, setClaims] = useState(INITIAL_CLAIMS);

  // Current active user role state
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      try {
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('lost_found_user');
          if (saved) {
            setCurrentUser(JSON.parse(saved));
          } else {
            setCurrentUser({
              role: 'student',
              name: 'นายสิริเดช เกตานนท์',
              studentId: '6804130',
              roleName: 'นักศึกษา (Student)',
              badge: 'รหัส 6804130 • DIT RSU'
            });
          }
        }
      } catch (e) {}
    };
    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  // Fetch items from API or fallback to INITIAL_ITEMS
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/items');
      if (res.ok) {
        const json = await res.json();
        setItems(json.data);
      } else {
        setItems(INITIAL_ITEMS);
      }
    } catch (e) {
      console.warn('Using client-side fallback items:', e);
      setItems(INITIAL_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats from API
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const json = await res.json();
        setStats(json.data);
      }
    } catch (e) {
      const total = items.length;
      const lookingForOwner = items.filter((i) => i.status === 'LOOKING_FOR_OWNER').length;
      const foundItems = items.filter((i) => i.status === 'FOUND_ITEM').length;
      const returnedItems = items.filter((i) => i.status === 'RETURNED').length;
      setStats({ total, lookingForOwner, foundItems, returnedItems });
    }
  };

  // Fetch claims from API (for Staff & Admin review)
  const fetchClaims = async () => {
    try {
      const res = await fetch('/api/claims');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data)) {
          setClaims(json.data);
        }
      }
    } catch (e) {
      console.warn('Using fallback claims:', e);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchClaims();
  }, []);

  useEffect(() => {
    fetchStats();
  }, [items]);

  // Category counts (count active items on main board, or returned items when viewing RETURNED tab)
  const categoryCounts = useMemo(() => {
    const baseItems =
      filterType === 'RETURNED'
        ? items.filter((item) => item.status === 'RETURNED')
        : items.filter((item) => item.status !== 'RETURNED');
    const counts = { all: baseItems.length };
    baseItems.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [items, filterType]);

  // Client-side filtering for instant UI responsiveness
  // Items with status === 'RETURNED' are hidden from the main board unless the user selects the 'RETURNED' history tab
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filterType === 'RETURNED') {
        if (item.status !== 'RETURNED') return false;
      } else {
        if (item.status === 'RETURNED') return false;
        if (filterType !== 'all' && item.type !== filterType) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesEnglish = item.englishTitle?.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesLoc = item.location.toLowerCase().includes(query);
        if (!matchesTitle && !matchesEnglish && !matchesDesc && !matchesLoc) {
          return false;
        }
      }

      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      if (selectedLocation !== 'all' && !item.location.includes(selectedLocation)) {
        return false;
      }

      return true;
    });
  }, [items, searchQuery, selectedCategory, selectedLocation, filterType]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setFilterType('all');
  };

  const handleScrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleItemCreated = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  const handleItemUpdated = (updatedItem) => {
    if (!updatedItem) return;
    setItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const handleClaimSubmitted = (newClaim) => {
    if (!newClaim) return;
    setClaims((prev) => [newClaim, ...prev]);
  };

  const handleTogglePin = async (itemId) => {
    const target = items.find((i) => i.id === itemId);
    if (!target) return;
    const nextPinned = !target.isPinned;
    const verifier = currentUser?.name || 'อาจารย์นิษฐเนตร์ ณัฏฐกุลนันท์ (Staff)';

    // Optimistic UI update
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, isPinned: nextPinned, verifiedBy: verifier }
          : item
      )
    );

    try {
      const res = await fetch(`/api/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: nextPinned, verifiedBy: verifier }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) handleItemUpdated(json.data);
      }
    } catch (e) {
      console.error('Failed to persist pin state:', e);
    }
  };

  const handleApproveClaim = async (claimId, itemId) => {
    const reviewer = currentUser?.name || 'อาจารย์นิษฐเนตร์ ณัฏฐกุลนันท์';
    // Optimistic update
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? { ...c, status: 'APPROVED', verifiedBy: reviewer, resolvedAt: 'อนุมัติเมื่อสักครู่' }
          : c
      )
    );
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, status: 'RETURNED', claimStatus: 'approved', verifiedBy: reviewer }
          : item
      )
    );

    try {
      const res = await fetch(`/api/claims/${claimId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED', verifiedBy: reviewer }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data?.claims) setClaims(json.data.claims);
        if (json.data?.updatedItem) handleItemUpdated(json.data.updatedItem);
      }
    } catch (e) {
      console.error('Failed to approve claim:', e);
    }
  };

  const handleRejectClaim = async (claimId, itemId) => {
    const reviewer = currentUser?.name || 'อาจารย์นิษฐเนตร์ ณัฏฐกุลนันท์';
    // Optimistic update
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? { ...c, status: 'REJECTED', verifiedBy: reviewer, resolvedAt: 'ปฏิเสธเมื่อสักครู่' }
          : c
      )
    );
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, claimStatus: 'rejected', verifiedBy: reviewer }
          : item
      )
    );

    try {
      const res = await fetch(`/api/claims/${claimId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED', verifiedBy: reviewer }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data?.claims) setClaims(json.data.claims);
        if (json.data?.updatedItem) handleItemUpdated(json.data.updatedItem);
      }
    } catch (e) {
      console.error('Failed to reject claim:', e);
    }
  };

  const handleDeleteItem = async (item) => {
    if (!item?.id) return;
    if (typeof window !== 'undefined' && !window.confirm(`ยืนยันการลบประกาศ "${item.title}" ออกจากระบบใช่หรือไม่?`)) {
      return;
    }

    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setClaims((prev) => prev.filter((c) => c.itemId !== item.id));

    try {
      await fetch(`/api/items/${item.id}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Failed to delete item:', e);
    }
  };

  const pendingClaimsCount = claims.filter((c) => c.status === 'PENDING').length;
  const isStaffOrAdmin = currentUser?.role === 'staff' || currentUser?.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-x-clip">
      
      {/* 1. Navigation Bar */}
      <Navbar
        onOpenReport={() => setIsReportOpen(true)}
        onScrollToSection={handleScrollToSection}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Role-Based Indicator Banner (สำหรับอาจารย์ตรวจประเมิน 3 หน้าจอ 3 บทบาท) */}
      {currentUser && (
        <div className={`border-b text-xs py-2 px-4 transition-all ${
          currentUser.role === 'admin'
            ? 'bg-purple-900 text-purple-100 border-purple-800'
            : (currentUser.role === 'staff'
                ? 'bg-amber-900 text-amber-100 border-amber-800'
                : 'bg-slate-900 text-slate-300 border-slate-800')
        }`}>
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
              currentUser.role === 'admin'
                ? 'bg-purple-500 text-white'
                : (currentUser.role === 'staff' ? 'bg-amber-500 text-slate-900' : 'bg-blue-600 text-white')
            }`}>
              {currentUser.role === 'admin' ? '🛡️ Admin Role' : (currentUser.role === 'staff' ? '🏫 Staff Role' : '🎓 Student Role')}
            </span>
            <span className="font-semibold text-white">
              {currentUser.name}
            </span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-[11px] text-slate-300 hidden sm:inline">
              {currentUser.role === 'admin'
                ? 'สิทธิ์: ผู้ดูแลระบบสูงสุด • จัดการฐานข้อมูล TiDB Cloud ครบ 5 ตาราง และควบคุมความปลอดภัย'
                : (currentUser.role === 'staff'
                    ? 'สิทธิ์: อาจารย์/เจ้าหน้าที่ • ตรวจสอบคำขอคืนของ (Ownership Verification) และอนุมัติการส่งมอบ'
                    : 'สิทธิ์: นักศึกษา • ค้นหาของหาย, โพสต์แจ้งของหาย/พบของ (REQ 01), ยื่นขอรับของคืน (REQ 03)')}
            </span>
          </div>
        </div>
      )}

      {/* 2. Hero / Search Section */}
      <HeroSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        filterType={filterType}
        setFilterType={setFilterType}
        stats={stats}
        onResetFilters={handleResetFilters}
      />

      {/* 3. Main Content Section (Items Feed) */}
      <main id="items-feed" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Quick Category Chips & Test Suite Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <CategoryChips
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => setSelectedCategory(catId)}
            counts={categoryCounts}
          />

          {isStaffOrAdmin && (
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                onClick={() => {
                  setStaffReviewFilterItem(null);
                  setIsStaffReviewOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all"
                title="ตรวจสอบหลักฐานและอนุมัติคำขอรับของคืนทั้งหมด"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>ตรวจสอบคำขอรับคืน ({pendingClaimsCount})</span>
              </button>
            </div>
          )}
        </div>

        {/* Items Grid */}
        <ItemGrid
          items={filteredItems}
          loading={loading}
          onViewDetails={(item) => setSelectedItemForDetail(item)}
          onClaimItem={(item) => setSelectedItemForClaim(item)}
          onOpenReport={() => setIsReportOpen(true)}
          currentUser={currentUser}
          onTogglePin={handleTogglePin}
          onOpenStaffReview={(item) => {
            setStaffReviewFilterItem(item || null);
            setIsStaffReviewOpen(true);
          }}
          onDeleteItem={handleDeleteItem}
        />

      </main>

      {/* Interactive Modals */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onItemCreated={handleItemCreated}
      />

      <ClaimModal
        item={selectedItemForClaim}
        isOpen={!!selectedItemForClaim}
        onClose={() => setSelectedItemForClaim(null)}
        onItemUpdated={handleItemUpdated}
        onClaimSubmitted={handleClaimSubmitted}
      />

      <DetailModal
        item={selectedItemForDetail}
        isOpen={!!selectedItemForDetail}
        onClose={() => setSelectedItemForDetail(null)}
        onClaimItem={(item) => {
          setSelectedItemForClaim(item);
        }}
        currentUser={currentUser}
        itemClaimsCount={
          selectedItemForDetail
            ? claims.filter((c) => c.itemId === selectedItemForDetail.id).length
            : 0
        }
        itemPendingClaimsCount={
          selectedItemForDetail
            ? claims.filter((c) => c.itemId === selectedItemForDetail.id && c.status === 'PENDING').length
            : 0
        }
        onOpenItemClaims={(item) => {
          setStaffReviewFilterItem(item);
          setIsStaffReviewOpen(true);
        }}
      />

      <StaffClaimReviewModal
        isOpen={isStaffReviewOpen}
        onClose={() => {
          setIsStaffReviewOpen(false);
          setStaffReviewFilterItem(null);
        }}
        claims={claims}
        onApproveClaim={handleApproveClaim}
        onRejectClaim={handleRejectClaim}
        filterItem={staffReviewFilterItem}
        onClearFilter={() => setStaffReviewFilterItem(null)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600 font-medium">
            <span>Lost & Found IT Department</span>
            <span>•</span>
            <span>วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี มหาวิทยาลัยรังสิต</span>
            <span>•</span>
            <span>DIT204 Information System Project Management</span>
          </div>
          <p className="text-slate-400">
            ระบบต้นแบบพัฒนาโดย 6804130 นายสิริเดช เกตานนท์ สำหรับส่งอาจารย์นิษฐเนตร์ ณัฏฐกุลนันท์ และ ผศ.ดร.กานต์ ยงศิริวิทย์
          </p>
        </div>
      </footer>

    </div>
  );
}
