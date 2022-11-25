export interface AdminApiRequestParams {
  path: string;
  method: string;
  body?: any;
  accessToken: string;
}

export interface AdminApiResponseObject {
  error?: any;
  data?: any;
}

export interface AdminApiRequestResponse {
  statusCode: number;
  response: AdminApiResponseObject;
}
