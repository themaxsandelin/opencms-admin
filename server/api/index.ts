// Dependencies
import express, { json } from 'express';

// Routers
import LocalesRouter from './locales';
import EnvironmentsRouter from './publishing-environments';
import SitesRouter from './sites';
import ContentBlocksRouter from './content-blocks';

const app = express();
app.use(json());
app.use('/locales', LocalesRouter);
app.use('/publishing-environments', EnvironmentsRouter);
app.use('/sites', SitesRouter);
app.use('/content-blocks', ContentBlocksRouter);

export default app;
