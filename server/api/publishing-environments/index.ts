// Dependencies
import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

const router = Router({ mergeParams: true });

router.get('/', async (_req: Request, res: Response) => {
  try {
    const request = await fetch(`${process.env.ADMIN_API_URL}/publishing-environments`);
    const response = await request.json();
    if (request.status !== 200) {
      console.error('Request error', request.status, request.statusText);
      return res.status(request.status).json({ error: request.statusText });
    }

    res.json(response);
  } catch (error) {
    console.error('Endpoint error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

export default router;
