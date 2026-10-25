from sqlmodel import SQLModel, create_engine, Session as DBSession
from app.core.config import settings

# SQLite DB 엔진 (커넥션 풀 및 외래키 활성화)
connect_args = {"check_same_thread": False}
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    connect_args=connect_args,
)


def init_db():
    """데이터베이스 테이블 자동 생성"""
    SQLModel.metadata.create_all(engine)


def get_db():
    """FastAPI Depends용 데이터베이스 세션 제너레이터"""
    with DBSession(engine) as session:
        yield session
