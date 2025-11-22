export type CheckSign = (credentials: {username: string, password: string}) => boolean;
export type CreateAuthMiddlewareOptions = {
  invalidInputMessage?: string;
  invalidCredentialsMessage?: string;
}