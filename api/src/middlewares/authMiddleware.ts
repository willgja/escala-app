import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface Payload {
  sub: string;
}

export function authMiddleware(req: any, res: any, next: NextFunction) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: 'Token is missing' });
  }

  // Token is "Bearer djasijdf23j423lk4..."
  const [, token] = authToken.split(' ');

  try {
    const { sub } = verify(token, 'minha_chave_super_secreta_jwt_escala_app') as Payload;
    req.user_id = sub;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token is invalid' });
  }
}
