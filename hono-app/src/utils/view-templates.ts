
import { Hono } from "hono";
import path from "path";
import fs from "fs";
import nunjucks from 'nunjucks';

import { logRegist } from './log-regist';
import { createRoutePath } from "./create-route-path";

export const viewTemplates = (app: Hono, baseViewPath: string, currentDir: string, prefix: string) => {
  fs.readdirSync(currentDir, { withFileTypes: true }).forEach((e) => {
    const fullPath = path.join(currentDir, e.name);
    const relativePath = path.relative(baseViewPath, fullPath);

    if (e.isFile()) {
      if (path.extname(e.name) === '.html') {
        const routePath = createRoutePath(e.name, prefix);
        
        logRegist('get', routePath, relativePath);
        app.get(routePath.replace(/\/$/, ''), (c) => {
          const htmlContent = nunjucks.render(relativePath, {
            query: c.req.query(),
            currentPath: c.req.path
          });
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