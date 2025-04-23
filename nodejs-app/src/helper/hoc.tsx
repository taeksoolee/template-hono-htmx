import type { FC } from "hono/jsx";
import type { z } from "zod";
import type { MakePage, PageMeta, WithContext } from "../types/index.js";

type Params<Schema extends z.AnyZodObject> = MakePage<Schema>;

export const PartialComponent = <Schema extends z.AnyZodObject>(
  Component: Params<Schema>['FC'], 
  meta: Params<Schema>['Meta']
) => {
  const Comp: FC<WithContext<object>> = (props) => {

    const { context } = props;

    // 요청하는 페이지 참조
    const referer = context.req.header('Referer');
    const refererUrl = referer
      ? new URL(referer)
      : null;
    
    const parsed = meta.parse(context);
    if (parsed.error) {
      return <div>Invalid props</div>;
    }

    return (
      <Component {...parsed.data} refererUrl={refererUrl} />
    );
  }

  return Comp;
}