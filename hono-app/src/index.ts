import { serve } from '@hono/node-server'

import { Hono } from 'hono'
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

const viewTemplates = (curPath: string, prefix: string) => {
  fs.readdirSync(curPath, { withFileTypes: true }).forEach((e) => {
    if (e.isFile()) {
      if (path.extname(e.name) === '.html') {
        const routePath = createRoutePath(e.name, prefix);
        console.log(`Registering route for ${routePath}, rendering file: ${(prefix + e.name).slice(1)}`);
        
        app.get(routePath, (c) => {
          const htmlContent = nunjucks.render((prefix + e.name).slice(1), {})
          return c.html(htmlContent)
        })
      }
    } else {
      viewTemplates(path.join(curPath, e.name), `${prefix}${e.name}/`)
    }
  })
}

const app = new Hono()

const viewsPath = path.join(__dirname, 'views')

// Nunjucks 환경 설정
nunjucks.configure(viewsPath, {
  autoescape: true,
})

viewTemplates(viewsPath, '/');

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
