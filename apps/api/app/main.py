from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """서버 시작 시 데이터베이스 테이블 자동 초기화"""
    init_db()
    yield


# FastAPI 어플리케이션 초기화
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="영화 '아이언맨'의 JARVIS HUD 비주얼 테마를 모티브로 한 미래지향적 지능형 개인 비서 서비스 백엔드 API",
    lifespan=lifespan,
)


# CORS 미들웨어 설정 (프런트엔드 연동)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API v1 라우터 등록
from app.api.v1 import api_v1_router
app.include_router(api_v1_router)



@app.get("/health", tags=["시스템"])
async def health_check():
    """서버 상태 확인용 헬스체크 엔드포인트"""
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "telemetry": "ONLINE",
    }
