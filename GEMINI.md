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
    - `hono-app/src/views/about.html` 및 `hono-app/src/views/auth/login.html` 파일 추가 (또는 해당 디렉토리 생성).

---