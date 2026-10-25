'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * 모바일 화면 하단 3탭 네비게이션 컴포넌트
 */
export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  const navs = [
    { label: '대화', href: '/', icon: 'chat_bubble' },
    { label: '히스토리', href: '/history', icon: 'history' },
    { label: '설정', href: '/settings', icon: 'tune' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-[#08090C]/90 backdrop-blur-2xl border-t border-white/[0.08] z-50 flex items-center justify-around px-4 select-none">
      {navs.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 transition-all ${
              isActive ? 'text-[#ff4444] font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                isActive ? 'drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : ''
              }`}
            >
              {item.icon}
            </span>
            <span className="font-mono text-[10px] tracking-wider uppercase">{item.label}</span>
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-[#fbbf24] shadow-[0_0_4px_#fbbf24]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};
