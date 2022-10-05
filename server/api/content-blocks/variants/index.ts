// Dependencies
import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

// Routers
import VersionsRouter from './versions';

const router = Router({ mergeParams: true });

router.post('/', async (req: Request, res: Response) => {
  try {
    const { contentBlock } = req.body;
    const request = await fetch(`${process.env.ADMIN_API_URL}/content-blocks/${contentBlock.id}/variants`, {
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

router.get('/:variantId', async (req: Request, res: Response) => {
  try {
    const { variantId, blockId } = req.params;

    const request = await fetch(`${process.env.ADMIN_API_URL}/content-blocks/${blockId}/variants/${variantId}`);
    if (request.status !== 200) {
      console.error('Request error', request.status, request.statusText, request.url);
      return res.status(request.status).json({ error: request.statusText });
    }
    const contentBlockVariant = await request.json();
    res.json(contentBlockVariant);
  } catch (error) {
    console.error('Endpoint error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

router.use('/:variantId/versions', VersionsRouter);

export default router;
