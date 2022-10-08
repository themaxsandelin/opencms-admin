// Dependencies
import { Router, Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';

// Routers
import PagesRouter from './pages';

const router = Router({ mergeParams: true });

router.get('/', async (_req: Request, res: Response) => {
  try {
    const request = await fetch(`${process.env.ADMIN_API_URL}/sites`);
    const body = await request.json();
    res.status(request.status).json(body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.use('/:siteKey', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { siteKey } = req.params;
    const request = await fetch(`${process.env.ADMIN_API_URL}/sites`);
    const body = await request.json();
    // TODO: Fix fetch typing.
    if ((body as any).error) {
      res.status(request.status).json(body);
    }

    const foundSite = (body as any).data.find((site: any) => site.key === siteKey);
    if (!foundSite) {
      return res.status(404).json({ error: `Could not find a site with the key ${siteKey}` });
    }

    req.body.site = foundSite;
    next()
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:siteKey', (req: Request, res: Response) => {
  try {
    const { site } = req.body;
    res.json(site);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.use('/:siteKey/pages', PagesRouter);

export default router;
