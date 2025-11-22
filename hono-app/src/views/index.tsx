import { jsx } from 'hono/jsx'

export function IndexPage(props: { title: string }) {
  return (
    <div>
      <h1>{props.title}</h1>
      <p>이 페이지는 Hono의 JSX를 사용하여 렌더링되었습니다.</p>
    </div>
  )
}
