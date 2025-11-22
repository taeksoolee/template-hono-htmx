export const logRegist = (method: 'get' | 'post' | 'put' | 'delete', routePath: string, renderFile?: string) => {
  if (renderFile) {
    console.log(`[${method}] Registering route for "${routePath}", rendering file: "${renderFile}"`);
  } else {
    console.log(`[${method}] Registering route for "${routePath}"`);
  }
}