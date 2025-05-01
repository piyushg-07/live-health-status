import { RequestHandler } from 'express';

export const authenticate: RequestHandler = (req, res, next): void => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;      // exit without returning the Response object
  }

  const token = auth.slice(7);
  if (token !== 'mock-token') {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  next();       // proceed
};