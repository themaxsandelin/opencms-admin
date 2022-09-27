// Dependencies
import { Router, Request, Response, NextFunction } from 'express';
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

router.use('/:blockId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { blockId } = req.params;
    const { type } = req.query;
    const request = await fetch(`${process.env.ADMIN_API_URL}/content-blocks/${blockId}${type ? `?type=${type}` : ''}`);

    if (request.status !== 200) {
      console.error('Request error', request.status, request.statusText, request.url);
      return res.status(request.status).json({ error: request.statusText });
    }

    const contentBlock = await request.json();
    req.body.contentBlock = contentBlock;
    next();
  } catch (error) {
    console.error('Endpoint error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

router.get('/:blockId', async (req: Request, res: Response) => {
  try {
    const { contentBlock } = req.body;

    const request = await fetch(`${process.env.ADMIN_API_URL}/content-blocks/${contentBlock.id}/variants`);
    if (request.status !== 200) {
      console.error('Request error', request.status, request.statusText, request.url);
      return res.status(request.status).json({ error: request.statusText });
    }

    const variants = await request.json();
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
