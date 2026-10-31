# 03. 상단 헤더 "+ NEW SESSION" 버튼 미동작 및 세션 초기화 이벤트 바인딩 누락 해결

## 1. 문제 상황 및 에러 로그
웹 프런트엔드(`apps/web`) 상단 HUD 헤더 컴포넌트(`Header.tsx`)의 우측 액션 버튼인 `+ NEW SESSION` 버튼을 클릭해도 기존 대화 목록이나 세션 상태가 초기화되지 않고 아무런 반응이 없는 현상 발생.

- **발생 위치**: `apps/web/src/shared/ui/Header.tsx` (모바일 및 데스크톱 공통 상단 헤더)
- **증상**: 대화 진행 중 `+ NEW SESSION` 버튼을 클릭해도 화면 전환 및 대화 초기화(리셋)가 전혀 수행되지 않음.

## 2. 개발자의 실제 프롬프트 원문 및 지시 의도 (Prompt Orchestration)

### 개발자 프롬프트 원문 (1차)
```text
빨간색 박스의 버튼이 동작하지 않고 있어
```
*(참고: 상단 헤더의 `+ NEW SESSION` 버튼 영역에 빨간색 사각 박스가 표시된 실제 모바일 웹 뷰 캡처 이미지 첨부)*

### 개발자 프롬프트 원문 (2차)
```text
빨간색 점은 제거하고 + 표시가 더 크게 보이도록 수정
```
*(참고: `+ NEW SESSION` 버튼 내부의 빨간 점 및 텍스트 클로즈업 캡처 이미지 첨부)*

### 개발자 프롬프트 원문 (3차)
```text
+ 버튼에서 텍스트는 제거하고 + 아이콘만 표시하는 것은 어떨까?
```
*(AI가 모바일 공간 효율성 및 미니멀 HUD 감성을 근거로 옵션 1(완전 아이콘 단독)과 옵션 2(반응형)를 제안)*

### 개발자 프롬프트 원문 (4차)
```text
옵션 1
```

### 개발자 프롬프트 원문 (5차)
```text
새로운 세션이 생성되면 빨간색 박스의 인풋창에 커서가 위치하도록
```
*(참고: 대기 화면 하단 캡슐형 입력창 영역에 빨간색 사각 박스가 표시된 모바일 캡처 이미지 첨부)*

### 오케스트레이션 지시 의도
- 1차: 개발자가 UI 화면 캡처 이미지와 함께 직관적인 지적을 전달하여, 에이전트가 시각 자료로부터 문제가 발생한 정확한 컴포넌트(`Header.tsx` 내 `+ NEW SESSION` 버튼)를 식별하고, 해당 버튼의 이벤트 핸들러 누락 및 상태 연결 결함을 스스로 추적하여 해결하도록 유도함.
- 2차: 기능 정상화 후, 버튼 내부의 불필요한 빨간색 상태 점(도트) 요소를 제거하고 `+` 기호를 강조하여 사용성을 직관적으로 개선하도록 UI 디자인 디테일 튜닝을 지시함.
- 3차 및 4차: 모바일 뷰포트 공간 최적화와 사이버네틱 HUD 테마의 미니멀리즘을 위해 텍스트(`NEW SESSION`)를 과감히 제거하고 접근성을 고려한 원형 `+` 아이콘 단독 버튼으로의 최종 디자인 개선을 결정함.
- 5차: 새 세션 버튼 클릭 시 사용자가 즉시 타이핑을 시작할 수 있도록 하단 명령 입력창(`ChatInputBar`)으로의 자동 포커스(Auto-Focus) 인터랙션을 연동하도록 UX 흐름 고도화를 지시함.

## 3. 해결 조치 및 코드 반영

### 근본 원인 분석
1. **이벤트 핸들러 미전달 (Prop Drifting 누락)**:
   - `Header.tsx` 컴포넌트는 `onNewSession?: () => void` 및 모델 상태 관련 prop(`activeModel`, `isGenerating`)을 인터페이스로 선언하고 있었음.
   - 하지만 최상위 페이지인 `apps/web/src/app/page.tsx`에서 `<Header />`를 호출할 때 아무런 prop도 넘겨주지 않아 `onNewSession`이 `undefined` 상태였음.
   - 데스크톱 사이드바(`Sidebar.tsx`)의 `새 프로토콜` 버튼 역시 동일하게 `onNewSession`이 전달되지 않고 있었음.
2. **상태 격리 (Isolated State)**:
   - 대화 세션의 초기화 메서드인 `clearSession()`(생성 중단, 메시지 목록 비우기, 세션 ID 리셋)은 `useChatStream` 훅에 이미 구현되어 있었음.
   - 그러나 `useChatStream`이 메인 화면인 `page.tsx`가 아닌 하위 컴포넌트인 `ChatWorkspace.tsx` 내부에서만 독립적으로 호출되고 있어 부모나 형제 컴포넌트(`Header`, `Sidebar`)로 제어권이 노출되지 못함.
