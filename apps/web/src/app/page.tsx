'use client';

import React from 'react';
import { Sidebar } from '@/shared/ui/Sidebar';
import { Header } from '@/shared/ui/Header';
import { MobileNav } from '@/shared/ui/MobileNav';
import { ChatWorkspace } from '@/features/chat-workspace/ui/ChatWorkspace';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#08090C] text-[#dfe2f1] flex flex-col md:flex-row">
      {/* 데스크톱 사이드바 */}
      <Sidebar />

      {/* 메인 뷰 컨테이너 (사이드바 폭만큼 패딩) */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* 상단 헤더 */}
        <Header />

        {/* 대화 워크스페이스 */}
        <main className="flex-1 flex flex-col">
          <ChatWorkspace />
        </main>

        {/* 모바일 하단 탭 내비게이션 */}
        <MobileNav />
      </div>
    </div>
  );
}
