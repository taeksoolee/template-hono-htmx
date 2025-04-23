import type { FC } from 'hono/jsx';
import DefaultLayout from '../layouts/default.js';
import type { WithContext } from '../types/index.js';
import { counterMeta } from '../partials/counter/index.js';
import { id, num } from '../helper/index.js';

const counterId = id('counter');

const Index: FC<WithContext<object>> = (props) => {
  const defaultCount = num(props.context.req.query('count') || '');

  return (
    <DefaultLayout title="Home">
      <div>
        <h1> Hello World </h1>
        <div
          id={counterId}
          hx-get={counterMeta.url({
            id: counterId,
            count: defaultCount
          })}
          hx-trigger="load"
        ></div>
      </div>
    </DefaultLayout>
  )
}

export default Index;