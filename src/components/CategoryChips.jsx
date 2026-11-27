'use client';

import React from 'react';
import { Laptop, CreditCard, BookOpen, Briefcase, Grid } from 'lucide-react';
import { CATEGORIES } from '@/data/initialItems';

const ICON_MAP = {
  all: Grid,
  Electronics: Laptop,
  'Student IDs': CreditCard,
  Books: BookOpen,
  'Personal Items': Briefcase,
};

export default function CategoryChips({ selectedCategory, onSelectCategory, counts }) {
  return (
    <div className="py-4 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2.5 min-w-max pb-1">
        {CATEGORIES.map((cat) => {
          const IconComponent = ICON_MAP[cat.id] || Grid;
          const isSelected = selectedCategory === cat.id;
          const count = counts ? counts[cat.id] : null;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-[1.02]'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 shadow-soft'
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
              <span>{cat.label.split(' (')[0]}</span>
              {typeof count === 'number' && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
