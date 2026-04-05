import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class ColaboradorController {
  async index(req: Request, res: Response) {
    const colaboradores = await prisma.colaborador.findMany();
    res.json(colaboradores);
  }

  async create(req: Request, res: Response) {
    const { nome, mat, func } = req.body;
    if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });

    const novo = await prisma.colaborador.create({
      data: { nome, mat, func }
    });
    res.json(novo);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await prisma.colaborador.delete({
      where: { id: String(id) }
    });
    res.status(204).send();
  }
}
