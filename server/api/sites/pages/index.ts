// Dependencies
import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

// Routers
import LayoutsRouter from './layouts';

const router = Router({ mergeParams: true });

router.get('/', async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const { site } = req.body;
    let uri = `${process.env.ADMIN_API_URL}/sites/${site.id}/pages`;
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
    const { title, slug, parentId, site } = req.body;
    const request = await fetch(`${process.env.ADMIN_API_URL}/sites/${site.id}/pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, slug, parentId })
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
    const { site } = req.body;
    const { pageId } = req.params;
    const pageRequest = await fetch(`${process.env.ADMIN_API_URL}/sites/${site.id}/pages/${pageId}`);
    const pageBody = await pageRequest.json();
    if ((pageBody as any).error) {
      return res.status(pageRequest.status).json(pageBody);
    }

    const layoutsRequest = await fetch(`${process.env.ADMIN_API_URL}/sites/${site.id}/pages/${pageId}/layouts`);
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
