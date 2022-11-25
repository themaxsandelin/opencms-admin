// Dependencies
import { Request, Response } from 'express';
import fetch, { RequestInit } from 'node-fetch';

// Types
import { AdminApiRequestParams, AdminApiRequestResponse, AdminApiResponseObject } from '../types/admin-api';

export async function adminApiRequest({ path, method, body, accessToken }: AdminApiRequestParams): Promise<AdminApiRequestResponse> {
  try {
    const uri = `${process.env.ADMIN_API_URL}${path}`;
    const options: RequestInit = {
      method,
    };
    options.headers = {};
    if (accessToken) {
      options.headers.authorization = `Bearer ${accessToken}`;
    }
    if ((method === 'POST' || method === 'PATCH' || method === 'PUT') && body) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
    const request = await fetch(uri, options);
    const response = await request.json();
    return { statusCode: request.status, response: (response as AdminApiResponseObject) };
  } catch (error) {
    throw new Error((error as any).message);
  }
}

export default async function adminRequestHandler(req: Request, res: Response) {
  try {
    const { body, method } = req;
    const queryString = Object.keys(req.query).map((key, i) => `${!i ? '?' : '&'}${key}=${req.query[key]}`);
    const path = `${req.baseUrl.substring(4, req.baseUrl.length)}${queryString}`;
    const accessToken = req.session.accessToken || '';

    const { statusCode, response } = await adminApiRequest({ path, method, body, accessToken });
    res.status(statusCode).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
