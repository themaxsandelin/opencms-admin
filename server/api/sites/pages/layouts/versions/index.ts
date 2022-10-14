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

router.post('/', async (req: Request, res: Response) => {
  try {
    const { layoutId, pageId, siteId } = req.params;

    const request = await fetch(`${process.env.ADMIN_API_URL}/sites/${siteId}/pages/${pageId}/layouts/${layoutId}/versions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const body = await request.json();

    res.status(request.status).json(body);
  } catch (error) {
    console.error('API error', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:versionId', async (req: Request, res: Response) => {
  try {
    const { versionId, layoutId, pageId, siteId } = req.params;

    const request = await fetch(`${process.env.ADMIN_API_URL}/sites/${siteId}/pages/${pageId}/layouts/${layoutId}/versions/${versionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const body = await request.json();

    res.status(request.status).json(body);
  } catch (error) {
    console.error('API error', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:versionId/publish', async (req: Request, res: Response) => {
  try {
    const { versionId, layoutId, pageId, siteId } = req.params;
    const { environments } = req.body;

    const publications = await Promise.all(environments.map(async (environmentId: string) => {
      const request = await fetch(`${process.env.ADMIN_API_URL}/sites/${siteId}/pages/${pageId}/layouts/${layoutId}/versions/${versionId}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ environment: environmentId })
      });
      const response: any = await request.json();
      if (response.error) {
        return {
          key: environmentId,
          success: false,
          error: response.error
        };
      }
      return {
        key: environmentId,
        success: true
      };
    }));

    res.json({ data: publications });
  } catch (error) {
    console.error('Endpoint error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

export default router;
