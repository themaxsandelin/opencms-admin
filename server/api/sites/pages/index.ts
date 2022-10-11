// Dependencies
import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

// Routers
import LayoutsRouter from './layouts';

const router = Router({ mergeParams: true });

router.get('/', async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const { siteId } = req.params;
    let uri = `${process.env.ADMIN_API_URL}/sites/${siteId}/pages`;
    if (search) {
      uri += `?search=${search}`;
    }
    const request = await fetch(uri);
    const body: any = await request.json();

    res.status(request.status).json(body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { siteId } = req.params;
    const request = await fetch(`${process.env.ADMIN_API_URL}/sites/${siteId}/pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const body: any = await request.json();

    res.status(request.status).json(body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:pageId', async (req: Request, res: Response) => {
  try {
    const { pageId, siteId } = req.params;
    const pageRequest = await fetch(`${process.env.ADMIN_API_URL}/sites/${siteId}/pages/${pageId}`);
    const pageBody = await pageRequest.json();
    if ((pageBody as any).error) {
      return res.status(pageRequest.status).json(pageBody);
    }

    const layoutsRequest = await fetch(`${process.env.ADMIN_API_URL}/sites/${siteId}/pages/${pageId}/layouts`);
    const layoutsBody = await layoutsRequest.json();
    if ((layoutsBody as any).error) {
      return res.status(layoutsRequest.status).json(layoutsBody);
    }

    res.json({
      data: {
        ...(pageBody as any).data,
        layouts: (layoutsBody as any).data
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.use('/:pageId/layouts', LayoutsRouter);

export default router;
