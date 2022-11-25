// Dependencies
import { Request } from 'express';
import { ResponseMode, AccountInfo } from '@azure/msal-node';

declare module 'express-session' {
  interface SessionData {
    accessToken: string;
    idToken: string;
    account: AccountInfo | null;
    isAuthenticated: boolean;
    csrfToken: string;
    pkceCodes: {
      challengeMethod: string;
      verifier: string;
      challenge: string;
    },
    authCodeUrlRequest: {
      redirectUri: string;
      responseMode?: ResponseMode;
      codeChallenge?: string;
      codeChallengeMethod?: string;
      authority?: string;
      scopes: Array<string>;
      state?: string;
    },
    authCodeRequest: {
      scopes: Array<string>;
      redirectUri: string;
      code: string;
      state?: string;
      codeVerifier?: string;
    }
  }
}

interface IParsedUrl extends URL {
  pathname: string
  search: string
}

export interface IAppRequest extends Request {
  brand: string
  hostUrl: string
  _parsedUrl?: IParsedUrl
}
