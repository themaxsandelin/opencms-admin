// Dependencies
import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

const router = Router({ mergeParams: true });

router.get('/', async (req: Request, res: Response) => {
  try {
    const { layoutId, pageId, siteId } = req.params;

    const request = await fetch(`${process.env.ADMIN_API_URL}/sites/${siteId}/pages/${pageId}/layouts/${layoutId}/versions`);
    const body = await request.json();

    res.status(request.status).json(body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;