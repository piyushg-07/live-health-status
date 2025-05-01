import { RequestHandler } from 'express';
import { AuthService } from '../services/auth.service';

export const login: RequestHandler = (req, res, next): void => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'username and password required' });
    return;
  }

  try {
    const token = AuthService.login(username, password);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};
