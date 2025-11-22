import type { MakePage } from "../../types/index.js";
import { num, str, target } from "../../helper/index.js";
import { z } from "zod";
import { PartialComponent } from "../../helper/hoc.js";

const schema = z.object({
  id: z.string(),
  // NaN is not allowed
  count: z.number().refine((val) => !isNaN(val)),
});

type Page = MakePage<typeof schema>;

export const meta: Page['Meta'] = {
  url: (props) => `/partials/counter?id=${props.id}&count=${props.count}`, 
  parse: (c) => schema.safeParse({
    id: str(c.req.query('id')),
    count: num(c.req.query('count') || ''),
  }),
};

const Counter: Page['FC'] = (props) => {
  const { id, count } = props;
  const { refererUrl } = props;

  const increaseCount = count + 1;
  const decreaseCount = count - 1;

  const increaseUrl = meta.url({id, count: increaseCount});
  const decreaseUrl = meta.url({id, count: decreaseCount});

  const increasePushUrl = refererUrl ? new URL(refererUrl) : null;
  increasePushUrl?.searchParams.set('count', String(increaseCount));
  const decreasePushUrl = refererUrl ? new URL(refererUrl) : null;
  decreasePushUrl?.searchParams.set('count', String(decreaseCount));

  return (
    <div>
      <h1>Counter</h1>
      <p>This is a simple counter component.</p>
      <button
        hx-target={target(id)}
        hx-get={increaseUrl}
        hx-trigger="click"
        // hx-push-url={increasePushUrl?.toString() || ''}
        // hx-replace-url={increasePushUrl?.toString() || ''}
      >Increment</button>
      <button
        hx-target={target(id)}
        hx-get={decreaseUrl}
        hx-trigger="click"
        // hx-push-url={increasePushUrl?.toString() || ''}
        // hx-replace-url={increasePushUrl?.toString() || ''}
      >Decrement</button>
      <p>Count: {count}</p>
    </div>
  );
}

export default PartialComponent(Counter, meta);
export const counterMeta = meta;