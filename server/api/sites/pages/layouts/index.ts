// Dependencies
import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

const router = Router({ mergeParams: true });

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, site, page } = req.body;
    const pageRequest = await fetch(`${process.env.ADMIN_API_URL}/sites/${site.id}/pages/${page.id}/layouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    const response: any = await pageRequest.json();

    res.status(pageRequest.status).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
