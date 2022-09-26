// Dependencies
import { Context } from '@nuxt/types';

// Types
import { IAppRequest } from './express';

export interface IAppContext extends Context {
  req: IAppRequest,
}
