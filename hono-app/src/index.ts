import { serve } from '@hono/node-server';

import { Hono } from 'hono';
import { useSession, Session } from '@hono/session';
import { createMiddleware } from 'hono/factory';
import nunjucks from 'nunjucks';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

type AuthName = 'app';

declare module 'hono' {
  interface ContextVariableMap {
    session: Session<Record<AuthName, {isLoggedIn: boolean }>>;
  }
}

const logRegist = (method: 'get' | 'post' | 'put' | 'delete', routePath: string, renderFile?: string) => {
  if (renderFile) {
    console.log(`[${method}] Registering route for "${routePath}", rendering file: "${renderFile}"`);
  } else {
    console.log(`[${method}] Registering route for "${routePath}"`);
  }
}

// __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 파일 이름에 따라 라우트 경로 생성
const createRoutePath = (fileName: string, prefix: string) => {
  return `${prefix}${path.basename(fileName, '.html') === 'index' ? '' : path.basename(fileName, '.html')}`;
};

const viewTemplates = (app: Hono, baseViewPath: string, currentDir: string, prefix: string) => {
  fs.readdirSync(currentDir, { withFileTypes: true }).forEach((e) => {
    const fullPath = path.join(currentDir, e.name);
    const relativePath = path.relative(baseViewPath, fullPath);

    if (e.isFile()) {
      if (path.extname(e.name) === '.html') {
        const routePath = createRoutePath(e.name, prefix);
        
        logRegist('get', routePath, relativePath);
        app.get(routePath, (c) => {
          const htmlContent = nunjucks.render(relativePath, {});
          return c.html(htmlContent);
        });
      }
    } else if (e.isDirectory()) {
      if (e.name.startsWith('_')) { // Skip private directories (those starting with '_')
        return;
      }

      viewTemplates(app, baseViewPath, fullPath, `${prefix}${e.name}/`);
    }
  });
};

const app = new Hono();

// Nunjucks 환경 설정
const viewsPath = path.join(__dirname, 'views');
nunjucks.configure(viewsPath, {
  autoescape: true,
});

// Session Middleware
app.use(useSession({
  secret: 'your-super-secret-key-that-is-at-least-32-chars-long', // TODO: Replace with a strong, randomly generated secret from environment variables
  // For simplicity, we'll use default session options.
  // In production, consider setting expiresIn, cookie.secure, cookie.sameSite, etc.
}));

type CheckSign = (credentials: {username: string, password: string}) => boolean;
type CreateAuthMiddlewareOptions = {
  invalidInputMessage?: string;
  invalidCredentialsMessage?: string;
}

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
const setAuth = (name: AuthName, checkSign: CheckSign, options?: CreateAuthMiddlewareOptions) => {
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
  app.get(loginUrl, (c) => {
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

  app.route(`/${name}`, authRouter);


  return authMiddleware;
};

setAuth('app', ({username, password}) => {
  return username === 'user' && password === 'password'
});

viewTemplates(app, viewsPath, viewsPath, '/');

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});