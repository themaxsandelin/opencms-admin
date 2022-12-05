// Dependencies
import { Plugin } from '@nuxt/types';

// Config
import hosts from '../config/admin.config';

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
      hostUrl = hosts[(process.env.NODE_ENV as string)] || 'http://localhost:3300';
    }
    // const $cId = `${document.location.hostname}-${Date.now()}-${(Math.random() * 10000).toFixed(0)}`;

    const requestContext: unknown = {
      ...context
    };

    return apiFetch((requestContext as IFetchContext), `${hostUrl}${context.app.router!.options.base}api${endpoint}`, ...args);
  });
};

export default ApiClientPlugin;
