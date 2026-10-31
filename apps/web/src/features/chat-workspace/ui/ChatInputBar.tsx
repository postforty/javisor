'use client';

import React, { useState } from 'react';
import { ModelType } from '@/shared/types';

interface ChatInputBarProps {
  onSendMessage: (text: string) => void;
  onStopGenerating: () => void;
  isGenerating: boolean;
  isDelayed?: boolean;
  modelType: ModelType;
  onChangeModel: (model: ModelType) => void;
  isListening: boolean;
  onToggleListening: () => void;
}

/**
 * 하단 캡슐형 명령 입력 및 모델 스위칭 컨트롤 바 컴포넌트
 */
export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSendMessage,
  onStopGenerating,
  isGenerating,
  isDelayed = false,
  modelType,
  onChangeModel,
  isListening,
  onToggleListening,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) {
      onStopGenerating();
      return;
    }
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 select-none">
      {/* 상단 컨트롤러: 모델 스위처 & 모드 안내 */}
      <div className="flex items-center justify-between px-2 pb-2 text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">CORE ENGINE:</span>
          <div className="inline-flex rounded-lg bg-[#121620] p-0.5 border border-white/10">
            <button
              type="button"
              onClick={() => onChangeModel('gemini-3.8-flash')}
              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${
                modelType === 'gemini-3.8-flash'
                  ? 'bg-[#dc2626] text-white shadow-[0_0_8px_#dc2626]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              표준 지능 (3.8 Flash)
            </button>
            <button
              type="button"
              onClick={() => onChangeModel('gemini-3.5-flash-lite')}
              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${
                modelType === 'gemini-3.5-flash-lite'
                  ? 'bg-[#ffb95f] text-[#472a00] shadow-[0_0_8px_#ffb95f]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              초저지연 (3.5 Lite)
            </button>
          </div>
        </div>

        {isGenerating && (
          isDelayed ? (
            <div className="flex items-center gap-1.5 text-[#ffb95f] animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb95f] shadow-[0_0_6px_#ffb95f]" />
              <span>통신 지연 감지 (엔진 전환 가능)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[#4cd7f6] animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]" />
              <span>스트리밍 답변 생성 중 (Barge-in 대기)</span>
            </div>
          )
        )}
      </div>

      {/* 캡슐형 입력 폼 */}
      <form
        onSubmit={handleSubmit}
        className="relative w-full rounded-full bg-[#111827]/90 backdrop-blur-xl border border-white/[0.08] hover:border-white/20 focus-within:border-[#dc2626]/60 p-1.5 pl-5 flex items-center justify-between gap-3 shadow-[0_0_24px_rgba(0,0,0,0.6)] focus-within:shadow-[0_0_24px_rgba(220,38,38,0.35)] transition-all"
      >
        {/* 입력 태그 */}
        <div className="hidden sm:flex items-center gap-1.5 pr-1 border-r border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#dc2626] shadow-[0_0_6px_#dc2626]" />
          <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
            CMD
          </span>
        </div>

        {/* 텍스트 입력창 */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isListening
              ? '자비서 음성 센서 수신 중... 말씀하십시오.'
              : '새 프로토콜 생성, 데이터 질의, 또는 전술 지시사항을 입력하십시오...'
          }
          className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-500 font-sans text-sm focus:outline-none min-w-0 tracking-wide"
        />

        {/* 액션 버튼 그룹 */}
        <div className="flex items-center gap-1.5">
          {/* 음성 인식 마이크 토글 */}
          <button
            type="button"
            onClick={onToggleListening}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isListening
                ? 'bg-[#dc2626] text-white shadow-[0_0_12px_#dc2626] animate-pulse'
                : 'text-slate-400 hover:text-[#ffb95f] hover:bg-white/[0.04]'
            }`}
            title="음성 인식 활성화"
          >
            <span className="material-symbols-outlined text-[19px]">mic</span>
          </button>

          {/* 전송 또는 스트리밍 중단(Barge-in) 버튼 */}
          {isGenerating ? (
            <button
              type="button"
              onClick={onStopGenerating}
              className="h-9 px-4 rounded-full bg-[#93000a] hover:bg-[#b91c1c] text-white font-['Space_Grotesk'] text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_16px_rgba(220,38,38,0.5)] active:scale-95 transition-all cursor-pointer"
              title="답변 생성 즉시 중단"
            >
              <span className="material-symbols-outlined text-[16px]">stop</span>
              <span>중단</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="h-9 px-4 rounded-full bg-[#dc2626] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#b91c1c] text-white font-['Space_Grotesk'] text-xs uppercase tracking-wider flex items-center gap-1 shadow-[0_0_16px_rgba(220,38,38,0.45)] hover:shadow-[0_0_24px_rgba(220,38,38,0.8)] active:scale-95 transition-all cursor-pointer"
              title="명령 전송"
            >
              <span className="hidden sm:inline">실행</span>
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
