'use client';

import React from 'react';

interface QuickActionGridProps {
  onSelectAction: (prompt: string) => void;
}

export const QUICK_ACTIONS = [
  {
    code: '01 // DIAG',
    title: '시냅스 다이어그노스틱스',
    description: '슈트 신경망 무결성 및 리액터 98.4% 상태 전체 검진',
    prompt: '시냅스 다이어그노스틱스: MK-85 전신 코어 및 신경망 링크 무결성 검증을 시작하십시오.',
    icon: 'monitor_heart',
    color: 'text-[#ff4444]',
    hoverBorder: 'hover:border-[#dc2626]/40',
    hoverGlow: 'hover:shadow-[0_0_16px_rgba(220,38,38,0.25)]',
  },
  {
    code: '02 // TACT',
    title: '전술 브리핑 요약',
    description: '외부 센서 배열 데이터 동기화 및 24시간 위협 평가 리포트',
    prompt: '전술 브리핑 요약: 최근 24시간 감시 위성 및 센서 감지 이상 징후를 분석하여 보고하십시오.',
    icon: 'shield',
    color: 'text-[#ffb95f]',
    hoverBorder: 'hover:border-[#ffb95f]/40',
    hoverGlow: 'hover:shadow-[0_0_16px_rgba(255,185,95,0.2)]',
  },
  {
    code: '03 // CODE',
    title: '실시간 코드 분석',
    description: '나노 분자 조립 서브루틴 펌웨어 알고리즘 실시간 정적 검사',
    prompt: '실시간 코드 분석: 서브루틴 나노어셈블리 컴파일 에러 디버깅 및 최적화 코드를 제안하십시오.',
    icon: 'code_blocks',
    color: 'text-[#4cd7f6]',
    hoverBorder: 'hover:border-[#4cd7f6]/40',
    hoverGlow: 'hover:shadow-[0_0_16px_rgba(76,215,246,0.2)]',
  },
  {
    code: '04 // SCHED',
    title: '스케줄 & 미션 브리핑',
    description: '성층권 초음속 궤도 테스트 및 최고 보안 등급 미팅 타임라인',
    prompt: '스케줄 및 미션 브리핑: 오늘자 Stark 인더스트리 이사회 및 비행 테스트 일정을 정리하십시오.',
    icon: 'calendar_today',
    color: 'text-[#ffb4ab]',
    hoverBorder: 'hover:border-[#ffb4ab]/40',
    hoverGlow: 'hover:shadow-[0_0_16px_rgba(220,38,38,0.2)]',
  },
];

/**
 * 4종 선제적 퀵 액션 카드 그리드 컴포넌트
 */
export const QuickActionGrid: React.FC<QuickActionGridProps> = ({ onSelectAction }) => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action.code}
          type="button"
          onClick={() => onSelectAction(action.prompt)}
          className={`group flex flex-col text-left p-4 rounded-xl bg-[#0a0e18]/80 backdrop-blur-md border border-white/[0.06] ${action.hoverBorder} ${action.hoverGlow} transition-all cursor-pointer`}
        >
          <div className="flex items-center justify-between w-full mb-3">
            <div className={`w-7 h-7 rounded flex items-center justify-center bg-[#1c1f2a] ${action.color}`}>
              <span className="material-symbols-outlined text-[16px]">{action.icon}</span>
            </div>
            <span className="font-mono text-[10px] text-slate-400 group-hover:text-slate-200 transition-colors tracking-wider">
              {action.code}
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-sm font-semibold text-slate-100 mb-1 group-hover:text-white transition-colors">
            {action.title}
          </span>
          <span className="font-sans text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {action.description}
          </span>
        </button>
      ))}
    </div>
  );
};
