// Dependencies
import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

// Sub routers
import VersionsRouter from './versions';
import SubmissionsRouter from './submissions';

const router = Router({ mergeParams: true });

router.get('/', async (_req: Request, res: Response) => {
  try {
    const request = await fetch(`${process.env.ADMIN_API_URL}/forms`);
    const response = await request.json();

    res.status(request.status).json(response);
  } catch (error) {
    console.error('Endpoint error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const request = await fetch(`${process.env.ADMIN_API_URL}/forms`, {
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

router.get('/:formId', async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;
    const request = await fetch(`${process.env.ADMIN_API_URL}/forms/${formId}`);
    const response = await request.json();

    res.status(request.status).json(response);
  } catch (error) {
    console.error('Endpoint error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

router.patch('/:formId', async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;
    const request = await fetch(`${process.env.ADMIN_API_URL}/forms/${formId}`, {
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

router.delete('/:formId', async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;
    const request = await fetch(`${process.env.ADMIN_API_URL}/forms/${formId}`, {
      method: 'DELETE'
    });
    const response = await request.json();

    res.status(request.status).json(response);
  } catch (error) {
    console.error('Endpoint error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

router.use('/:formId/versions', VersionsRouter);
router.use('/:formId/submissions', SubmissionsRouter);

export default router;
