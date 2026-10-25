'use client';

import React from 'react';

interface ArcReactorCoreProps {
  size?: 'sm' | 'md' | 'lg';
  isGenerating?: boolean;
  isListening?: boolean;
  className?: string;
}

/**
 * 아이언맨 JARVIS 아크 리액터를 모티브로 한 키네틱 다이아몬드 프리즘 HUD 코어 컴포넌트
 */
export const ArcReactorCore: React.FC<ArcReactorCoreProps> = ({
  size = 'lg',
  isGenerating = false,
  isListening = false,
  className = '',
}) => {
  // 크기별 스타일 분기
  const dimensions = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48 md:w-56 md:h-56',
  }[size];

  const prismDimensions = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-28 h-28 md:w-32 md:h-32',
  }[size];

  return (
    <div
      className={`relative ${dimensions} flex items-center justify-center select-none ${className}`}
    >
      {/* 앰비언트 방사형 네온 블러 글로우 */}
      <div
        className={`absolute inset-4 rounded-full transition-all duration-700 pointer-events-none ${
          isGenerating
            ? 'bg-[#4cd7f6]/30 blur-3xl scale-125'
            : isListening
            ? 'bg-[#f59e0b]/30 blur-2xl scale-110'
            : 'bg-[#dc2626]/15 blur-2xl'
        }`}
      />
      <div
        className={`absolute inset-10 rounded-full transition-all duration-700 pointer-events-none ${
          isGenerating ? 'bg-[#dc2626]/30 blur-2xl' : 'bg-[#4cd7f6]/10 blur-xl'
        }`}
      />

      {/* 외부 자이로스코프 HUD 캘리브레이션 링 */}
      <svg
        className={`absolute inset-0 w-full h-full pointer-events-none transition-all duration-500 ${
          isGenerating
            ? 'animate-[spin_10s_linear_infinite]'
            : 'animate-[spin_60s_linear_infinite]'
        }`}
        fill="none"
        viewBox="0 0 200 200"
      >
        <circle
          className="text-[#313540]"
          cx="100"
          cy="100"
          r="92"
          stroke="currentColor"
          strokeDasharray="2 6"
          strokeWidth="1"
        />
        <circle
          className={isGenerating ? 'text-[#4cd7f6]' : 'text-[#dc2626]/40'}
          cx="100"
          cy="100"
          r="82"
          stroke="currentColor"
          strokeDasharray="14 180"
          strokeWidth="1.5"
        />
        {/* 방위 틱 마커 (0°, 90°, 180°, 270°) */}
        <line
          className="text-[#dc2626]"
          stroke="currentColor"
          strokeWidth="2"
          x1="100"
          x2="100"
          y1="4"
          y2="12"
        />
        <line
          className="text-[#4cd7f6]"
          stroke="currentColor"
          strokeWidth="2"
          x1="196"
          x2="188"
          y1="100"
          y2="100"
        />
        <line
          className="text-[#ffb95f]"
          stroke="currentColor"
          strokeWidth="2"
          x1="100"
          x2="100"
          y1="196"
          y2="188"
        />
        <line
          className="text-[#4cd7f6]"
          stroke="currentColor"
          strokeWidth="2"
          x1="4"
          x2="12"
          y1="100"
          y2="100"
        />
      </svg>

      {/* 역방향 회전 내부 HUD 트랙 */}
      <svg
        className={`absolute inset-3 w-[calc(100%-1.5rem)] h-[calc(100%-1.5rem)] pointer-events-none transition-all duration-500 ${
          isGenerating
            ? 'animate-[spin_6s_linear_infinite_reverse]'
            : 'animate-[spin_40s_linear_infinite_reverse]'
        }`}
        fill="none"
        viewBox="0 0 180 180"
      >
        <circle
          className="text-[#262a35]"
          cx="90"
          cy="90"
          r="70"
          stroke="currentColor"
          strokeDasharray="4 8"
          strokeWidth="1"
        />
        <circle
          className={isGenerating ? 'text-[#4cd7f6]/80' : 'text-[#ffb95f]/40'}
          cx="90"
          cy="90"
          r="62"
          stroke="currentColor"
          strokeDasharray="24 120"
          strokeWidth="1"
        />
      </svg>

      {/* 다이아몬드 프리즘 코어 본체 */}
      <div
        className={`relative ${prismDimensions} flex items-center justify-center animate-core-float`}
      >
        {/* 펄스 백그라운드 코어 링 */}
        <div
          className={`absolute inset-0 rounded-full blur-md transition-colors duration-500 ${
            isGenerating
              ? 'bg-[#4cd7f6]/40 animate-ping'
              : isListening
              ? 'bg-[#ffb95f]/30 animate-pulse'
              : 'bg-[#dc2626]/20 animate-pulse'
          }`}
        />

        <svg
          className={`w-full h-full transition-all duration-500 ${
            isGenerating
              ? 'drop-shadow-[0_0_24px_rgba(76,215,246,0.85)] scale-105'
              : 'drop-shadow-[0_0_16px_rgba(220,38,38,0.5)]'
          }`}
          viewBox="0 0 120 120"
        >
          <defs>
            <linearGradient id="prism-grad-a" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#690005" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="prism-grad-b" x1="100%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#ffb95f" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="prism-grad-c" x1="50%" x2="50%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#003640" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="prism-grad-d" x1="0%" x2="100%" y1="50%" y2="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffb4ab" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* 프리즘 면 지오메트리 */}
          <polygon fill="url(#prism-grad-a)" opacity="0.95" points="60,8 86,44 60,60" />
          <polygon fill="url(#prism-grad-b)" opacity="0.85" points="60,8 34,44 60,60" />
          <polygon fill="url(#prism-grad-b)" opacity="0.9" points="60,112 86,76 60,60" />
          <polygon fill="url(#prism-grad-a)" opacity="0.85" points="60,112 34,76 60,60" />

          {/* 좌우 날개 플랩 */}
          <polygon fill="url(#prism-grad-c)" opacity="0.75" points="86,44 112,60 86,76 60,60" />
          <polygon fill="url(#prism-grad-c)" opacity="0.75" points="34,44 8,60 34,76 60,60" />

          {/* 중앙 다이아몬드 반사판 */}
          <polygon fill="url(#prism-grad-d)" opacity="0.65" points="60,40 76,60 60,80 44,60" />

          {/* 구조적 마이크로 레이더 라인 */}
          <line opacity="0.8" stroke="#ffdad6" strokeWidth="0.75" x1="60" x2="60" y1="8" y2="112" />
          <line opacity="0.8" stroke="#ffdad6" strokeWidth="0.75" x1="8" x2="112" y1="60" y2="60" />
        </svg>

        {/* 코어 스파클 핍 */}
        <div
          className={`absolute w-2 h-2 rounded-full transition-all duration-300 pointer-events-none ${
            isGenerating
              ? 'bg-[#ffffff] shadow-[0_0_14px_#ffffff] scale-150'
              : 'bg-[#4cd7f6] shadow-[0_0_10px_#4cd7f6]'
          }`}
        />
      </div>

      {/* 4방위 각도 스탬프 라벨 (lg 사이즈일 때만 노출) */}
      {size === 'lg' && (
        <>
          <span className="absolute top-0 font-mono text-[9px] text-[#dfe2f1]/50 -translate-y-1">
            000°
          </span>
          <span className="absolute right-0 font-mono text-[9px] text-[#dfe2f1]/50 translate-x-2">
            090°
          </span>
          <span className="absolute bottom-0 font-mono text-[9px] text-[#dfe2f1]/50 translate-y-1">
            180°
          </span>
          <span className="absolute left-0 font-mono text-[9px] text-[#dfe2f1]/50 -translate-x-2">
            270°
          </span>
        </>
      )}
    </div>
  );
};
