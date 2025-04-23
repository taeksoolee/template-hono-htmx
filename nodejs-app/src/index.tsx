import { serve } from "@hono/node-server";
import { Hono, type Context } from "hono";

import fs from 'fs';
import path from 'path';
import type { z } from "zod";

type Route = {
  component: () => Promise<{ default: any }>;
  meta: () => Promise<{
    url?: (props: any) => string;
    parse?: (props: object) => z.infer<z.ZodType<any>>;
  }>;
}

type RouteMap = {
  [path: string]: Route;
}

type RenderRoutesOptions = {
  prefix?: string;
}

const loadRoutes = (dir: string, basePath: string, routeMap: RouteMap=routes) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      loadRoutes(filePath, path.join(basePath, file.replace(/^\./, '')), routeMap);
    } else if (file.endsWith('index.tsx')) {
      const routePath = '/' + path.join(basePath).replace(/\./, '');
      const imported = import(filePath);
      const component = () => imported;
      const meta = () => imported.then(({meta}) => meta || {});
      
      const route = {
        component,
        meta,
      };

      routeMap[routePath] = route;
    }
  }
};

const renderRoute = async (route: Route, context: Context) => {
  const { default: Component } = await route.component();
  const props = {
    context
  };
  
  return <Component {...props} />;
}

const renderRoutes = async (routeMap: RouteMap, options?: RenderRoutesOptions) => {
  const prefix = options?.prefix || '';

  for (const [path, route] of Object.entries(routeMap)) {
    app.get(prefix + path, async (c) => {
      const meta = await route.meta();

      if (meta.parse) {
        const parsed = meta.parse(c);
        if (parsed.error) {
          return c.text('Invalid props', 400);
        }
      }

      const component = await renderRoute(route, c);
      return c.render(component);
    });
  }
};

const __dirname = path.resolve();

const app = new Hono();

const routes: RouteMap = {};
const pagesDir = path.join(__dirname, 'src', 'pages');

loadRoutes(pagesDir, '', routes);
renderRoutes(routes);

const partialsRoutes: RouteMap = {};
const partialsDir = path.join(__dirname, 'src', 'partials');
loadRoutes(partialsDir, '', partialsRoutes);
renderRoutes(partialsRoutes, {
  'prefix': '/partials',
});



/**
 * auth
 */

const USER_DATA = {
  username: 'admin',
  password: 'admin'
}

app.post('/login', async (c) => {
  const username = (await c.req.formData()).get('username')
  const password = (await c.req.formData()).get('password')

  // 로그인 검증
  if (username === USER_DATA.username && password === USER_DATA.password) {
    // TODO: 로그인 성공 시 처리
    return c.render(
      <div id="response">
        <p style="color: green;">Login successful! Welcome, ${username}.</p>
      </div>
    )
  } else {
    // 로그인 실패 시
    return c.render(
      <div class="notification is-danger is-light">
        <button class="delete" hx-on="click: this.parentElement.remove()"></button>
        ❌ 이메일 또는 비밀번호가 올바르지 않습니다.
      </div>
    )
  }
})

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
