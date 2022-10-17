// Dependencies
import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

// Routers
import LayoutsRouter from './layouts';

const router = Router({ mergeParams: true });

router.get('/', async (req: Request, res: Response) => {
  try {
    const { pageId, siteId } = req.params;
    const request = await fetch(`${process.env.ADMIN_API_URL}/sites/${siteId}/pages/${pageId}/instances`);
    const body = await request.json();

    res.status(request.status).json(body);
  } catch (error) {
    console.error('API error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { pageId, siteId } = req.params;
    const request = await fetch(`${process.env.ADMIN_API_URL}/sites/${siteId}/pages/${pageId}/instances`, {
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

router.get('/:instanceId', async (req: Request, res: Response) => {
  try {
    const { instanceId, pageId, siteId } = req.params;
    const request = await fetch(`${process.env.ADMIN_API_URL}/sites/${siteId}/pages/${pageId}/instances/${instanceId}`);
    const body = await request.json();

    res.status(request.status).json(body);
  } catch (error) {
    console.error('API error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

router.patch('/:instanceId', async (req: Request, res: Response) => {
  try {
    const { instanceId, pageId, siteId } = req.params;
    const request = await fetch(`${process.env.ADMIN_API_URL}/sites/${siteId}/pages/${pageId}/instances/${instanceId}`, {
      method: 'PATCH',
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

router.use('/:instanceId/layouts', LayoutsRouter);

export default router;
