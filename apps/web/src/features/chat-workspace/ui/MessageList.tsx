'use client';

import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '@/shared/types';

interface MessageListProps {
  messages: ChatMessage[];
  isGenerating: boolean;
}

/**
 * 실시간 HUD 대화 메시지 스트림 뷰 컴포넌트
 */
export const MessageList: React.FC<MessageListProps> = ({ messages, isGenerating }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6 overflow-y-auto">
      {messages.map((msg, index) => {
        const isUser = msg.role === 'user';
        const isLatestAssistant = !isUser && index === messages.length - 1;

        return (
          <div
            key={msg.id}
            className={`flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}
          >
            {/* 발화자 헤더 및 메타데이터 */}
            <div className="flex items-center gap-2 px-1">
              {!isUser && (
                <div className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_6px_#4cd7f6]" />
              )}
              <span className="font-['Space_Grotesk'] text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                {isUser ? 'T. STARK' : 'JAVISOR MK-85'}
              </span>
              {!isUser && msg.model && (
                <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-[#171b26] text-[#4cd7f6] border border-[#4cd7f6]/30">
                  {msg.model === 'gemini-3.8-flash' ? 'QUANTUM' : 'LITE'}
                </span>
              )}
              <span className="font-mono text-[10px] text-slate-500">{msg.timestamp}</span>
            </div>

            {/* 메시지 본문 버블 */}
            <div
              className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap break-words transition-all ${
                isUser
                  ? 'bg-[#1c1f2a] text-slate-100 border border-white/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.3)] rounded-tr-sm'
                  : 'bg-[#0f131d]/90 text-slate-100 border border-[#dc2626]/25 shadow-[0_0_16px_rgba(220,38,38,0.1)] rounded-tl-sm'
              }`}
            >
              {msg.content}
              {/* 타이핑 중 커서 효과 */}
              {isLatestAssistant && isGenerating && (
                <span className="inline-block w-2 h-4 ml-1 bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6] animate-typing-cursor align-middle" />
              )}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};
