import { appNames } from "../const";
import { Tokens } from "./tokens";

export type SessionData = {
  [key in typeof appNames[number]]?: {
    isLoggedIn: boolean,
    tokens: Tokens | null,
  }
};