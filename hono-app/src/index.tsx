import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { Layout } from './views/layout'
import { IndexPage } from './views'

const app = new Hono()

app.get('/', (c) => {
  return c.html(
    <Layout>
      <IndexPage title="Hono 앱" />
    </Layout>
  )
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
