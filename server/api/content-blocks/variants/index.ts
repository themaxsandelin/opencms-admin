// Dependencies
import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

// Routers
import VersionsRouter from './versions';

const router = Router({ mergeParams: true });

router.post('/', async (req: Request, res: Response) => {
  try {
    const { blockId } = req.params;
    const request = await fetch(`${process.env.ADMIN_API_URL}/content-blocks/${blockId}/variants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const body = await request.json();
    res.status(request.status).json(body);
  } catch (error) {
    console.error('Endpoint error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

router.get('/:variantId', async (req: Request, res: Response) => {
  try {
    const { variantId, blockId } = req.params;
    const request = await fetch(`${process.env.ADMIN_API_URL}/content-blocks/${blockId}/variants/${variantId}`);
    const body = await request.json();
    res.status(request.status).json(body);
  } catch (error) {
    console.error('Endpoint error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

router.use('/:variantId/versions', VersionsRouter);

export default router;
