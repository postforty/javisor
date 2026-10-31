# 01. Windows 환경 uv trampoline 스크립트 경로 해석 오류 해결

## 1. 문제 상황 및 에러 로그
루트 디렉터리에서 `npm run dev:api` 또는 `npm run test:api` 실행 시, Windows 환경에서 uv trampoline 실행 파일 바이너리 shim이 스크립트 경로를 정규화(canonicalize)하지 못하고 즉시 중단되는 에러 발생.

```
PS D:\wsh\vibe-coding\ch14\jarvisor> npm run dev:api

> javisor-monorepo@1.0.0 dev:api
> uv run --directory apps/api uvicorn app.main:app --reload --port 8000

error: uv trampoline failed to canonicalize script path
```

## 2. 개발자의 실제 프롬프트 원문 및 지시 의도 (Prompt Orchestration)

### 개발자 프롬프트 원문
```text
PS D:\wsh\vibe-coding\ch14\jarvisor> npm run dev:api

> javisor-monorepo@1.0.0 dev:api
> uv run --directory apps/api uvicorn app.main:app --reload --port 8000

error: uv trampoline failed to canonicalize script path

---
백엔드 구성시에 오류 발생
```

### 오케스트레이션 지시 의도
- `npm run dev:api` 실행 시 발생한 Windows uv 런타임 에러 로그를 정확히 공유하여, 백엔드 개발 서버가 정상 구동될 수 있도록 원인 규명 및 스크립트 설정 수정을 유도함.

## 3. 해결 조치 및 코드 반영

### 원인 분석
- `uv run <command>` 실행 시 uv는 가상환경(`.venv/Scripts/`) 내에 생성된 실행 파일 shim(`uvicorn.exe`, `pytest.exe` 등, 각 47KB 크기의 uv trampoline 바이너리)을 호출함.
- Windows 환경에서는 이 trampoline 바이너리가 스크립트 파일 경로를 탐색/정규화(`canonicalize`)하는 과정에서 파일 경로 불일치 또는 심볼릭 링크 처리 오류로 인해 `failed to canonicalize script path`를 발생시킴.
- 반면 `python -m <module>` 형태로 Python 인터프리터를 통해 직접 모듈을 로드하면 uv trampoline 래퍼를 거치지 않고 안정적으로 실행됨.

### 코드 수정 내역
루트의 [`package.json`](../../package.json) 내 `dev:api` 및 `test:api` 스크립트를 `python -m` 방식으로 변경:

```json
// package.json 수정 전
"dev:api": "uv run --directory apps/api uvicorn app.main:app --reload --port 8000",
"test:api": "uv run --directory apps/api pytest",

// package.json 수정 후
"dev:api": "uv run --directory apps/api python -m uvicorn app.main:app --reload --port 8000",
"test:api": "uv run --directory apps/api python -m pytest tests",
```

## 4. 검증 결과 및 교훈

### 검증 결과
1. **API 단위/통합 테스트 (`npm run test:api`)**:
   - `tests/test_chat_stream.py`, `tests/test_health.py`, `tests/test_sessions.py` 4개 테스트 모두 정상 통과 (0.49s).
2. **개발 서버 구동 (`npm run dev:api`)**:
   - Uvicorn 개발 서버가 `http://127.0.0.1:8000`에서 정상적으로 기동되고 `GET /health` 요청 시 `status: healthy`, `telemetry: ONLINE` 정상 응답 수신 확인.

### 교훈
- Windows 환경에서 uv 가상환경의 실행 파일(`*.exe`) shim을 직접 호출하는 대신, `python -m <module>` 형태로 명시적 호출하는 것이 크로스 플랫폼 호환성과 실행 안정성을 보장함.

