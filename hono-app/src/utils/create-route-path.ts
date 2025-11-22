import path from "path";

// 파일 이름에 따라 라우트 경로 생성
export const createRoutePath = (fileName: string, prefix: string) => {
  return `${prefix}${path.basename(fileName, '.html') === 'index' ? '' : path.basename(fileName, '.html')}`;
};