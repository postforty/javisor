'use client';

import React from 'react';
import { Sidebar } from '@/shared/ui/Sidebar';
import { Header } from '@/shared/ui/Header';
import { MobileNav } from '@/shared/ui/MobileNav';
import { SettingsPanel } from '@/features/system-settings/ui/SettingsPanel';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#08090C] text-[#dfe2f1] flex flex-col md:flex-row">
      {/* 데스크톱 사이드바 */}
      <Sidebar />

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 w-full pt-20 pb-20 md:pb-12 px-4 md:px-8 max-w-4xl mx-auto flex flex-col">
          <SettingsPanel />
        </main>

        {/* 모바일 하단 탭 */}
        <MobileNav />
      </div>
    </div>
  );
}
