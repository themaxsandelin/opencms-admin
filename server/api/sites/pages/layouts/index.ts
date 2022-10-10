// Dependencies
import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

const router = Router({ mergeParams: true });

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const { pageId, siteId } = req.params;

    const request = await fetch(`${process.env.ADMIN_API_URL}/sites/${siteId}/pages/${pageId}/layouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    const body = await request.json();

    res.status(request.status).json(body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:layoutId', async (req: Request, res: Response) => {
  try {
    const { layoutId, pageId, siteId } = req.params;

    const request = await fetch(`${process.env.ADMIN_API_URL}/sites/${siteId}/pages/${pageId}/layouts/${layoutId}`);
    const body = await request.json();

    res.status(request.status).json(body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
