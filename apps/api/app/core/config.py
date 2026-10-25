from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """자비서 백엔드 API 설정 클래스"""
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    APP_NAME: str = "자비서 (javisor) API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Gemini LLM 모델 설정
    GEMINI_API_KEY: str = ""
    GEMINI_DEFAULT_MODEL: str = "gemini-3.8-flash"
    GEMINI_FAST_MODEL: str = "gemini-3.5-flash-lite"

    # 데이터베이스 설정
    DATABASE_URL: str = "sqlite:///./javisor.db"

    # CORS 허용 도메인 목록
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]


# 전역 설정 싱글톤 인스턴스
settings = Settings()
