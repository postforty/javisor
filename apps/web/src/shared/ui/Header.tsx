'use client';

import React from 'react';

interface HeaderProps {
  onNewSession?: () => void;
  activeModel?: string;
  isGenerating?: boolean;
}

/**
 * 상단 HUD 상태 바 및 공통 헤더 컴포넌트
 */
export const Header: React.FC<HeaderProps> = ({
  onNewSession,
  activeModel = 'gemini-3.8-flash',
  isGenerating = false,
}) => {
  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-[#08090C]/80 backdrop-blur-xl border-b border-white/[0.06] z-40 px-4 md:px-8 select-none">
      <div className="h-full w-full flex items-center justify-between">
        {/* 좌측: 모바일 로고 및 시스템 텔레메트리 상태 */}
        <div className="flex items-center gap-3">
          {/* 모바일 전용 로고 */}
          <div className="md:hidden flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#dc2626] shadow-[0_0_8px_#dc2626]" />
            <span className="font-['Space_Grotesk'] text-sm font-bold uppercase tracking-wider text-slate-100">
              JAVISOR
            </span>
            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#1c1f2a] text-[#ffb4ab] border border-red-500/30">
              MK-85
            </span>
          </div>

          {/* 데스크톱 상태 인디케이터 */}
          <div className="hidden md:flex items-center gap-2.5 font-mono text-xs text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5 text-[#ff4444] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4444] animate-ping" />
              SYS::READY
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300">ACTIVE PROTOCOL</span>
          </div>
        </div>

        {/* 우측: 모델 상태 뱃지 및 액션 컨트롤 */}
        <div className="flex items-center gap-2.5">
          {/* 현재 연결된 엔진 상태 배지 */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#171b26] border border-white/[0.08]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isGenerating
                  ? 'bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6] animate-pulse'
                  : 'bg-[#ffb95f]'
              }`}
            />
            <span className="font-mono text-[10px] text-slate-300 tracking-wider uppercase">
              {activeModel === 'gemini-3.8-flash' ? 'MK-85 QUANTUM' : 'ULTRA-LITE CORE'}
            </span>
          </div>

          {/* 새 세션 생성 버튼 (모바일 및 컴팩트) */}
          <button
            onClick={onNewSession}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121620] hover:bg-[#181e2b] text-slate-200 hover:text-white shadow-[0_2px_10px_rgba(0,0,0,0.4)] active:scale-95 transition-all text-[11px] font-mono tracking-wider border border-white/10 hover:border-[#ffb95f]/40 cursor-pointer"
          >
            {/* 확대된 + 기호 */}
            <span className="text-[15px] font-bold leading-none text-slate-100 select-none">
              +
            </span>
            <span className="font-medium">NEW SESSION</span>
          </button>
        </div>
      </div>
    </header>
  );
};
