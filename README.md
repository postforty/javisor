# 자비서 (jarvisor)

영화 '아이언맨'의 JARVIS HUD 비주얼 테마(Kinetic Arc HUD)를 모티브로 한 미래지향적 인터페이스 기반 지능형 개인 비서 서비스입니다.

---

## 1. 아키텍처 및 기술 스택
- **프런트엔드 (`apps/web`)**: Next.js 16 (App Router), React 19, Tailwind CSS v4, FSD 패턴 (포트: 3000)
- **백엔드 (`apps/api`)**: FastAPI, Python 3.12+, Pydantic v2, SQLModel, LangChain / Google-GenAI (포트: 8000)
- **LLM 엔진**: Google Gemini (`gemini-3.8-flash` 표준 지능, `gemini-3.5-flash-lite` 초저지연 모드)
- **트러블슈팅 아카이브**: [workspace/troubleshooting/README.md](./workspace/troubleshooting/README.md)

---

## 2. 주요 실행 및 검증 명령어

```powershell
# 1. 백엔드 개발 서버 실행 (포트: 8000)
npm run dev:api

# 2. 프런트엔드 개발 서버 실행 (포트: 3000)
npm run dev:web

# 3. 백엔드 Pytest 단위/통합 테스트
npm run test:api

# 4. 프런트엔드 프로덕션 빌드
npm run build

# 5. 프런트엔드 ESLint 검증
npm run lint
```

---

## 3. 핵심 기능
1. **실시간 스트리밍 대화**: SSE(Server-Sent Events) 기반 타이핑 응답 및 Barge-in(실시간 생성 중단) 지원
2. **Kinetic Arc HUD 비주얼**: 자이로스코프 링 회전, 다이아몬드 프리즘 아크 리액터 코어 펄스 애니메이션
3. **4종 선제적 퀵 액션 카드**: DIAG, TACT, CODE, SCHED
4. **세션 히스토리 & 아카이빙**: 오늘/어제/이전 기록 타임라인 탐색, 중요 보관(★), JSON 내보내기/삭제
5. **시스템 환경 설정**: 페르소나 선택, 지능형 코어 엔진 선택, 자율 조치 권한 레벨, E2EE 보안 설정
