'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  onNewSession?: () => void;
}

/**
 * 데스크톱 좌측 사이버네틱 HUD 사이드바 패널
 */
export const Sidebar: React.FC<SidebarProps> = ({ onNewSession }) => {
  const pathname = usePathname();

  const navItems = [
    {
      label: '대화 워크스페이스',
      href: '/',
      icon: 'terminal',
    },
    {
      label: '히스토리 로그',
      href: '/history',
      icon: 'history_toggle_off',
    },
    {
      label: '시스템 설정',
      href: '/settings',
      icon: 'tune',
    },
  ];

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-[#0a0e18]/90 backdrop-blur-xl border-r border-white/[0.06] z-50 flex-col justify-between py-6 px-4 select-none">
      <div className="flex flex-col gap-6">
        {/* 상단 브랜딩 헤더 */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-[#dc2626] shadow-[0_0_12px_#dc2626] animate-pulse" />
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] text-[15px] font-bold uppercase tracking-wider text-slate-100">
                JAVISOR
              </span>
              <span className="font-mono text-[9px] text-[#4cd7f6] tracking-widest uppercase">
                STARK HUD v8.5
              </span>
            </div>
          </div>
          <div className="px-1.5 py-0.5 rounded bg-[#262a35] border border-white/10">
            <span className="font-mono text-[10px] text-[#ffb95f] font-semibold uppercase">
              MK-85
            </span>
          </div>
        </div>

        {/* 새 프로토콜(세션) 생성 버튼 */}
        <div className="px-1">
          <button
            onClick={onNewSession}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#dc2626] hover:bg-[#b91c1c] text-white font-['Space_Grotesk'] text-xs font-semibold uppercase tracking-wider shadow-[0_0_16px_rgba(220,38,38,0.35)] hover:shadow-[0_0_24px_rgba(220,38,38,0.6)] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            새 프로토콜
          </button>
        </div>

        {/* 메인 내비게이션 링크 목록 */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase ${
                  isActive
                    ? 'bg-[#262a35] text-[#ffb4ab] border-l-2 border-[#dc2626] shadow-[inset_0_0_12px_rgba(220,38,38,0.15)]'
                    : 'text-slate-400 hover:bg-[#1c1f2a] hover:text-slate-200'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    isActive ? 'text-[#ff4444]' : 'text-slate-400'
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 하단 텔레메트리 상태 및 유저 정보 */}
      <div className="flex flex-col gap-3 px-1">
        {/* 아크 리액터 파워 게이지 */}
        <div className="p-3 rounded-lg bg-[#171b26] border border-white/[0.04] flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">ARC REACTOR</span>
            <span className="text-[#4cd7f6] font-semibold">98.4%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#313540] overflow-hidden">
            <div className="h-full bg-[#4cd7f6] w-[98.4%] shadow-[0_0_8px_#4cd7f6]" />
          </div>
          <div className="flex items-center justify-between font-mono text-[10px] pt-1 text-slate-400">
            <span>CORE STATUS</span>
            <span className="text-[#ffb95f] flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb95f] animate-ping" />
              ONLINE
            </span>
          </div>
        </div>

        {/* 사용자 프로필 및 시스템 세션 상태 */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#ffb4ab] text-[#690005] font-bold flex items-center justify-center text-xs">
              TS
            </div>
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] text-xs font-semibold text-slate-200">
                T. STARK
              </span>
              <span className="font-mono text-[9px] text-slate-500 uppercase">
                ADMIN CLEARANCE
              </span>
            </div>
          </div>
          <span
            className="material-symbols-outlined text-slate-500 text-[18px] hover:text-[#ff4444] cursor-pointer transition-colors"
            title="시스템 로그아웃/종료"
          >
            power_settings_new
          </span>
        </div>
      </div>
    </aside>
  );
};
