import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import nunjucks from 'nunjucks'
import path from 'path'
import { fileURLToPath } from 'url'

// __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = new Hono()

// Nunjucks 환경 설정
nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
})

app.get('/', (c) => {
  const data = {
    title: 'Nunjucks 템플릿',
    message: 'Hono와 Nunjucks를 사용하여 렌더링되었습니다!',
  }
  const htmlContent = nunjucks.render('index.html', data)
  return c.html(htmlContent)
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
