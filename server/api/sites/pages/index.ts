// Dependencies
import { Router, Request, Response, NextFunction } from 'express';
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
    const pagesRequest = await fetch(uri);
    const response: any = await pagesRequest.json();

    res.status(pagesRequest.status).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, slug, parentId, site } = req.body;
    const pageRequest = await fetch(`${process.env.ADMIN_API_URL}/sites/${site.id}/pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, slug, parentId })
    });
    const response: any = await pageRequest.json();

    res.status(pageRequest.status).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.use('/:pageId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { site } = req.body;
    const { pageId } = req.params;

    const pageRequest = await fetch(`${process.env.ADMIN_API_URL}/sites/${site.id}/pages/${pageId}`);
    const response = await pageRequest.json();

    req.body.page = response;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:pageId', async (req: Request, res: Response) => {
  try {
    const { site, page } = req.body;
    const layoutsRequest = await fetch(`${process.env.ADMIN_API_URL}/sites/${site.id}/pages/${page.id}/layouts`);
    const layouts = await layoutsRequest.json();

    res.json({
      ...page,
      layouts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.use('/:pageId/layouts', LayoutsRouter);

export default router;
