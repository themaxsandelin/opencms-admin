// Dependencies
import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

const router = Router({ mergeParams: true });

router.get('/', async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;
    const request = await fetch(`${process.env.ADMIN_API_URL}/forms/${formId}/versions`);
    const response = await request.json();

    res.status(request.status).json(response);
  } catch (error) {
    console.error('Endpoint error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;
    const request = await fetch(`${process.env.ADMIN_API_URL}/forms/${formId}/versions`, {
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

router.patch('/:versionId', async (req: Request, res: Response) => {
  try {
    const { formId, versionId } = req.params;
    const request = await fetch(`${process.env.ADMIN_API_URL}/forms/${formId}/versions/${versionId}`, {
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

router.post('/:versionId/publish', async (req: Request, res: Response) => {
  try {
    const { versionId, formId } = req.params;
    const { environments } = req.body;

    const publications = await Promise.all(environments.map(async (environmentId: string) => {
      const request = await fetch(`${process.env.ADMIN_API_URL}/forms/${formId}/versions/${versionId}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ environment: environmentId })
      });
      const response: any = await request.json();
      if (response.error) {
        return {
          id: environmentId,
          success: false,
          error: response.error
        };
      }
      return {
        id: environmentId,
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
