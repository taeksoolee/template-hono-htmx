# Gemini 프로젝트 설정

이 파일은 Gemini CLI 에이전트가 이 프로젝트에서 작업을 수행할 때 참고하는 설정 파일입니다.

## 📜 규칙 (Rules)

- 하나의 작업이 끝난후에는 이 파일 아래 작업 히스토리를 기록하고, 적절한 깃 커밋 메시지를 작성하여 커밋을 실행해야 한다.
- 요청이 깃 커밋을 실행하라는 경우 히스토리는 작성하지 않는다.
- 깃 커밋 메시지 작성시에는 제목, 내용 모두 한글로 작성해야 한다.
- 주석은 기본 한글로 달며, 필요한 경우 영문을 포함해야 한다.
- 주석은 꼭 필요한곳에만 추가하고 최대한 코드만 읽었을때 해석이 되도록 해야 한다.

---

## 📚 작업 히스토리 (Work History)

이 섹션에는 이 프로젝트에서 수행된 작업 내역이 기록됩니다.

- **2025-11-22**:
  - **`hono-app` 프로젝트 초기 설정:**
    - JavaScript 기반 Hono 프로젝트 생성 (`hono`, `@hono/node-server` 설치).
    - TypeScript로 전환 (`typescript`, `@types/node`, `tsx` 설치).
    - `tsconfig.json` 설정 및 `moduleResolution: 'bundler'`로 수정.
    - `package.json`에 `start:tsx` 스크립트 설정.
    - Node.js 표준 `.gitignore` 파일 추가.
  - **커밋 내역:**
    - `feat: TypeScript 기반 hono-app 초기화`
    - `docs: Gemini 에이전트 규칙 추가`
    - `docs: 작업 히스토리 업데이트`
  - **히스토리 관리 변경:**
    - `project_history.md` 내용을 `GEMINI.md`에 통합하고 파일 삭제.
  - **`hono-app` 렌더링 방식 변경 (JSX -> 정적 HTML):**
    - 사용자의 요구사항을 재확인하여, JSX 렌더링 방식에서 정적 `.html` 파일을 직접 서빙하는 방식으로 변경.
    - 기존 `layout.tsx`, `index.tsx` 삭제 및 `index.tsx`를 `index.ts`로 이름 변경.
    - `src/views/index.html` 정적 파일 생성.
    - `fs/promises`를 사용하여 `index.html` 파일을 읽고 `c.html()`으로 서빙하도록 `src/index.ts` 수정.
  - **`hono-app` 템플릿 엔진 Nunjucks 도입:**
    - `nunjucks` 및 `@types/nunjucks` 패키지 설치.
    - `index.ts`에서 Nunjucks 환경을 설정하고, `fs`를 사용한 정적 파일 읽기 로직을 `nunjucks.render()`로 대체.
    - `views/index.html` 파일을 Nunjucks 변수 `{{ }}`를 사용하도록 수정.
- **2025-11-23**:
  - **`hono-app` 동적 라우팅 및 Nunjucks 템플릿 확장:**
    - `hono-app/src/index.ts`를 수정하여 `views` 디렉토리 내의 `.html` 파일을 동적으로 읽고 Nunjucks 템플릿 엔진을 사용하여 라우팅 처리.
    - `fs` 및 `path` 모듈을 사용하여 파일 시스템을 탐색하고 라우트 경로를 생성하는 `createRoutePath` 및 `viewTemplates` 함수 구현.
    - `hono-app/src/views/index.html` 내용을 "Hello from Hono with Nunjucks!"로 변경.
    - `hono-app/src/views/about.html`, `hono-app/src/views/auth/login.html`, `hono-app/src/views/app/index.html` 파일 추가 (또는 해당 디렉토리 생성).
  - **`hono-app` 인증 미들웨어 및 세션 관리 구현:**
    - `@hono/session` 패키지 설치.
    - `hono-app/src/index.ts`에 세션 미들웨어 (`sessionMiddleware`) 및 인증 미들웨어 (`authMiddleware`) 추가.
    - `/auth/login` (GET, POST) 및 `/auth/logout` 라우트 구현.
    - `/app` 경로에 `authMiddleware`를 적용하여 인증된 사용자만 접근 가능하도록 설정.
    - `viewTemplates` 함수를 리팩토링하여 Hono 인스턴스를 인수로 받아 라우트를 등록하도록 변경.
  - **`hono-app` 세션 미들웨어 import 및 사용법 수정:**
    - `sessionMiddleware` 대신 `useSession`을 `@hono/session`에서 import하도록 수정.
    - `app.use(sessionMiddleware(...))`를 `app.use(useSession(...))`로 변경.
    - 사용하지 않는 `hono/cookie` 관련 import 제거.
  - **`hono-app` 라우트 그룹 및 Session 타입 단언 수정:**
    - `app.group('/app')` 대신 `new Hono()` 인스턴스를 생성하고 `app.route('/app', appGroup)`을 사용하여 라우트 그룹을 등록하도록 수정.
    - `Session` 타입 단언에 제네릭 타입 인수를 추가하여 `Session<{ isLoggedIn: boolean }>`으로 변경.
  - **`hono-app` ContextVariableMap 타입 확장:**
    - `Property 'session' does not exist on type 'Readonly<ContextVariableMap>'` 오류 해결을 위해 `hono` 모듈에 `ContextVariableMap` 인터페이스를 확장하여 `session` 속성을 추가.
  - **`hono-app` Session 타입 단언 제거 및 `session.set`을 `session.update`로 변경:**
    - `c.var.session`에 대한 명시적인 `as Session<{ isLoggedIn: boolean }>` 타입 단언을 제거.
    - `session.set('isLoggedIn', true)` 호출을 `session.update({ isLoggedIn: true })`로 변경.
  - **`hono-app` `session.get` 사용법 수정:**
    - `session.get('isLoggedIn')` 대신 `session.data?.isLoggedIn ?? false`를 사용하여 세션 데이터에 접근하도록 수정.

---