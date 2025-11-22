import { html } from 'hono/html'
import { jsx } from 'hono/jsx'

// NOTE: `Layout` 컴포넌트는 함수 선언으로 정의해야 합니다.
// 화살표 함수로 정의할 경우, Hono의 JSX 렌더러에서 인식되지 않을 수 있습니다.
export function Layout(props: { children?: any; title?: string }) {
  return html`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${props.title || 'Hono App'}</title>
      </head>
      <body>
        ${props.children}
      </body>
    </html>
  `
}
