import { Session } from "@hono/session";
import { AuthName } from "./auth-name";

declare module 'hono' {
  interface ContextVariableMap {
    session: Session<Record<AuthName, {isLoggedIn: boolean }>>;
  }
}