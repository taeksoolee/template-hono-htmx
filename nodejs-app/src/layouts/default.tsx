import type { FC, PropsWithChildren } from "hono/jsx";

interface DefaultLayoutProps {
  title: string;
}

const DefaultLayout: FC<PropsWithChildren<DefaultLayoutProps>> = ({
  title,
  children,
}) => {
  return (
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title}</title>

      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css"
      ></link>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />

      <script src="https://unpkg.com/htmx.org@1.9.3"></script>
      <script src="/js/utility.js"></script>
    </head>
    <body>
      {children}
    </body>
    </html>
  );
}

export default DefaultLayout;