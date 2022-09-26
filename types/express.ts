// Dependencies
import { Request } from 'express';

interface IParsedUrl extends URL {
  pathname: string
  search: string
}

export interface IAppRequest extends Request {
  brand: string
  hostUrl: string
  _parsedUrl?: IParsedUrl
}
