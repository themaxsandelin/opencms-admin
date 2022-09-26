// Types
import { IAppContext } from './context';

export interface IFetchContext extends IAppContext {
  $cId?: string
}

export interface IFetchOptions {
  method?: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT' | 'HEAD' | 'OPTIONS' | 'CONNECT';
  headers?: any;
  body?: any;
  mode?: 'cors' | 'no-cors' | 'same-origin';
  credentials?: 'omit' | 'same-origin' | 'include';
  cache?: 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached';
  redirect?: 'follow' | 'error' | 'manual';
  referrer?: string;
  referrerPolicy?: 'referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'unsafe-url';
  integrity?: any;
}
