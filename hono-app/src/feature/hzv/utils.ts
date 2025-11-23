import got, { Method } from "got";
import { Tokens } from "../../types/tokens";
import { decodeJwt } from "jose";
import { Context } from "hono";
import { Session } from "@hono/session";
import { SessionData } from "../../types/session-data";

export const createGotOptions = (method: Method, token: Tokens['accessToken']) => ({
  method,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getVerifiedAccessToken = async (tokens: Tokens): Promise<string | null> => {
  const { accessToken, refreshToken } = tokens;
  const { exp } = decodeJwt(accessToken);
  const currentTime = Math.floor(Date.now() / 1000);

  if (exp && currentTime < exp) {
    return accessToken;
  }

  const { exp: refreshExp } = decodeJwt(refreshToken);

  if (!refreshExp || currentTime >= refreshExp) {
    console.log('Refresh token has expired.');
    return null;
  }

  const newTokens = await got('https://apidev.vpphaezoom.com/api/user/token/refresh/', {
    method: 'POST',
    json: {
      refresh: refreshToken
    }
  }).json<{access: string, refresh: string}>().catch((err) => {
    console.log('Failed to refresh tokens ::: ' + err);
    return null;
  });
  
  if (newTokens === null) {
    console.log('Failed to obtain new tokens.');
    return null;
  }
  console.log('Access token refreshed successfully.', newTokens);
  return newTokens.access;
}

export const updateSessionTokens = async (session: Session<SessionData>, tokens: Tokens) => {
  const { accessToken, refreshToken } = tokens;
  await session.update({
    hzv: {
      isLoggedIn: true,
      tokens: {
        accessToken,
        refreshToken,
      },
    }
  });
};