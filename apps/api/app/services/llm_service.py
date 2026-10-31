import asyncio
from typing import AsyncGenerator
from google import genai
from google.genai import types

from app.core.config import settings
from app.schemas.chat import ModelType, PersonaType

# 페르소나별 시스템 프롬프트 정의
SYSTEM_PROMPTS = {
    PersonaType.CLASSIC: (
        "당신은 영화 '아이언맨'의 인공지능 비서 JARVIS(자비스)를 모티브로 한 최첨단 지능형 개인 비서 '자비서(javisor)'입니다. "
        "사용자를 항상 '보스'라고 부르며, 기품 있고 정중하며 논리적이고 절제된 영국식 신사 어조로 답변하십시오. "
        "답변은 반드시 정중한 한국어로 작성하십시오."
    ),
    PersonaType.BRIEF: (
        "당신은 핵심만 신속하게 전달하는 인공지능 비서 '자비서'입니다. "
        "군더더기 없는 개조식과 핵심 단문 위주로 즉시 실행 가능한 정보를 전달하십시오. "
        "불필요한 서두와 맺음말을 생략하고 신속하게 브리핑하십시오."
    ),
    PersonaType.TACTICAL: (
        "당신은 마크 85 수트 전술 분석 및 시스템 모니터링 전담 인공지능 '자비서'입니다. "
        "위협 수준, 자원 소모율, 텔레메트리 수치와 우선순위를 중심으로 단호하고 정확한 전술적 어조로 보고하십시오."
    ),
}


def get_genai_client() -> genai.Client:
    """Google Gemini GenAI 클라이언트 인스턴스 반환"""
    api_key = settings.GEMINI_API_KEY
    if not api_key or api_key == "mock-api-key-for-local-dev":
        # 유효하지 않은 키일 때도 클라이언트 자체는 생성 가능 (실제 호출 시 에러 핸들링)
        return genai.Client(api_key=api_key or "DUMMY_KEY")
    return genai.Client(api_key=api_key)


async def stream_chat_response(
    message: str,
    model_type: str = ModelType.DEFAULT.value,
    persona: str = PersonaType.CLASSIC.value,
) -> AsyncGenerator[str, None]:
    """Gemini 스트리밍 응답 비동기 제너레이터"""
    system_instruction = SYSTEM_PROMPTS.get(
        persona, SYSTEM_PROMPTS[PersonaType.CLASSIC]
    )

    client = get_genai_client()
    
    try:
        # 비동기 Gemini 텍스트 스트리밍 호출
        response = await client.aio.models.generate_content_stream(
            model=model_type,
            contents=message,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7,
            ),
        )
        async for chunk in response:
            if chunk.text:
                yield chunk.text

    except Exception as e:
        # 예외를 상위 SSE 라우터로 전달하여 에러 이벤트(type: "error")로 처리하도록 함
        raise RuntimeError(f"모델({model_type}) 스트리밍 통신 실패: {str(e)}") from e
