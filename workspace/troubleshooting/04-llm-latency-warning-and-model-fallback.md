# 04. Google Gemini API 응답 지연 감지 및 대체 모델(초저지연) 전환 UX 구현

## 1. 문제 상황 및 에러 로그
사용자가 대화창에서 질문(*"대한민국의 수도는?"*)을 전송했으나, 어시스턴트 메시지 버블이 빈 상태(`""`)로 멈춘 채 로딩 커서만 깜빡이고 하단에 `스트리밍 답변 생성 중 (Barge-in 대기)` 상태가 수십 초간 지속되는 현상 발생.

- **발생 위치**: 백엔드 `llm_service.py` ➔ 프런트엔드 `useChatStream.ts` 및 `MessageList.tsx`
- **증상**: `gemini-3.8-flash` 표준 지능 모드로 호출 시 첫 청크(TTFT: Time To First Token)가 도착하기까지 **19초 ~ 46초** 가량 소요되어 사용자가 화면 멈춤 및 버그로 오인.
- **원인 로그 (백엔드 계측)**:
  ```text
  google.genai.errors.ServerError: 503 UNAVAILABLE. {'error': {'code': 503, 'message': 'This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.', 'status': 'UNAVAILABLE'}}
  ```

## 2. 개발자의 실제 프롬프트 원문 및 지시 의도 (Prompt Orchestration)

### 개발자 프롬프트 원문
```text
[프롬프트 1] AI 답변이 너무 느린데 원인을 분석 후 보고해줘 (빈 버블 캡처 이미지 첨부)
[프롬프트 2] 지나치게 오래 기다려야 하는 상황에서는 사용자에게 서비스 지연 안내를 해주는 것이 어떨까?
[프롬프트 3] 일정 시간을 초과할 경우 서비스 지연을 안내하고 다른 저렴한 모델을 사용할 것인지 묻고 해당 모델을 선택할 수 있게 해줘
[프롬프트 4] 모델 변경 UI가 표시되었다가 잠시후에 빨간색 박스와 같이 표시되었어. (503 텍스트 덮어쓰기 캡처 이미지 첨부)
```

### 오케스트레이션 지시 의도
1. **1단계 (원인 규명 유도)**: 사용자가 체감하는 극심한 지연 증상을 캡처 이미지와 함께 제시하여, 에이전트가 백엔드/LLM 통신 계측과 SDK 동작 방식을 분석하여 기술적 근본 원인을 밝히도록 유도함.
2. **2단계 (사용자 중심 UX 발의)**: 단순히 외부 API 탓으로 돌리지 않고, 지연 상황에서 사용자가 불안해하지 않도록 서비스 지연 안내 피드백을 선제적으로 제공하는 사용자 경험(UX) 개선 아이디어를 발의함.
3. **3단계 (구체적 기능 스펙 확정)**: 지연 임계 시간 초과 시 지연 사유를 명확히 안내하고, 사용자가 빠르고 경제적인 대체 모델(`gemini-3.5-flash-lite`)을 즉시 선택하여 전환 및 답변을 재생성할 수 있도록 하는 E2E 기능 요구사항을 명시하여 구현을 지시함.
4. **4단계 (에러 덮어쓰기 결함 지적 및 완성도 제고)**: 4초 후 지연 UI가 떴으나 백엔드에서 503 에러 텍스트 청크가 유입되며 모델 전환 UI가 닫히고 날것의 에러 문자열로 덮어씌워지는 예외 상황을 이미지로 지적하여, 백엔드 SSE 에러 분리 및 프런트엔드 에러 상태에서도 모델 전환 UI가 유지되도록 완벽한 방어 로직을 유도함.

## 3. 해결 조치 및 코드 반영

### 근본 원인 분석
1. **Google Gemini 서버 일시적 과부하 (`503 UNAVAILABLE`)**:
   - `gemini-3.8-flash` 모델에 트래픽이 집중되어 503 에러가 빈번하게 발생함.
2. **SDK 내부 지수 백오프 자동 재시도 (Exponential Backoff Retry)**:
   - `google-genai` SDK는 503 오류 발생 시 최대 5회, 1초부터 최대 60초까지 지수적으로 재시도를 반복(`wait_exponential_jitter`).
   - 이로 인해 비동기 스트림 제너레이터가 첫 토큰을 내보내기까지 20~46초간 서버 연결이 블로킹됨.
