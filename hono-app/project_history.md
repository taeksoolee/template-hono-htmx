# Hono.js 프로젝트 생성 및 TypeScript 전환 히스토리

## 1. Hono.js 프로젝트 생성 (JavaScript)

### 요청 사항
- Hono 프레임워크를 사용하는 새로운 JS 프로젝트 생성
- 기본 `index` 라우트 설정

### 처리 내역
- `hono-app` 디렉토리 생성
- `npm init -y`를 사용하여 `package.json` 생성
- `hono` 및 `@hono/node-server` 패키지 설치
- ES 모듈을 사용하도록 `package.json`에 `"type": "module"` 추가
- `node index.js`를 실행하는 `start` 스크립트 추가
- "Hello Hono!"를 반환하는 기본 서버 코드를 포함한 `index.js` 파일 생성

## 2. .gitignore 파일 추가

### 요청 사항
- `.gitignore` 파일 추가

### 처리 내역
- `node_modules`, `.env` 등을 무시하는 표준 Node.js 용 `.gitignore` 파일 생성

## 3. TypeScript 전환

### 요청 사항
- 프로젝트를 TypeScript를 사용하도록 수정

### 처리 내역
- 개발 의존성으로 `typescript`, `@types/node`, `tsx` 설치
- Hono JSX 설정을 포함한 `tsconfig.json` 파일 생성
- `index.js` 파일의 이름을 `index.ts`로 변경
- `package.json`의 `start` 스크립트를 `tsx watch index.ts`로 수정하여, 파일 변경 시 자동으로 서버가 재시작되도록 설정

## 4. tsconfig.json 오류 수정

### 요청 사항
- `moduleResolution` 옵션 관련 deprecated 경고 해결

### 처리 내역
- `tsconfig.json` 파일의 `compilerOptions.moduleResolution` 값을 `'node'`에서 `'bundler'`로 수정하여 문제 해결
