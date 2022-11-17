// Dependencies
import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

// Routers
import FilesRouter from './files';

const router = Router({ mergeParams: true });

router.get('/', async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;
    const request = await fetch(`${process.env.ADMIN_API_URL}/forms/${formId}/submissions`);
    const response = await request.json();

    res.status(request.status).json(response);
  } catch (error) {
    console.error('Endpoint error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

router.get('/:submissionId', async (req: Request, res: Response) => {
  try {
    const { formId, submissionId } = req.params;
    const request = await fetch(`${process.env.ADMIN_API_URL}/forms/${formId}/submissions/${submissionId}`);
    const response = await request.json();

    res.status(request.status).json(response);
  } catch (error) {
    console.error('Endpoint error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

router.use('/:submissionId/files', FilesRouter);

export default router;
