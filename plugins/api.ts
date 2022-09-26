// Dependencies
import { Plugin } from '@nuxt/types';

// Utils
import apiFetch from '../utils/fetch';

// Types
import { IFetchContext } from '../types/fetch';

const ApiClientPlugin : Plugin = (context, inject) => {
  // Inject $api(url) in Vue
  inject('api', (endpoint: string, ...args: Array<any>) => {
    let hostUrl = '';
    if (typeof document !== 'undefined') {
      hostUrl = `${document.location.protocol}//${document.location.host}`;
    } else {
      hostUrl = 'http://localhost:3000';
    }
    // const $cId = `${document.location.hostname}-${Date.now()}-${(Math.random() * 10000).toFixed(0)}`;

    const requestContext = {
      ...context
    } as IFetchContext;

    return apiFetch(requestContext, `${hostUrl}${context.app.router!.options.base}api${endpoint}`, ...args);
  });
};

export default ApiClientPlugin;
