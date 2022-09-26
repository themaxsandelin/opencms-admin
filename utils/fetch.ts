// Types
import { IFetchContext, IFetchOptions } from '../types/fetch';

export default ({ req, res }: IFetchContext, url: string = '', passedOptions: IFetchOptions = {}, ...args: Array<any>) => {
  const options: any = {
    ...passedOptions,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'Content-Type': 'application/json',
      ...passedOptions.headers
    },
    credentials: 'include',
    ...args
  };

  // Pass along cookies on server-side since `credentials: 'include';` is a client-side (browser) option.
  if (process.server) {
    options.headers.cookie = req.headers.cookie;
  }

  return fetch(url, options)
    .then((r) => {
      // Pass along the cookies from the request response on SSR.
      if (res) {
        r.headers.forEach((value, name) => {
          if (name === 'set-cookie') {
            res.setHeader(name, value);
          }
        });
      }

      return r.json()
        .then(data => {
          if (!r.ok) {
            return {
              statusCode: r.status,
              ...data,
            };
          }
          return data;
        })
        .catch(() => {
          return {
            statusCode: r.status,
          };
        });
    })
    .catch((error) => {
      return {
        statusCode: 500,
        errorType: 'FetchException',
        message: error.message,
      };
    });
}
