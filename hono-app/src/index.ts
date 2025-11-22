import { serve } from '@hono/node-server';

import { Hono } from 'hono';
import { useSession } from '@hono/session';
import nunjucks from 'nunjucks';
import { viewsPath } from './const.js';
import { setAuth } from './utils/set-auth.js';
import { viewTemplates } from './utils/view-templates.js';

const app = new Hono();

// Nunjucks 환경 설정
nunjucks.configure(viewsPath, {
  autoescape: true,
});

// Session Middleware
app.use(useSession({
  secret: 'your-super-secret-key-that-is-at-least-32-chars-long', // TODO: Replace with a strong, randomly generated secret from environment variables
  // For simplicity, we'll use default session options.
  // In production, consider setting expiresIn, cookie.secure, cookie.sameSite, etc.
}));


setAuth(app, 'app', ({username, password}) => {
  return username === 'user' && password === 'password'
});

viewTemplates(app, viewsPath, viewsPath, '/');

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});