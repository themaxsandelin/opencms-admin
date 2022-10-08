// Dependencies
import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

// Types
import { PublishingEnvironment, PublishingEnvironmentList } from '@/types/publishing-environments';

const router = Router({ mergeParams: true });

router.get('/', async (req: Request, res: Response) => {
  try {
    const { blockId, variantId } = req.params;
    const { locale } = req.query;
    let uri = `${process.env.ADMIN_API_URL}/content-blocks/${blockId}/variants/${variantId}/versions`;
    if (locale) {
      uri += `?locale=${locale}`;
    }

    const request = await fetch(uri);
    const body = await request.json();

    res.status(request.status).json(body);
  } catch (error) {
    console.error('Endpoint error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { variantId, blockId } = req.params;
    const request = await fetch(`${process.env.ADMIN_API_URL}/content-blocks/${blockId}/variants/${variantId}/versions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const body = await request.json();

    res.status(request.status).json(body);
  } catch (error) {
    console.error('Endpoint error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

router.patch('/:versionId', async (req: Request, res: Response) => {
  try {
    const { versionId, variantId, blockId } = req.params;
    const request = await fetch(`${process.env.ADMIN_API_URL}/content-blocks/${blockId}/variants/${variantId}/versions/${versionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const body = await request.json();

    res.status(request.status).json(body);
  } catch (error) {
    console.error('Endpoint error', error);
    res.status(500).json({ error: (error as any).message });
  }
});

router.post('/:versionId/publish', async (req: Request, res: Response) => {
  try {
    const { versionId, variantId, blockId } = req.params;
    const { environments } = req.body;

    const environmentListRequest = await fetch(`${process.env.ADMIN_API_URL}/publishing-environments`);
    const environmentList = await environmentListRequest.json();
    if (environmentListRequest.status !== 200) {
      console.error('Environment list request error', environmentList);
      return res.status(environmentListRequest.status).json(environmentList);
    }

    let environmentMap: Array<PublishingEnvironment> = [];
    try {
      environmentMap = environments.map((environmentKey: string) => {
        const foundEnvironment = (environmentList as PublishingEnvironmentList).find((environment) => environment.key === environmentKey);
        if (!foundEnvironment) {
          throw new Error(`No environment found with key ${environmentKey}`);
        }
        return foundEnvironment;
      });
    } catch (error) {
      return res.status(400).json({ error: (error as any).message });
    }

    const publications = await Promise.all(environmentMap.map(async (environment) => {
      const request = await fetch(`${process.env.ADMIN_API_URL}/content-blocks/${blockId}/variants/${variantId}/versions/${versionId}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ environment: environment.id })
      });
      const response: any = await request.json();
      if (response.error) {
        return {
          key: environment.key,
          success: false,
          error: response.error
        };
      }
      return {
        key: environment.key,
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
