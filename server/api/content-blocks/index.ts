// Dependencies
import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

const router = Router({ mergeParams: true });

router.get('/', async (req: Request, res: Response) => {
  try {
    const { type, search } = req.query;
    let uri = `${process.env.ADMIN_API_URL}/content-blocks`;
    const args = [];
    if (type) {
      args.push({ key: 'type', value: type });
    }
    if (search) {
      args.push({ key: 'search', value: search });
    }
    args.forEach((arg, i) => {
      uri += `${i ? '&' : '?'}${arg.key}=${arg.value}`;
    });

    const request = await fetch(uri);
    if (request.status !== 200) {
      console.error('Request error', request.status, request.statusText);
      return res.status(request.status).json({ error: request.statusText });
    }

    const sites = await request.json();
    res.json(sites);
  } catch (error) {
    console.error('Endpoint error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const request = await fetch(`${process.env.ADMIN_API_URL}/content-blocks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    if (request.status !== 200) {
      console.error('Request error', request.status, request.statusText);
      return res.status(request.status).json({ error: request.statusText });
    }

    const response = await request.json();
    res.json(response);
  } catch (error) {
    console.error('Endpoint error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

export default router;
