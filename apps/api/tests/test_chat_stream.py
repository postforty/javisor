import json
import pytest
from httpx import ASGITransport, AsyncClient
from unittest.mock import patch, AsyncMock

from app.main import app


@pytest.mark.asyncio
async def test_chat_stream_success():
    """모의 LLM 스트리밍을 통한 SSE 청크 응답 검증"""

    # 모의 청크 비동기 제너레이터 정의
    async def mock_stream_chunks(*args, **kwargs):
        yield "안녕하십니까, "
        yield "보스. "
        yield "무엇을 도와드릴까요?"

    with patch("app.api.v1.chat.stream_chat_response", side_effect=mock_stream_chunks):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            payload = {
                "message": "안녕 자비스",
                "model_type": "gemini-3.8-flash",
                "persona": "classic",
            }
            response = await client.post("/api/v1/chat/stream", json=payload)
            assert response.status_code == 200
            assert "text/event-stream" in response.headers["content-type"]

            # 수신된 이벤트 라인 파싱
            lines = [line for line in response.text.split("\n\n") if line.strip()]
            assert len(lines) >= 3

            # 첫 번째 청크 검증
            first_event = json.loads(lines[0].replace("data: ", ""))
            assert first_event["type"] == "chunk"
            assert first_event["text"] == "안녕하십니까, "

            # 마지막 완료 이벤트 검증
            last_event = json.loads(lines[-1].replace("data: ", ""))
            assert last_event["type"] == "done"
            assert last_event["model"] == "gemini-3.8-flash"


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "cf_model",
    [
        "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
        "@cf/meta/llama-3.3-70b-instruct",
        "@cf/meta/llama-3.1-8b-instruct",
        "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
    ],
)
async def test_chat_stream_cloudflare_models_success(cf_model: str):
    """Cloudflare Workers AI 3개 모델 요청에 대한 스트리밍 응답 검증"""
    async def mock_stream_chunks(*args, **kwargs):
        yield "클라우드플레어 엣지 응답입니다."

    with patch("app.api.v1.chat.stream_chat_response", side_effect=mock_stream_chunks):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            payload = {
                "message": "상태 보고",
                "model_type": cf_model,
                "persona": "classic",
            }
            response = await client.post("/api/v1/chat/stream", json=payload)
            assert response.status_code == 200
            assert "text/event-stream" in response.headers["content-type"]
            lines = [line for line in response.text.split("\n\n") if line.strip()]
            assert len(lines) >= 2
            last_event = json.loads(lines[-1].replace("data: ", ""))
            assert last_event["type"] == "done"
            assert last_event["model"] == cf_model


@pytest.mark.asyncio
async def test_chat_stream_invalid_model():
    """지원하지 않는 모델 요청 시 422 또는 에러 이벤트 반환 검증"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "message": "테스트",
            "model_type": "unsupported-model-xyz",
            "persona": "classic",
        }
        response = await client.post("/api/v1/chat/stream", json=payload)
        assert response.status_code == 422
