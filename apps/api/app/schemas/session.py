from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class MessageItem(BaseModel):
    """세션 내 메시지 직렬화 스키마"""
    id: str
    session_id: str
    role: str
    content: str
    model_name: Optional[str] = None
    created_at: datetime


class SessionListItem(BaseModel):
    """히스토리 목록 조회용 세션 스키마"""
    id: str
    title: str
    summary: Optional[str] = None
    model_name: str
    is_pinned: bool
    is_archived: bool
    message_count: int
    created_at: datetime
    updated_at: datetime


class SessionDetailResponse(BaseModel):
    """세션 상세 및 대화 기록 스키마"""
    id: str
    title: str
    summary: Optional[str] = None
    model_name: str
    is_pinned: bool
    is_archived: bool
    created_at: datetime
    updated_at: datetime
    messages: List[MessageItem] = []


class SessionUpdate(BaseModel):
    """세션 정보 수정 스키마"""
    title: Optional[str] = None
    is_pinned: Optional[bool] = None
    is_archived: Optional[bool] = None


class SessionExport(BaseModel):
    """세션 아카이브 내보내기 스키마"""
    session: SessionDetailResponse
    exported_at: datetime
    app_version: str = "MK-85"
