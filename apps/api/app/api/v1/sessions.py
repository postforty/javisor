from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session as DBSession, select, desc

from app.db.session import get_db
from app.models.session import Session, Message
from app.schemas.session import (
    SessionListItem,
    SessionDetailResponse,
    SessionUpdate,
    SessionExport,
    MessageItem,
)

router = APIRouter(prefix="/sessions", tags=["세션 히스토리"])


@router.get("", response_model=List[SessionListItem])
async def list_sessions(
    tab: str = Query(default="all", description="필터 탭: all, pinned, archive"),
    search: Optional[str] = Query(default=None, description="검색 쿼리"),
    db: DBSession = Depends(get_db),
):
    """대화 세션 히스토리 목록 조회"""
    statement = select(Session).order_by(desc(Session.updated_at))

    # 탭별 필터링
    if tab == "pinned":
        statement = statement.where(Session.is_pinned == True)  # noqa: E712
    elif tab == "archive":
        statement = statement.where(Session.is_archived == True)  # noqa: E712

    sessions = db.exec(statement).all()

    # 검색어 필터링 (메모리 또는 SQL)
    if search:
        search_lower = search.lower()
        sessions = [
            s
            for s in sessions
            if (s.title and search_lower in s.title.lower())
            or (s.summary and search_lower in s.summary.lower())
        ]

    # 세션별 메시지 카운트 포함하여 반환
    results = []
    for s in sessions:
        count_stmt = select(Message).where(Message.session_id == s.id)
        messages = db.exec(count_stmt).all()
        results.append(
            SessionListItem(
                id=s.id,
                title=s.title,
                summary=s.summary,
                model_name=s.model_name,
                is_pinned=s.is_pinned,
                is_archived=s.is_archived,
                message_count=len(messages),
                created_at=s.created_at,
                updated_at=s.updated_at,
            )
        )
    return results


@router.get("/{session_id}", response_model=SessionDetailResponse)
async def get_session_detail(session_id: str, db: DBSession = Depends(get_db)):
    """특정 세션 상세 및 전체 메시지 히스토리 조회"""
    session = db.get(Session, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="해당 세션을 찾을 수 없습니다.")

    stmt = select(Message).where(Message.session_id == session_id).order_by(Message.created_at)
    messages = db.exec(stmt).all()

    return SessionDetailResponse(
        id=session.id,
        title=session.title,
        summary=session.summary,
        model_name=session.model_name,
        is_pinned=session.is_pinned,
        is_archived=session.is_archived,
        created_at=session.created_at,
        updated_at=session.updated_at,
        messages=[
            MessageItem(
                id=m.id,
                session_id=m.session_id,
                role=m.role,
                content=m.content,
                model_name=m.model_name,
                created_at=m.created_at,
            )
            for m in messages
        ],
    )


@router.patch("/{session_id}", response_model=SessionDetailResponse)
async def update_session(
    session_id: str,
    update_data: SessionUpdate,
    db: DBSession = Depends(get_db),
):
    """세션 제목, 북마크(★), 보관 여부 수정"""
    session = db.get(Session, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="해당 세션을 찾을 수 없습니다.")

    if update_data.title is not None:
        session.title = update_data.title
    if update_data.is_pinned is not None:
        session.is_pinned = update_data.is_pinned
    if update_data.is_archived is not None:
        session.is_archived = update_data.is_archived

    session.updated_at = datetime.now(timezone.utc)
    db.add(session)
    db.commit()
    db.refresh(session)

    stmt = select(Message).where(Message.session_id == session_id).order_by(Message.created_at)
    messages = db.exec(stmt).all()

    return SessionDetailResponse(
        id=session.id,
        title=session.title,
        summary=session.summary,
        model_name=session.model_name,
        is_pinned=session.is_pinned,
        is_archived=session.is_archived,
        created_at=session.created_at,
        updated_at=session.updated_at,
        messages=[
            MessageItem(
                id=m.id,
                session_id=m.session_id,
                role=m.role,
                content=m.content,
                model_name=m.model_name,
                created_at=m.created_at,
            )
            for m in messages
        ],
    )


@router.delete("/{session_id}")
async def delete_session(session_id: str, db: DBSession = Depends(get_db)):
    """세션 및 관련 메시지 삭제"""
    session = db.get(Session, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="해당 세션을 찾을 수 없습니다.")

    # 하위 메시지 삭제
    stmt = select(Message).where(Message.session_id == session_id)
    messages = db.exec(stmt).all()
    for m in messages:
        db.delete(m)

    db.delete(session)
    db.commit()

    return {"success": True, "deleted_id": session_id}


@router.get("/{session_id}/export", response_model=SessionExport)
async def export_session(session_id: str, db: DBSession = Depends(get_db)):
    """세션 JSON 아카이브 내보내기"""
    detail = await get_session_detail(session_id, db)
    return SessionExport(
        session=detail,
        exported_at=datetime.now(timezone.utc),
        app_version="MK-85",
    )
