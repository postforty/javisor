# AGENTS.md

## 1. 프로젝트 구조 및 스택
- `apps/web`: Next.js 16 (App Router), React 19, Tailwind CSS v4 (포트: 3000)
- `apps/api`: FastAPI, Python 3.12+, Pydantic v2, LangChain (포트: 8000)
- `LLM 엔진`: Google Gemini (기본: `gemini-3.8-flash`, 초저지연/대체: `gemini-3.5-flash-lite`)
- `workspace/troubleshooting/`: 버그 해결 및 프롬프트 오케스트레이션 기록

## 2. 주요 명령어
- 실행 및 검증: `npm run dev:api` | `npm run dev:web` | `npm run test:api` | `npm run build` | `npm run lint`
- 패키지 추가: 웹 `npm install <pkg> -w web` | 백엔드(`apps/api`) `uv add <pkg>`
- 런타임: Node `nvm` (`.nvmrc`), Python `uv`

## 3. 보안 및 환경 설정
- **시크릿 노출 엄격 금지**: 코드, 문서, 커밋에 실제 키/URL 기재 금지. 항상 `.env.example` 및 플레이스홀더(`<your-ref>`, `sb_publishable_...`) 사용
- **Supabase Key**: Publishable Key(`sb_publishable_...`) 규격 사용

## 4. 개발 원칙 (Vertical Slice E2E)
큰 단위 개발 대신 **"작은 기능 단위 E2E 수직 슬라이스"** 방식으로 개발합니다:
1. **스펙 정의**: 기능 요구사항 및 데이터 스키마 확정
2. **백엔드 (TDD)**: 기능 개발 시 `.agents/workflows/tdd.md` 워크플로우(`/tdd`)를 필수로 적용하며, `pytest`(`npm run test:api`) 기반으로 Red ➔ Green ➔ Refactor 사이클 준수
3. **프런트엔드 (FSD)**: 기능별 격리 개발
   - `app/`: 라우팅 진입점 역할만 수행
   - `features/`: 사용자 인터랙션 및 상태 로직 (`ui`, `model`, `api`)
   - `entities/`: 도메인 모델 / `shared/`: 공통 컴포넌트 및 유틸
4. **E2E 검증**: API 연동 및 브라우저 검증 완료 후 다음 기능 진행

- **가이드라인 준수**:
  - 코딩 스타일: `.agents/skills/coding-guidelines/SKILL.md`
  - UI/스타일: 프런트엔드 UI 개발 시 `DESIGN.md`를 필수로 참조하여 테마 및 스타일 가이드 준수
- **언어 규칙**: 모든 사용자 응답/설명 및 소스 코드 주석은 **한국어** 작성

## 5. 트러블슈팅 문서화
- **사전 참조**: 작업 전 `workspace/troubleshooting/` 기존 해결 패턴 확인
- **기록 작성**: `workspace/troubleshooting/[번호]-[키워드].md` 작성 후 `README.md` 목록 갱신
- **핵심 기록**: 개발자의 실제 프롬프트와 지시 의도(Prompt Orchestration) 반드시 포함
