// Dependencies
import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

const router = Router({ mergeParams: true });

router.get('/:fileId/file', async (req: Request, res: Response) => {
  try {
    const { fileId, submissionId, formId } = req.params;
    const request = await fetch(`${process.env.ADMIN_API_URL}/forms/${formId}/submissions/${submissionId}/files/${fileId}/file`);
    const contentType = request.headers.get('Content-Type') as string;
    res.setHeader('Content-Type', contentType);

    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.status(request.status).send(buffer);
  } catch (error) {
    console.error('Endpoint error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

export default router;
