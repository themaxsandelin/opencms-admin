// Dependencies
import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

const router = Router({ mergeParams: true });

router.get('/', async (req: Request, res: Response) => {
  try {
    const { instanceId, pageId, siteId } = req.params;
    const request = await fetch(`${process.env.ADMIN_API_URL}/sites/${siteId}/pages/${pageId}/instances/${instanceId}/layouts`);
    const body = await request.json();

    res.status(request.status).json(body);
  } catch (error) {
    console.error('API error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { instanceId, pageId, siteId } = req.params;
    const request = await fetch(`${process.env.ADMIN_API_URL}/sites/${siteId}/pages/${pageId}/instances/${instanceId}/layouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const body = await request.json();

    res.status(request.status).json(body);
  } catch (error) {
    console.error('API error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

export default router;
