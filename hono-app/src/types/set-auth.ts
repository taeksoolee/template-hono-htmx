type Credentials = {username: string, password: string};
export type CheckSign = (credentials: Credentials) => boolean | ((credentials: Credentials) => Promise<boolean>);
export type CreateAuthMiddlewareOptions = {
  invalidInputMessage?: string;
  invalidCredentialsMessage?: string;
}