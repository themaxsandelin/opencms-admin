// Dependencies
import express, { json, urlencoded, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';

// Routers
import AdminRouter from './admin';
import AuthRouter from './auth';

const sessionConfig = {
  secret: (process.env.AUTH_SESSION_SECRET as string),
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
};

const app = express();
app.use(session(sessionConfig));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req: Request, res: Response, next: NextFunction) => {
  if (!req.session.isAuthenticated && req.url !== '/login' && !req.url.includes('_loading') && !req.url.includes('/auth')) {
    return res.redirect('/login');
  } else if (req.session.isAuthenticated && req.url === '/login') {
    return res.redirect('/');
  }
  next();
});

// Routes
app.use('/auth', AuthRouter);
app.use('/api', AdminRouter);

export default app;
