import { serve } from '@hono/node-server'

import { Hono } from 'hono'
import { useSession, Session } from '@hono/session'
import { createMiddleware } from 'hono/factory'
import nunjucks from 'nunjucks'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 파일 이름에 따라 라우트 경로 생성
const createRoutePath = (fileName: string, prefix: string) => {
  return `${prefix}${path.basename(fileName, '.html') === 'index' ? '' : path.basename(fileName, '.html')}`
}

// viewTemplates 함수를 Hono 인스턴스를 인수로 받도록 수정
const viewTemplates = (honoApp: Hono, baseViewPath: string, currentDir: string, prefix: string) => {
  fs.readdirSync(currentDir, { withFileTypes: true }).forEach((e) => {
    const fullPath = path.join(currentDir, e.name);
    const relativePath = path.relative(baseViewPath, fullPath);

    if (e.isFile()) {
      if (path.extname(e.name) === '.html') {
        const routePath = createRoutePath(e.name, prefix);
        console.log(`Registering route for ${routePath}, rendering file: ${relativePath}`);
        
        honoApp.get(routePath, (c) => {
          const htmlContent = nunjucks.render(relativePath, {})
          return c.html(htmlContent)
        })
      }
    } else if (e.isDirectory()) {
      viewTemplates(honoApp, baseViewPath, fullPath, `${prefix}${e.name}/`)
    }
  })
}

const app = new Hono()

// Nunjucks 환경 설정
const viewsPath = path.join(__dirname, 'views')
nunjucks.configure(viewsPath, {
  autoescape: true,
})

// Session Middleware
app.use(useSession({
  secret: 'your-super-secret-key-that-is-at-least-32-chars-long', // TODO: Replace with a strong, randomly generated secret from environment variables
  // For simplicity, we'll use default session options.
  // In production, consider setting expiresIn, cookie.secure, cookie.sameSite, etc.
}))

// Authentication Middleware
const authMiddleware = createMiddleware(async (c, next) => {
  const session = c.var.session as Session
  const isLoggedIn = await session.get('isLoggedIn')

  if (!isLoggedIn) {
    // Redirect to login page if not logged in
    return c.redirect('/auth/login')
  }
  await next()
})

// Public routes (no authentication required)
// Login page
app.get('/auth/login', (c) => {
  const htmlContent = nunjucks.render('auth/login.html', {})
  return c.html(htmlContent)
})

// Login POST handler
app.post('/auth/login', async (c) => {
  const { username, password } = await c.req.parseBody()
  // Dummy authentication check
  if (username === 'user' && password === 'password') {
    const session = c.var.session as Session
    await session.set('isLoggedIn', true)
    return c.redirect('/app')
  } else {
    // For simplicity, just redirect back to login with an error (or render error on page)
    return c.redirect('/auth/login?error=invalid_credentials')
  }
})

// Logout route
app.get('/auth/logout', async (c) => {
  const session = c.var.session as Session
  await session.delete()
  return c.redirect('/auth/login')
})

// Register public routes (excluding 'app' and 'auth' directories)
fs.readdirSync(viewsPath, { withFileTypes: true }).forEach((e) => {
  const fullPath = path.join(viewsPath, e.name);
  if (e.isDirectory() && (e.name === 'app' || e.name === 'auth')) {
    // Skip 'app' and 'auth' directories as they are handled separately
    return;
  }
  if (e.isFile() && path.extname(e.name) === '.html') {
    const routePath = createRoutePath(e.name, '/');
    console.log(`Registering public route for ${routePath}, rendering file: ${e.name}`);
    app.get(routePath, (c) => {
      const htmlContent = nunjucks.render(e.name, {})
      return c.html(htmlContent)
    })
  } else if (e.isDirectory()) {
    // Recursively register templates for other public subdirectories
    viewTemplates(app, viewsPath, fullPath, `/${e.name}/`);
  }
});


// Apply authMiddleware to routes under /app
const appGroup = app.group('/app')
appGroup.use(authMiddleware)

// Register templates for authenticated /app routes
viewTemplates(appGroup, viewsPath, path.join(viewsPath, 'app'), '/')


const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})