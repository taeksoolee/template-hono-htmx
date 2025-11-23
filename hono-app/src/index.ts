import { serve } from '@hono/node-server';

import { Hono } from 'hono';
import { useSession } from '@hono/session';
import nunjucks from 'nunjucks';
import { __dirname, viewsDir } from './const.js';
import { setAuth } from './utils/set-auth.js';
import { viewTemplates } from './utils/view-templates.js';
import got from 'got';
import { viewHzvPartialTemplates } from './feature/hzv/index.js';
import path from 'path';

const app = new Hono({ strict: false });

// Nunjucks 환경 설정
nunjucks.configure(__dirname, {
  autoescape: true,
});

// Session Middleware
app.use(useSession({
  secret: 'your-super-secret-key-that-is-at-least-32-chars-long', // TODO: Replace with a strong, randomly generated secret from environment variables
  // For simplicity, we'll use default session options.
  // In production, consider setting expiresIn, cookie.secure, cookie.sameSite, etc.
}));


setAuth(app, 'app', async ({username, password}) => {
  return username === 'user' && password === 'password'
});

setAuth(app, 'hzv', async ({username, password}) => {
  const getTokenUrl = 'https://apidev.vpphaezoom.com/api/user/token/';

  try {
    const { access, refresh } = await got.post(getTokenUrl, {
      json: {
        email: username,
        password: password
      },
    }).json<{access: string, refresh: string}>();

    return {
      accessToken: access,
      refreshToken: refresh,
    };
  } catch (error) {
    return null;
  }
});

viewTemplates(app, __dirname, path.join(__dirname, viewsDir), '/');

viewHzvPartialTemplates(app);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});