from datetime import datetime, timezone
import pytest
from httpx import ASGITransport, AsyncClient
from sqlmodel import Session as DBSession

from app.main import app
from app.models.session import Session, Message
from tests.conftest import test_engine


@pytest.mark.asyncio
async def test_session_lifecycle():
    """세션 생성, 목록 조회, 북마크 토글, 상세 내역, 내보내기, 삭제 라이프사이클 TDD 검증"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. 초기 상태: 세션 목록 비어있음
        res = await client.get("/api/v1/sessions")
        assert res.status_code == 200
        assert res.json() == []

        now = datetime.now(timezone.utc)

        # 2. 테스트용 세션 및 메시지 DB에 직접 삽입
        with DBSession(test_engine) as db:
            session = Session(
                id="SES-TEST01",
                title="스타크 타워 에너지 피크 차단 설계",
                summary="아크 리액터 3호기 냉각 순환계 부하 경감 방안 검토",
                model_name="gemini-3.8-flash",
                is_pinned=False,
                created_at=now,
                updated_at=now,
            )
            msg1 = Message(
                id="MSG-01",
                session_id="SES-TEST01",
                role="user",
                content="에너지 피크 차단 방안을 분석해줘",
                model_name="gemini-3.8-flash",
                created_at=now,
            )
            msg2 = Message(
                id="MSG-02",
                session_id="SES-TEST01",
                role="assistant",
                content="보스, 3호기 냉각 순환계 부하를 11.8% 경감하는 계획을 수립했습니다.",
                model_name="gemini-3.8-flash",
                created_at=now,
            )
            db.add(session)
            db.add(msg1)
            db.add(msg2)
            db.commit()

        # 3. 세션 목록 조회 확인
        res = await client.get("/api/v1/sessions")
        assert res.status_code == 200
        sessions = res.json()
        assert len(sessions) == 1
        assert sessions[0]["id"] == "SES-TEST01"
        assert sessions[0]["message_count"] == 2
        assert sessions[0]["is_pinned"] is False

        # 4. 세션 상세 조회 (메시지 목록 포함)
        res = await client.get("/api/v1/sessions/SES-TEST01")
        assert res.status_code == 200
        detail = res.json()
        assert detail["id"] == "SES-TEST01"
        assert len(detail["messages"]) == 2
        assert detail["messages"][0]["content"] == "에너지 피크 차단 방안을 분석해줘"

        # 5. 북마크(★) 토글 검증
        patch_res = await client.patch("/api/v1/sessions/SES-TEST01", json={"is_pinned": True})
        assert patch_res.status_code == 200
        assert patch_res.json()["is_pinned"] is True

        # 필터링 검증 (pinned=True)
        res_pinned = await client.get("/api/v1/sessions?tab=pinned")
        assert len(res_pinned.json()) == 1

        # 6. 세션 아카이브 내보내기 검증
        export_res = await client.get("/api/v1/sessions/SES-TEST01/export")
        assert export_res.status_code == 200
        export_data = export_res.json()
        assert export_data["session"]["id"] == "SES-TEST01"
        assert export_data["app_version"] == "MK-85"

        # 7. 세션 삭제 검증
        del_res = await client.delete("/api/v1/sessions/SES-TEST01")
        assert del_res.status_code == 200
        assert del_res.json()["success"] is True

        # 삭제 후 목록 재조회 시 비어있음 확인
        res_after = await client.get("/api/v1/sessions")
        assert res_after.json() == []
