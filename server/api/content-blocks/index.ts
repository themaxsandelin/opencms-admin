// Dependencies
import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

// Routers
import VariantsRouter from './variants';

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
    const response = await request.json();
    if (request.status !== 200) {
      console.error('Request error', response);
      return res.status(request.status).json(response);
    }

    res.json(response);
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
    const response = await request.json();
    if (request.status !== 200) {
      console.error('Request error', response);
      return res.status(request.status).json(response);
    }

    res.json(response);
  } catch (error) {
    console.error('Endpoint error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

router.get('/:blockId', async (req: Request, res: Response) => {
  try {
    const { blockId } = req.params;
    const { type } = req.query;

    const blockRequest = await fetch(`${process.env.ADMIN_API_URL}/content-blocks/${blockId}${type ? `?type=${type}` : ''}`);
    if (blockRequest.status !== 200) {
      console.error('Request error', blockRequest.status, blockRequest.statusText, blockRequest.url);
      return res.status(blockRequest.status).json({ error: blockRequest.statusText });
    }

    const contentBlock: any = await blockRequest.json();

    const variantsRequest = await fetch(`${process.env.ADMIN_API_URL}/content-blocks/${blockId}/variants`);
    if (variantsRequest.status !== 200) {
      console.error('Request error', variantsRequest.status, variantsRequest.statusText, variantsRequest.url);
      return res.status(variantsRequest.status).json({ error: variantsRequest.statusText });
    }

    const variants = await variantsRequest.json();
    res.json({
      ...contentBlock,
      variants
    });
  } catch (error) {
    console.error('Endpoint error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

router.use('/:blockId/variants', VariantsRouter);

export default router;
