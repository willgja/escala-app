import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

export class AuthController {
  async register(req: Request, res: Response) {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ error: 'Faltam dados' });

    const userAlreadyExists = await prisma.usuario.findFirst({
      where: { username }
    });

    if (userAlreadyExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const passwordHash = await hash(password, 8);

    const user = await prisma.usuario.create({
      data: {
        username,
        password: passwordHash,
      }
    });

    return res.json({ id: user.id, username: user.username });
  }

  async login(req: Request, res: Response) {
    const { username, password } = req.body;

    const user = await prisma.usuario.findFirst({
      where: { username }
    });

    if (!user) {
      return res.status(400).json({ error: 'User/Password incorrect' });
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: 'User/Password incorrect' });
    }

    // Gerar token
    const token = sign(
      { username: user.username },
      'minha_chave_super_secreta_jwt_escala_app',
      {
        subject: user.id,
        expiresIn: '30d'
      }
    );

    return res.json({
      user: { id: user.id, username: user.username },
      token: token
    });
  }
}
