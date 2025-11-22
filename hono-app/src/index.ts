import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = new Hono()

app.get('/', async (c) => {
  try {
    const htmlPath = path.join(__dirname, 'views', 'index.html')
    const htmlContent = await fs.readFile(htmlPath, 'utf-8')
    return c.html(htmlContent)
  } catch (error) {
    console.error('Error reading HTML file:', error)
    return c.text('Internal Server Error', 500)
  }
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})