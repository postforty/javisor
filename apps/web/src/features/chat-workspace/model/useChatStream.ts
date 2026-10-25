'use client';

import { useState, useRef, useCallback } from 'react';
import { ChatMessage, ModelType, PersonaType } from '@/shared/types';

interface UseChatStreamOptions {
  initialPersona?: PersonaType;
  initialModel?: ModelType;
}

/**
 * 실시간 SSE 대화 스트리밍 및 Barge-in 중단 제어 훅
 */
export function useChatStream({
  initialPersona = 'classic',
  initialModel = 'gemini-3.8-flash',
}: UseChatStreamOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [modelType, setModelType] = useState<ModelType>(initialModel);
  const [persona, setPersona] = useState<PersonaType>(initialPersona);

  // 진행 중인 스트리밍 요청 AbortController 참조
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * 실시간 스트리밍 답변 생성 즉시 중단 (Barge-in)
   */
  const stopGenerating = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
  }, []);

  /**
   * 새 메시지 전송 및 실시간 SSE 스트리밍 수신
   */
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isGenerating) return;

      // 만약 이전 스트리밍이 살아있다면 중단
      stopGenerating();

      const userMessageId = `msg-${Date.now()}`;
      const assistantMessageId = `msg-${Date.now() + 1}`;

      const userMessage: ChatMessage = {
        id: userMessageId,
        role: 'user',
        content: trimmed,
        timestamp: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      const assistantPlaceholder: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        model: modelType,
      };

      // 화면에 사용자 메시지 및 빈 어시스턴트 메시지 즉시 추가
      setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
      setIsGenerating(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/v1/chat/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: trimmed,
            session_id: sessionId,
            model_type: modelType,
            persona: persona,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`API 응답 실패 (HTTP ${response.status})`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('스트림 리더를 초기화할 수 없습니다.');

        const decoder = new TextDecoder('utf-8');
        let accumulatedText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunkStr = decoder.decode(value, { stream: true });
          const eventBlocks = chunkStr.split('\n\n');

          for (const block of eventBlocks) {
            const cleanLine = block.trim();
            if (!cleanLine.startsWith('data: ')) continue;

            try {
              const data = JSON.parse(cleanLine.replace('data: ', ''));

              if (data.type === 'chunk' && data.text) {
                accumulatedText += data.text;
                // 세션 ID 갱신
                if (data.session_id && !sessionId) {
                  setSessionId(data.session_id);
                }
                // 실시간 텍스트 누적 반영
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: accumulatedText }
                      : msg
                  )
                );
              } else if (data.type === 'done') {
                if (data.session_id) setSessionId(data.session_id);
              } else if (data.type === 'error') {
                accumulatedText += `\n[통신 오류: ${data.message}]`;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: accumulatedText }
                      : msg
                  )
                );
              }
            } catch {
              // JSON 파싱 에러는 무시하고 다음 청크 처리
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          // 사용자가 의도적으로 중단한 경우
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: msg.content + ' [중단됨]' }
                : msg
            )
          );
        } else {
          const errorMsg =
            err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    content: `[자비서 코어 경보] 통신 링크가 원활하지 않습니다: ${errorMsg}`,
                  }
                : msg
            )
          );
        }
      } finally {
        setIsGenerating(false);
        abortControllerRef.current = null;
      }
    },
    [isGenerating, modelType, persona, sessionId, stopGenerating]
  );

  /**
   * 새 대화 세션 초기화
   */
  const clearSession = useCallback(() => {
    stopGenerating();
    setMessages([]);
    setSessionId(null);
  }, [stopGenerating]);

  return {
    messages,
    isGenerating,
    sessionId,
    modelType,
    setModelType,
    persona,
    setPersona,
    sendMessage,
    stopGenerating,
    clearSession,
  };
}
