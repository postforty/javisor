'use client';

import React from 'react';

interface HistorySearchFilterProps {
  totalCount: number;
  activeTab: 'all' | 'pinned' | 'archive';
  onChangeTab: (tab: 'all' | 'pinned' | 'archive') => void;
  searchQuery: string;
  onChangeSearch: (query: string) => void;
}

/**
 * 히스토리 상단 검색창 및 탭 필터 컴포넌트
 */
export const HistorySearchFilter: React.FC<HistorySearchFilterProps> = ({
  totalCount,
  activeTab,
  onChangeTab,
  searchQuery,
  onChangeSearch,
}) => {
  return (
    <section className="flex flex-col gap-4 pt-2 select-none">
      {/* 헤더 타이틀 및 세션 카운트 */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-3">
          <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-slate-100 tracking-tight">
            세션 히스토리
          </h1>
          <span className="font-mono text-xs text-slate-400">
            총 {totalCount}개 작전 세션 보관됨
          </span>
        </div>
      </div>

      {/* 탭 필터 & 실시간 검색창 */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-1">
        {/* 탭 버튼 그룹 */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#121620] border border-white/[0.06]">
          <button
            type="button"
            onClick={() => onChangeTab('all')}
            className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#dc2626] text-white shadow-[0_0_8px_#dc2626]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            전체
          </button>
          <button
            type="button"
            onClick={() => onChangeTab('pinned')}
            className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'pinned'
                ? 'bg-[#ffb95f] text-[#472a00] shadow-[0_0_8px_#ffb95f]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">star</span>
            중요 보관
          </button>
          <button
            type="button"
            onClick={() => onChangeTab('archive')}
            className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'archive'
                ? 'bg-[#4cd7f6] text-[#003640] shadow-[0_0_8px_#4cd7f6]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            보관함
          </button>
        </div>

        {/* 검색 인풋 */}
        <div className="relative w-full md:max-w-xs flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-slate-500 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder="세션 제목, 프롬프트 검색..."
            className="w-full bg-[#121620] text-slate-100 placeholder:text-slate-500 font-sans text-xs pl-9 pr-8 py-2 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#dc2626]/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onChangeSearch('')}
              className="absolute right-2.5 text-slate-400 hover:text-white cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
