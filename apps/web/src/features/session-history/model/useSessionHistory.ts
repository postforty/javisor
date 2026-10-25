'use client';

import { useState, useEffect, useCallback } from 'react';
import { SessionData, ChatMessage, ModelType } from '@/shared/types';

export interface SessionApiItem {
  id: string;
  title: string;
  summary?: string | null;
  model_name: string;
  is_pinned: boolean;
  is_archived: boolean;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface MessageApiItem {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model_name?: string | null;
  created_at: string;
}

export interface SessionDetail extends SessionData {
  messages: ChatMessage[];
}

/**
 * 대화 세션 히스토리 데이터 조회 및 관리 훅
 */
export function useSessionHistory() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<SessionDetail | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pinned' | 'archive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  /**
   * 세션 목록 불러오기
   */
  const fetchSessions = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (activeTab !== 'all') params.append('tab', activeTab);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`${apiUrl}/api/v1/sessions?${params.toString()}`);
      if (!res.ok) throw new Error('세션 목록을 불러오지 못했습니다.');
      const data: SessionApiItem[] = await res.json();

      const mapped: SessionData[] = data.map((item) => ({
        id: item.id,
        title: item.title,
        summary: item.summary || undefined,
        model: item.model_name as ModelType,
        isPinned: item.is_pinned,
        isArchived: item.is_archived,
        messageCount: item.message_count,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));

      setSessions(mapped);

      // 첫 로드 시 첫 번째 세션 선택
      setSelectedSessionId((prevId) => {
        if (mapped.length > 0 && (!prevId || !mapped.find((s) => s.id === prevId))) {
          return mapped[0].id;
        }
        if (mapped.length === 0) return null;
        return prevId;
      });
    } catch {
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, activeTab, searchQuery]);

  /**
   * 선택된 세션 상세 불러오기
   */
  const fetchSessionDetail = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`${apiUrl}/api/v1/sessions/${id}`);
        if (!res.ok) throw new Error('세션 상세를 불러오지 못했습니다.');
        const data = await res.json();

        setSelectedDetail({
          id: data.id,
          title: data.title,
          summary: data.summary || undefined,
          model: data.model_name as ModelType,
          isPinned: data.is_pinned,
          isArchived: data.is_archived,
          messageCount: data.messages?.length || 0,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          messages: (data.messages || []).map((m: MessageApiItem) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            timestamp: new Date(m.created_at).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            model: (m.model_name as ModelType) || undefined,
          })),
        });
      } catch {
        setSelectedDetail(null);
      }
    },
    [apiUrl]
  );

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      if (!ignore) {
        setIsLoading(true);
        await fetchSessions();
      }
    }
    loadData();
    return () => {
      ignore = true;
    };
  }, [fetchSessions]);

  useEffect(() => {
    let ignore = false;
    async function loadDetail() {
      if (!ignore && selectedSessionId) {
        await fetchSessionDetail(selectedSessionId);
      }
    }
    loadDetail();
    return () => {
      ignore = true;
    };
  }, [selectedSessionId, fetchSessionDetail]);

  /**
   * 북마크(★) 상태 토글
   */
  const toggleBookmark = async (id: string, currentPinned: boolean) => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/sessions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_pinned: !currentPinned }),
      });
      if (res.ok) {
        setSessions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, isPinned: !currentPinned } : s))
        );
        setSelectedDetail((prev) =>
          prev && prev.id === id ? { ...prev, isPinned: !currentPinned } : prev
        );
      }
    } catch {
      // 오류 무시
    }
  };

  /**
   * 세션 삭제
   */
  const deleteSession = async (id: string) => {
    if (!confirm('이 대화 세션을 영구적으로 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`${apiUrl}/api/v1/sessions/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== id));
        setSelectedSessionId((prevId) => (prevId === id ? null : prevId));
        setSelectedDetail((prev) => (prev && prev.id === id ? null : prev));
      }
    } catch {
      // 오류 무시
    }
  };

  /**
   * 세션 JSON 아카이브 다운로드
   */
  const exportSession = async (id: string) => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/sessions/${id}/export`);
      if (res.ok) {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `javisor-session-${id}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // 오류 무시
    }
  };

  return {
    sessions,
    selectedSessionId,
    setSelectedSessionId,
    selectedDetail,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    isLoading,
    toggleBookmark,
    deleteSession,
    exportSession,
    refreshSessions: fetchSessions,
  };
}
