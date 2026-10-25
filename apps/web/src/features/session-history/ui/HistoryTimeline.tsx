'use client';

import React from 'react';
import { SessionData } from '@/shared/types';

interface HistoryTimelineProps {
  sessions: SessionData[];
  selectedId: string | null;
  onSelectSession: (id: string) => void;
  onToggleBookmark: (id: string, currentPinned: boolean) => void;
}

/**
 * 타임라인 형태의 세션 히스토리 목록 컴포넌트
 */
export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({
  sessions,
  selectedId,
  onSelectSession,
  onToggleBookmark,
}) => {
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-[#0a0e18]/60 border border-white/[0.06] select-none">
        <span className="material-symbols-outlined text-[36px] text-slate-600 mb-2">
          folder_off
        </span>
        <p className="font-['Space_Grotesk'] text-sm text-slate-400 font-semibold">
          보관된 대화 세션이 없습니다.
        </p>
        <span className="font-mono text-xs text-slate-600 mt-1">
          새 세션을 시작하여 작전 프로토콜을 기록하십시오.
        </span>
      </div>
    );
  }

  // 오늘, 어제, 이전 기록 그룹핑
  const now = new Date();
  const todayStr = now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  const groups: { [key: string]: SessionData[] } = {
    오늘: [],
    어제: [],
    '이전 기록': [],
  };

  sessions.forEach((s) => {
    const d = new Date(s.updatedAt).toDateString();
    if (d === todayStr) {
      groups['오늘'].push(s);
    } else if (d === yesterdayStr) {
      groups['어제'].push(s);
    } else {
      groups['이전 기록'].push(s);
    }
  });

  return (
    <div className="flex flex-col gap-5 select-none">
      {Object.entries(groups).map(([label, list]) => {
        if (list.length === 0) return null;

        return (
          <div key={label} className="flex flex-col gap-2">
            <div className="px-1 pt-1">
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                {label} ({list.length})
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {list.map((session) => {
                const isSelected = selectedId === session.id;

                return (
                  <article
                    key={session.id}
                    onClick={() => onSelectSession(session.id)}
                    className={`relative group p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-[#1c1f2a] border-[#dc2626]/50 shadow-[0_0_16px_rgba(220,38,38,0.2)]'
                        : 'bg-[#111827]/80 hover:bg-[#171b26] border-white/[0.06]'
                    }`}
                  >
                    {/* 선택 시 좌측 붉은색 액센트 인디케이터 바 */}
                    {isSelected && (
                      <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r bg-[#dc2626] shadow-[0_0_8px_#dc2626]" />
                    )}

                    {/* 상단 메타 라인 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[#4cd7f6] bg-[#007d92]/20 px-1.5 py-0.2 rounded border border-[#007d92]/30">
                          #{session.id}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500">
                          {new Date(session.updatedAt).toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {/* 북마크 별표 버튼 */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(session.id, session.isPinned);
                        }}
                        className={`p-1 rounded hover:bg-white/[0.06] transition-colors cursor-pointer ${
                          session.isPinned
                            ? 'text-[#ffb95f]'
                            : 'text-slate-600 hover:text-slate-400'
                        }`}
                        title={session.isPinned ? '북마크 해제' : '중요 북마크 추가'}
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{
                            fontVariationSettings: session.isPinned ? "'FILL' 1" : "'FILL' 0",
                          }}
                        >
                          star
                        </span>
                      </button>
                    </div>

                    {/* 세션 제목 */}
                    <h2
                      className={`font-['Space_Grotesk'] text-sm font-semibold truncate transition-colors ${
                        isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {session.title}
                    </h2>

                    {/* 요약문 또는 내용 프리뷰 */}
                    {session.summary && (
                      <p className="font-sans text-xs text-slate-400 line-clamp-1">
                        {session.summary}
                      </p>
                    )}

                    {/* 하단 뱃지: 메시지 수, 모델 */}
                    <div className="flex items-center gap-3 pt-1 text-[10px] font-mono text-slate-500">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">forum</span>
                        {session.messageCount} 메시지
                      </span>
                      <span>·</span>
                      <span className="uppercase text-slate-400">
                        {session.model === 'gemini-3.8-flash' ? 'QUANTUM' : 'LITE'}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
