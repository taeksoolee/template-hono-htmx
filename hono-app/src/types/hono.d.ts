import { Session } from "@hono/session";
import { SessionData } from "./session-data";

declare module 'hono' {
  interface ContextVariableMap {
    session: Session<SessionData>;
  }
}