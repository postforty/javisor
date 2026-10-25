from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class ModelType(str, Enum):
    """지원하는 LLM 모델 엔진 종류"""
    DEFAULT = "gemini-3.8-flash"  # 표준 지능 모드 (고난도 추론, 코드 분석)
    FAST = "gemini-3.5-flash-lite"  # 초저지연 빠른 응답 모드 (일상 질의, 브리핑)


class PersonaType(str, Enum):
    """지원하는 비서 페르소나 종류"""
    CLASSIC = "classic"  # 클래식 자비스 (기품 있고 정중한 신사 어조, '보스' 호칭)
    BRIEF = "brief"      # 간결한 브리핑 (군더더기 없는 개조식 핵심 단문)
    TACTICAL = "tactical"  # 전술 브리핑 (위협 분석 및 정량 텔레메트리 보고)


class ChatRequest(BaseModel):
    """실시간 대화 스트리밍 요청 스키마"""
    message: str = Field(..., min_length=1, description="사용자 입력 메시지")
    session_id: Optional[str] = Field(default=None, description="대화 세션 ID (없으면 신규 생성)")
    model_type: ModelType = Field(default=ModelType.DEFAULT, description="추론 엔진 모드")
    persona: PersonaType = Field(default=PersonaType.CLASSIC, description="비서 응답 페르소나")


class StreamChunkEvent(BaseModel):
    """SSE 스트림 청크 이벤트 스키마"""
    type: str = "chunk"
    text: str
    session_id: str


class StreamDoneEvent(BaseModel):
    """SSE 스트림 완료 이벤트 스키마"""
    type: str = "done"
    session_id: str
    model: str


class StreamErrorEvent(BaseModel):
    """SSE 스트림 에러 이벤트 스키마"""
    type: str = "error"
    message: str
