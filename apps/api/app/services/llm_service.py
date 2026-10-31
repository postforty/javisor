import asyncio
from typing import AsyncGenerator
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_cloudflare.chat_models import ChatCloudflareWorkersAI

from app.core.config import settings
from app.schemas.chat import ModelType, PersonaType

# 페르소나별 시스템 프롬프트 정의
SYSTEM_PROMPTS = {
    PersonaType.CLASSIC: (
        "당신은 영화 '아이언맨'의 인공지능 비서 JARVIS(자비스)를 모티브로 한 최첨단 지능형 개인 비서 '자비서(jarvisor)'입니다. "
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


# 모델 식별자 별칭 정규화 매핑 (Cloudflare 실존 라우트 자동 변환)
MODEL_ALIASES = {
    "@cf/meta/llama-3.3-70b-instruct": "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
}


def get_chat_model(model_name: str) -> BaseChatModel:
    """LangChain 표준 BaseChatModel 인스턴스 반환 팩토리 함수"""
    # 별칭이 존재하는 경우 정규화된 모델명으로 치환
    normalized_model_name = MODEL_ALIASES.get(model_name, model_name)

    if normalized_model_name.startswith("@cf/"):
        # Cloudflare Workers AI 모델 생성
        account_id = (settings.CLOUDFLARE_ACCOUNT_ID or "").strip()
        api_token = (settings.CLOUDFLARE_API_TOKEN or "").strip()

        # 인증 정보 미설정 시 사전 검증 안내 예외 발생
        if not account_id or not api_token or account_id == "DUMMY_ACCOUNT_ID":
            raise ValueError(
                "Cloudflare 인증 정보(CLOUDFLARE_ACCOUNT_ID 또는 CLOUDFLARE_API_TOKEN)가 "
                ".env에 설정되지 않았거나 백엔드 서버에 반영되지 않았습니다. "
                ".env 확인 후 백엔드 API 서버를 재시작해 주십시오."
            )

        return ChatCloudflareWorkersAI(
            model=normalized_model_name,
            account_id=account_id,
            api_token=api_token,
        )
    else:
        # Google Gemini 모델 생성 (langchain-google-genai 기반)
        api_key = (settings.GEMINI_API_KEY or "").strip()
        return ChatGoogleGenerativeAI(
            model=normalized_model_name,
            google_api_key=api_key or "DUMMY_KEY",
            temperature=0.7,
        )


async def stream_chat_response(
    message: str,
    model_type: str = ModelType.DEFAULT.value,
    persona: str = PersonaType.CLASSIC.value,
) -> AsyncGenerator[str, None]:
    """LangChain 표준 astream() 기반 비동기 스트리밍 제너레이터"""
    system_instruction = SYSTEM_PROMPTS.get(
        persona, SYSTEM_PROMPTS[PersonaType.CLASSIC]
    )

    try:
        model = get_chat_model(model_type)
        messages = [
            SystemMessage(content=system_instruction),
            HumanMessage(content=message),
        ]

        async for chunk in model.astream(messages):
            if chunk.content:
                if isinstance(chunk.content, str):
                    yield chunk.content
                elif isinstance(chunk.content, list):
                    for part in chunk.content:
                        if isinstance(part, dict) and "text" in part:
                            yield part["text"]
                        elif isinstance(part, str):
                            yield part
                else:
                    yield str(chunk.content)

    except Exception as e:
        # 상위 SSE 라우터로 예외를 전달하여 통일된 에러 이벤트로 처리
        raise RuntimeError(f"모델({model_type}) 스트리밍 통신 실패: {str(e)}") from e
