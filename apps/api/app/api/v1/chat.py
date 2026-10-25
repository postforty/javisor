import json
import uuid
from datetime import datetime, timezone
from typing import AsyncGenerator
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlmodel import Session as DBSession

from app.db.session import get_db, engine
from app.models.session import Session, Message
from app.schemas.chat import ChatRequest
from app.services.llm_service import stream_chat_response

router = APIRouter(prefix="/chat", tags=["대화"])


@router.post("/stream")
async def chat_stream_endpoint(request: ChatRequest, db: DBSession = Depends(get_db)):
    """Server-Sent Events (SSE) 기반 실시간 타이핑 대화 스트리밍 엔드포인트"""
    session_id = request.session_id or f"SES-{uuid.uuid4().hex[:6].upper()}"
    model_name = request.model_type.value

    # 세션 조회 또는 자동 생성
    session = db.get(Session, session_id)
    if not session:
        # 첫 사용자 메시지 내용으로 세션 제목 자동 생성
        title_summary = request.message[:28] + ("..." if len(request.message) > 28 else "")
        session = Session(
            id=session_id,
            title=title_summary,
            model_name=model_name,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(session)
        db.commit()

    # 사용자 메시지 DB 저장
    user_msg = Message(
        id=f"MSG-{uuid.uuid4().hex[:8].upper()}",
        session_id=session_id,
        role="user",
        content=request.message,
        model_name=model_name,
        created_at=datetime.now(timezone.utc),
    )
    db.add(user_msg)
    db.commit()

    async def event_generator() -> AsyncGenerator[str, None]:
        accumulated_text = ""
        try:
            # 청크 스트리밍 수신 및 SSE 이벤트 전송
            async for chunk in stream_chat_response(
                message=request.message,
                model_type=model_name,
                persona=request.persona.value,
            ):
                accumulated_text += chunk
                event_data = {
                    "type": "chunk",
                    "text": chunk,
                    "session_id": session_id,
                }
                yield f"data: {json.dumps(event_data, ensure_ascii=False)}\n\n"

            # 스트리밍 완료 후 어시스턴트 메시지 DB 영속화
            if accumulated_text:
                with DBSession(engine) as save_db:
                    assistant_msg = Message(
                        id=f"MSG-{uuid.uuid4().hex[:8].upper()}",
                        session_id=session_id,
                        role="assistant",
                        content=accumulated_text,
                        model_name=model_name,
                        created_at=datetime.now(timezone.utc),
                    )
                    save_db.add(assistant_msg)
                    # 세션 갱신
                    cur_session = save_db.get(Session, session_id)
                    if cur_session:
                        cur_session.updated_at = datetime.now(timezone.utc)
                        save_db.add(cur_session)
                    save_db.commit()

            # 스트림 완료 이벤트 전송
            done_data = {
                "type": "done",
                "session_id": session_id,
                "model": model_name,
            }
            yield f"data: {json.dumps(done_data, ensure_ascii=False)}\n\n"

        except Exception as e:
            error_data = {
                "type": "error",
                "message": f"스트리밍 처리 중 내부 예외가 발생했습니다: {str(e)}",
            }
            yield f"data: {json.dumps(error_data, ensure_ascii=False)}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