3. **타 페이지 내비게이션 부재**:
   - 히스토리 페이지(`/history`) 및 설정 페이지(`/settings`)에서도 헤더와 사이드바가 렌더링되고 있으나 `onNewSession` 핸들러가 누락되어 새 세션 생성 시 메인 워크스페이스(`/`)로 복귀하지 못함.
4. **버튼 내 시각적 노이즈 및 가독성 결함**:
   - 버튼 내부에 작은 빨간색 핑 도트(`bg-[#dc2626]`)가 배치되어 시선이 분산되었고, `+` 기호가 일반 텍스트(`11px`) 크기로 작게 렌더링되어 액션 의미 전달력이 부족했음.

### 코드 수정 내역
1. [`apps/web/src/features/chat-workspace/ui/ChatWorkspace.tsx`](../../apps/web/src/features/chat-workspace/ui/ChatWorkspace.tsx):
   - 상위 컴포넌트에서 주입받을 수 있도록 `chatStream?: ReturnType<typeof useChatStream>` prop 추가. 외부 주입이 없는 경우 자체 인스턴스로 폴백하여 독립성 및 하위 호환성 유지.
2. [`apps/web/src/app/page.tsx`](../../apps/web/src/app/page.tsx):
   - `useChatStream()`을 상위 페이지 레벨로 끌어올림(State Lifting).
   - `Header`에 `onNewSession={chatStream.clearSession}`, `activeModel={chatStream.modelType}`, `isGenerating={chatStream.isGenerating}` 연결.
   - `Sidebar`에 `onNewSession={chatStream.clearSession}` 연결.
   - `ChatWorkspace`에 `chatStream={chatStream}` 전달.
3. [`apps/web/src/app/history/page.tsx`](../../apps/web/src/app/history/page.tsx) 및 [`apps/web/src/app/settings/page.tsx`](../../apps/web/src/app/settings/page.tsx):
   - `useRouter`를 연동하여 `+ NEW SESSION` 또는 사이드바 `새 프로토콜` 클릭 시 메인 대화 워크스페이스(`/`)로 안전하게 라우팅되도록 이벤트 핸들러 바인딩.
4. [`apps/web/src/shared/ui/Header.tsx`](../../apps/web/src/shared/ui/Header.tsx):
   - 버튼 내부의 빨간색 원형 닷 요소 및 `NEW SESSION` 텍스트를 제거.
   - 36px(`w-9 h-9`) 원형 규격의 터치 타깃을 확보하고, 중앙에 20px Material Symbols `add` 아이콘을 배치한 컴팩트 HUD 버튼으로 개편.
   - 웹 접근성 및 마우스 툴팁을 위해 `aria-label="새 세션 시작"`, `title="새 세션 시작"` 속성 추가.
5. [`apps/web/src/features/chat-workspace/ui/ChatInputBar.tsx`](../../apps/web/src/features/chat-workspace/ui/ChatInputBar.tsx) 및 [`ChatWorkspace.tsx`](../../apps/web/src/features/chat-workspace/ui/ChatWorkspace.tsx):
   - `useChatStream`에 세션 초기화 카운터(`resetCount`)를 도입하여 세션 리셋 시점을 추적.
   - `ChatInputBar`의 `<input>` 태그에 `inputRef` 및 `autoFocus`를 연결.
   - `ChatWorkspace`에서 `resetCount` 변화를 감지하는 `useEffect`를 통해 새 세션 생성 시 인풋창에 자동으로 커서가 포커스되도록 구현.

## 4. 검증 및 교훈

### 검증 결과
- `npm run build`: Turbopack 기반 Next.js 정적 빌드 및 TypeScript 컴파일 성공 (0개 에러).
- `npm run lint`: ESLint 규칙 및 React 19 컨벤션 전체 통과.
- `npm run test:api`: 백엔드 pytest 테스트 전원 통과 (4 passed).

### 교훈
- UI 컴포넌트(`Header`, `Sidebar`)에 이벤트 콜백 prop이 정의되어 있더라도 상위 페이지 컨테이너에서 실제로 바인딩되지 않으면 무반응 결함(Silent Failure)이 발생함.
- 페이지 전역에서 공통으로 조작해야 하는 도메인 상태(대화 세션 초기화, 활성 모델 변경 등)는 형제 컴포넌트 간 공유가 용이하도록 상태를 적절한 레벨로 끌어올리거나(State Lifting) 일관된 인터페이스를 설계해야 함.