3. **무응답 대기 상태 노출 및 에러 청크 둔갑 현상**:
   - 프런트엔드는 SSE 연결은 체결되었으나 첫 청크가 오지 않아 빈 텍스트 버블에 커서만 깜빡인 채 장시간 방치됨.
   - 또한 백엔드 `llm_service.py`가 503 예외 발생 시 에러 메시지를 일반 텍스트 청크로 `yield`하여, 프런트엔드가 이를 정상 답변으로 오인하고 지연 UI를 닫아버린 채 날것의 JSON 에러 문자열을 버블에 덮어씌움.

### 코드 수정 내역
1. [`apps/api/app/services/llm_service.py`](../../apps/api/app/services/llm_service.py):
   - 예외 발생 시 일반 문자열 yield를 중단하고 `raise RuntimeError`로 예외를 전파하여 상위 SSE 라우터에서 명시적 `type: "error"` 이벤트로 처리하도록 개선.
2. [`apps/web/src/shared/types/index.ts`](../../apps/web/src/shared/types/index.ts):
   - `ChatMessage`에 `errorInfo?: { message: string; isOverloaded?: boolean; }` 필드 추가.
3. [`apps/web/src/features/chat-workspace/model/useChatStream.ts`](../../apps/web/src/features/chat-workspace/model/useChatStream.ts):
   - `DELAY_THRESHOLD_MS = 4000`(4초) 지연 감지 타이머 구현.
   - 첫 유효 청크 도착 시 타이머 해제 및 정상 스트리밍 유지.
   - `data.type === 'error'` 및 비정상 통신 발생 시 503 과부하 여부를 판별하여 메시지에 `errorInfo` 기록.
   - `retryWithAlternativeModel(newModel)`: 기존 지연 스트리밍 중단(Abort), 모델 전환, 마지막 질의를 대체 모델로 즉시 재요청하는 로직 구현.
   - `dismissDelayNotice()`: 대기 희망 시 알림 닫기 핸들러 구현.
4. [`apps/web/src/features/chat-workspace/ui/MessageList.tsx`](../../apps/web/src/features/chat-workspace/ui/MessageList.tsx):
   - 503 과부하 에러 발생 시에도 날것의 에러 텍스트 대신 **`TELEMETRY // MODEL OVERLOAD (503)`** 전용 카드를 유지하여 **`[⚡ 초저지연 (3.5 Lite) 모델로 전환하여 재시도]`** 버튼을 상시 노출.
   - Kinetic Arc HUD 디자인 가이드(Stark Gold/Amber 테마)를 적용한 지연 경고 카드(`TELEMETRY // LATENCY WARNING`) 렌더링.
   - 원클릭 전환 버튼: `[⚡ 초저지연 (3.5 Lite) 모델로 전환]` (`#ffb95f` 액센트).
   - 보조 버튼: `[계속 대기]` 제공.
5. [`apps/web/src/features/chat-workspace/ui/ChatInputBar.tsx`](../../apps/web/src/features/chat-workspace/ui/ChatInputBar.tsx):
   - 지연 발생 시 하단 상태 인디케이터를 앰버 펄스(`통신 지연 감지 (엔진 전환 가능)`)로 전환하여 시각적 일관성 제공.
6. [`apps/web/src/features/chat-workspace/ui/ChatWorkspace.tsx`](../../apps/web/src/features/chat-workspace/ui/ChatWorkspace.tsx):
   - `useChatStream`의 지연 상태와 모델 전환 핸들러를 하위 컴포넌트로 전달 및 연동.

## 4. 검증 및 교훈

### 검증 결과
- `npm run lint`: ESLint 컨벤션 검사 100% 통과.
- `npm run build`: Turbopack Next.js 16 최적화 프로덕션 빌드 성공.
- `npm run test:api`: 백엔드 pytest 전원 통과 (4 passed).
- **성능 검증**: 대체 모델인 `gemini-3.5-flash-lite`로 전환 시 첫 청크 0.66초, 총 0.75초 만에 완료되어 지연 문제 완벽 해소.

### 교훈
- 외부 LLM API 서비스는 언제든 트래픽 폭주(503, 429)나 네트워크 지연이 발생할 수 있으므로, 단일 모델에만 의존하지 않고 클라이언트-서버 전반에 걸친 관측성(Observability) 및 지연 감지(Latency Detection) 피드백이 필수적임.
- 무작정 오류를 뱉거나 장시간 침묵하는 대신, 사용자가 직접 경량화된 경제적 모델로 Fallback을 결정할 수 있는 인터랙티브 선택권을 제공함으로써 UX 완성도와 서비스 신뢰성을 동시에 확보할 수 있음.

