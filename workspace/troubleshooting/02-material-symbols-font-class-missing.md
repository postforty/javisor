# 02. Next.js 16/Tailwind v4 환경 Material Symbols 아이콘 미표시 및 텍스트 노출 해결

## 1. 문제 상황 및 에러 로그
웹 프런트엔드(`apps/web`) 실행 화면에서 UI 컴포넌트(하단 모바일 탭 네비게이션, 퀵 액션 카드, 사이드바 등)의 아이콘이 정상 렌더링되지 않고, 아이콘의 식별자 문자열(`monitor_heart`, `shield`, `chat_bubble`, `history`, `tune` 등)이 화면에 텍스트 형태로 그대로 노출되는 현상 발생.

## 2. 개발자의 실제 프롬프트 원문 및 지시 의도 (Prompt Orchestration)

### 개발자 프롬프트 원문 (1차)
```text
이 프로젝트에서 아이콘이 표시되지 않고 있어. 원인을 분석 후 보고해줘
```
*(참고: 실제 웹 렌더링 결과 캡처 이미지 첨부)*

### 개발자 프롬프트 원문 (2차)
```text
방안 A 로 진행해
```

### 개발자 프롬프트 원문 (3차)
```text
아이콘 여전히 텍스트로 표시되고 있어. 원인을 차근 차근 면밀히 분석 후 보고해줘
```

### 개발자 프롬프트 원문 (4차)
```text
수정해
```

### 오케스트레이션 지시 의도
- 1차: 시각적 결함 캡처 이미지를 공유하며 아이콘 미표시의 원인을 우선 체계적으로 분석하여 보고하도록 유도함.
- 2차: 제안된 해결 방안 중 전역 CSS 클래스 선언(방안 A)을 채택하여 신속한 코드 반영을 지시함.
- 3차: 방안 A 적용 후에도 브라우저에서 여전히 텍스트로 표시되는 증상을 공유하고, 표면적 원인에 그치지 않고 빌드/번들링 내부 동작을 차근차근 면밀히 추적하여 재분석하도록 유도함.
- 4차: 최종 도출된 근본 해결책(HTML `<head>` 직결 `<link>` 방식 및 `@import` 제거)을 프로젝트에 반영하도록 지시함.

## 3. 해결 조치 및 코드 반영

### 1단계 분석 및 조치 (방안 A)
- **분석**: 최신 Google 가변 폰트(`Material Symbols`)는 과거 `Material Icons`와 달리 `@font-face`만 제공하고 `.material-symbols-outlined` 클래스 정의를 내려주지 않음.
- **조치**: `apps/web/src/app/globals.css`에 `.material-symbols-outlined` 클래스 스타일 추가.

### 2단계 심층 원인 분석 (증상 지속 원인 규명)
- 빌드 산출물(`.next/static/chunks/*.css` 및 정적 HTML)을 역추적한 결과, 클래스 정의는 포함되었으나 `globals.css` 1행의 `@import url('https://fonts.googleapis.com/...');` 구문이 **Next.js 16(Turbopack) 및 Tailwind CSS v4(LightningCSS) 번들링 과정에서 완전히 탈락(Drop)**되어 빌드 결과물에서 통째로 누락됨을 발견.
- **원인**: CSS 표준 스펙상 `@import`는 파일 최상단에만 위치해야 하나, 번들러가 `next/font`의 `@font-face` 및 `@layer theme`을 최상단에 주입하면서 외부 `@import url(...)`을 비표준 구문으로 간주하여 컴파일 시 삭제함.
- **결과**: 브라우저는 `font-family: 'Material Symbols Outlined'`를 인식하지만 폰트 파일을 다운로드할 URL이 없어 요청을 보내지 못하고, `Inter` 폰트로 fallback되면서 합자(Ligature)가 동작하지 않아 텍스트가 그대로 노출됨.

### 최종 코드 수정 내역
1. [`apps/web/src/app/layout.tsx`](../../apps/web/src/app/layout.tsx): 번들러의 개입을 피하고 브라우저가 최우선순위로 다운로드하도록 `<head>` 태그에 Google Fonts `<link>` 선언 추가:
   ```tsx
   <head>
     {/* Google Material Symbols 가변 웹폰트 CDN 로드 */}
     <link rel="preconnect" href="https://fonts.googleapis.com" />
     <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
     {/* eslint-disable-next-line @next/next/no-page-custom-font */}
     <link
       rel="stylesheet"
       href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
     />
   </head>
   ```
2. [`apps/web/src/app/globals.css`](../../apps/web/src/app/globals.css): 번들러에서 무시되는 최상단 `@import url(...)` 제거 (기반 `.material-symbols-outlined` 클래스 스타일은 유지).

## 4. 검증 결과 및 교훈

### 검증 결과
1. **정적 빌드 HTML 검증 (`apps/web/.next/server/app/index.html`)**:
   - `<head>` 내에 `fonts.googleapis.com` preconnect 및 stylesheet link가 정상 주입됨.
   - Next.js가 이를 인식하여 `as="style"` preload 태그까지 자동 최적화 생성 확인.
2. **ESLint 정적 검사 (`npm run lint -w web`)**: 린트 경고 및 오류 0건 통과.
3. **프로덕션 빌드 (`npm run build`)**: Next.js 16 (Turbopack) 프로덕션 최적화 빌드 정상 통과.

### 교훈
- Next.js 16 및 Tailwind CSS v4 환경에서는 CSS 파일 내부의 원격 `@import url(...)`이 번들링 과정에서 drop될 수 있으므로, 외부 웹폰트는 반드시 루트 레이아웃(`layout.tsx`)의 `<head>` 태그 내에 `<link rel="stylesheet">`로 선언하거나 로컬 폰트 패키지로 관리해야 안정적인 렌더링이 보장됨.
