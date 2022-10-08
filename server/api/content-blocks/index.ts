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
    res.status(request.status).json(response);
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
    res.status(request.status).json(response);
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
    const contentBlock: any = await blockRequest.json();
    if (contentBlock.error) {
      return res.status(blockRequest.status).json(contentBlock);
    }

    const variantsRequest = await fetch(`${process.env.ADMIN_API_URL}/content-blocks/${blockId}/variants`);
    const variants: any = await variantsRequest.json();
    if (variants.error) {
      return res.status(variantsRequest.status).json(variants);
    }

    res.json({
      data: {
        ...contentBlock.data,
        variants: variants.data
      }
    });
  } catch (error) {
    console.error('Endpoint error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

router.patch('/:blockId', async (req: Request, res: Response) => {
  try {
    const { blockId } = req.params;
    const request = await fetch(`${process.env.ADMIN_API_URL}/content-blocks/${blockId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const response = await request.json();

    res.status(request.status).json(response);
  } catch (error) {
    console.error('Endpoint error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

router.use('/:blockId/variants', VariantsRouter);

export default router;
