import type { Context } from "hono";
import type { FC } from "hono/jsx";
import type { z } from "zod";

export type Nop = () => void;

/**
 * type in page
 */
export type WithContext<T> = T & {
  context: Context;
};

export type Url<Schema extends z.ZodObject> = (
  props: z.infer<Schema>
) => string;

export type Parse<Schema extends z.ZodObject> = (
  c: Context
) => z.SafeParseReturnType<Schema>;

export type PageMeta<Schema extends z.ZodObject> = {
  url: Url<Schema>;
  parse: (c: Context) => SafeParseRetu<Schema>;
};

export type MakePage<Schema extends z.AnyZodObject> = {
  Meta: PageMeta<Schema>;
  FC: FC<z.infer<Schema> & { refererUrl: URL | null }>;
};
