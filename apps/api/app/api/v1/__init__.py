from fastapi import APIRouter
from app.api.v1.chat import router as chat_router
from app.api.v1.sessions import router as sessions_router

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(chat_router)
api_v1_router.include_router(sessions_router)
