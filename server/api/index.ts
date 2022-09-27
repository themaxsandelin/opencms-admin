// Dependencies
import express, { json } from 'express';

// Routers
import SitesRouter from './sites';
import ContentBlocksRouter from './content-blocks';

const app = express();
app.use(json());
app.use('/sites', SitesRouter);
app.use('/content-blocks', ContentBlocksRouter);

export default app;
