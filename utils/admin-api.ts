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
    const contentType = request.headers.get('Content-Type') as string;
    const contentDisposition = request.headers.get('Content-Disposition') as string || '';
    let response;
    if (contentType.includes('application/json')) {
      response = await request.json();
    } else {
      const arrayBuffer = await request.arrayBuffer();
      response = Buffer.from(arrayBuffer);
    }
    // DEBUG LOG
    console.log('Admin API request', request.status, request.statusText, response);
    return { statusCode: request.status, contentType, contentDisposition, response: (response as AdminApiResponseObject) };
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

    const { statusCode, response, contentType, contentDisposition } = await adminApiRequest({ path, method, body, accessToken });
    res.setHeader('Content-Type', contentType);
    if (contentDisposition) {
      res.setHeader('Content-Disposition', contentDisposition);
    }
    res.status(statusCode);
    if (contentType.includes('application/json')) {
      res.json(response);
    } else {
      res.send(response);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
