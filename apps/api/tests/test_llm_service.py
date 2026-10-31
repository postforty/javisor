import pytest
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_cloudflare.chat_models import ChatCloudflareWorkersAI

from app.schemas.chat import ModelType
from app.services.llm_service import get_chat_model


def test_get_chat_model_gemini():
    """Google Gemini 모델 식별자 전달 시 ChatGoogleGenerativeAI 인스턴스 반환 검증"""
    model = get_chat_model(ModelType.DEFAULT.value)
    assert isinstance(model, ChatGoogleGenerativeAI)
    assert model.model == "gemini-3.8-flash"

    fast_model = get_chat_model(ModelType.FAST.value)
    assert isinstance(fast_model, ChatGoogleGenerativeAI)
    assert fast_model.model == "gemini-3.5-flash-lite"


def test_get_chat_model_cloudflare():
    """Cloudflare Workers AI 모델 식별자 전달 시 ChatCloudflareWorkersAI 인스턴스 반환 검증"""
    llama_model = get_chat_model(ModelType.CF_LLAMA_3_3.value)
    assert isinstance(llama_model, ChatCloudflareWorkersAI)
    assert llama_model.model == "@cf/meta/llama-3.3-70b-instruct-fp8-fast"

    # 구형 별칭 전달 시에도 실존 엔드포인트로 자동 정규화 검증
    legacy_model = get_chat_model(ModelType.CF_LLAMA_3_3_ALIAS.value)
    assert isinstance(legacy_model, ChatCloudflareWorkersAI)
    assert legacy_model.model == "@cf/meta/llama-3.3-70b-instruct-fp8-fast"

    deepseek_model = get_chat_model(ModelType.CF_DEEPSEEK_R1.value)
    assert isinstance(deepseek_model, ChatCloudflareWorkersAI)
    assert deepseek_model.model == "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b"

