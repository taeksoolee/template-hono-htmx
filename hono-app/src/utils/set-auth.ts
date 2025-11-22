import { Hono } from "hono";
import nunjucks from 'nunjucks';
import { createMiddleware } from "hono/factory";

import { AuthName } from "../types/auth-name";
import { CheckSign, CreateAuthMiddlewareOptions } from "../types/set-auth";
import { logRegist } from "./log-regist";
import { viewTemplates } from "./view-templates";
import path from "path";
import { viewsPath } from "../const";

/**
 * 이 함수는 middleware를 생성하여 특정 경로(/[name]/**)에 대한 인증을 처리합니다.
 * 
 * login, logout 경로를 자동 등록합니다.
 * 
 * 반드시 views/_auth/[name]/login.html 파일을 생성해야 합니다. (이 파일은 로그인 폼을 렌더링하는데 사용)
 * 
 * @example 
 * - name을 app으로 지정하는 경우 다음과 같은 경로가 생성됩니다.
 *   - /auth/app/login (GET, POST) - GET은 로그인 폼을 제공하고, POST는 사용자 인증을 처리
 *   - /auth/app/logout (GET) - 사용자를 로그아웃 처리
 *   - views/auth/app/login.html 파일 생성필요
 *   - 인증이 필요한 경로는 /app/* 형태로 접근 가능
 */
export const setAuth = (app: Hono, name: AuthName, checkSign: CheckSign, options?: CreateAuthMiddlewareOptions) => {
  const {
    invalidInputMessage = 'Invalid input. Please provide both username and password.',
    invalidCredentialsMessage = 'Invalid credentials. Please try again.'
  } = options || {};

  const appUrl = `/${name}`;
  const loginUrl = `/auth/${name}/login`;
  const logoutUrl = `/auth/${name}/logout`;

  const loginFile = `_auth/${name}/login.html`;

  // Authentication Middleware
  const authMiddleware = createMiddleware(async (c, next) => {
    const session = c.var.session;
    const { isLoggedIn } = (await session.get())?.[name] || {};

    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      return c.redirect(loginUrl);
    }
    
    await next();
  });


  logRegist('get', loginUrl, loginFile);
  app.get(loginUrl, async (c) => {
    const session = c.var.session;
    const { isLoggedIn } = (await session.get())?.[name] || {};

    if (isLoggedIn) {
      return c.redirect(appUrl);
    }

    const htmlContent = nunjucks.render(loginFile, {});
    return c.html(htmlContent);
  });

  logRegist('post', loginUrl);
  app.post(loginUrl, async (c) => {
    const { username, password } = await c.req.parseBody();

    if (typeof username !== 'string' || typeof password !== 'string') {
      return c.redirect(`${loginUrl}?error=${invalidInputMessage}`);
    }

    if (!checkSign({username, password})) {
      return c.redirect(`${loginUrl}?error=${invalidCredentialsMessage}`);
    }

    const session = c.var.session;
    await session.update({ [name]: { isLoggedIn: true } });
    return c.redirect(appUrl);
  });

  logRegist('get', logoutUrl);
  app.get(logoutUrl, async (c) => {
    const session = c.var.session;
    await session.update({ [name]: { isLoggedIn: false } });
    return c.redirect(loginUrl);
  });

  const authRouter = new Hono();
  authRouter.use(authMiddleware);

  // Register templates for authenticated /app routes
  viewTemplates(authRouter, viewsPath, path.join(viewsPath, `_${name}`), `/${name}`);

  app.route(`/`, authRouter);


  return authMiddleware;
};