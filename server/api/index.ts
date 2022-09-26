// Dependencies
import express, { json } from 'express';

// Routers
import SitesRouter from './sites';

const app = express();
app.use(json());
app.use('/sites', SitesRouter);

export default app;
