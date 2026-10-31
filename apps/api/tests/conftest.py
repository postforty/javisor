import os
import pytest
from sqlmodel import SQLModel, create_engine, Session as DBSession

from app.main import app
from app.db.session import get_db

TEST_DB_PATH = "./test_jarvisor.db"
test_engine = create_engine(
    f"sqlite:///{TEST_DB_PATH}",
    connect_args={"check_same_thread": False},
)


def override_get_db():
    with DBSession(test_engine) as session:
        yield session


@pytest.fixture(autouse=True)
def setup_test_db(monkeypatch):
    """테스트 파일 DB 생성 및 의존성 주입, 완료 후 정리"""
    SQLModel.metadata.create_all(test_engine)
    app.dependency_overrides[get_db] = override_get_db
    monkeypatch.setattr("app.api.v1.chat.engine", test_engine)
    yield
    SQLModel.metadata.drop_all(test_engine)
    app.dependency_overrides.clear()
    if os.path.exists(TEST_DB_PATH):
        try:
            os.remove(TEST_DB_PATH)
        except OSError:
            pass
