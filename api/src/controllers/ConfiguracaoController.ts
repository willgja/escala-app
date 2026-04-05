import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class ConfiguracaoController {
  async get(req: Request, res: Response) {
    let conf = await prisma.configuracao.findUnique({
      where: { chave: 'esc_valor_diaria' }
    });
    if (!conf) {
      conf = await prisma.configuracao.create({
        data: { chave: 'esc_valor_diaria', valor: 400.0 }
      });
    }
    res.json({ valor: conf.valor });
  }

  async update(req: Request, res: Response) {
    const { valor } = req.body;
    // ensure valid number format parsing
    const numericValue = parseFloat(valor);
    if (isNaN(numericValue)) return res.status(400).json({ error: 'Valor inválido' });

    const conf = await prisma.configuracao.upsert({
      where: { chave: 'esc_valor_diaria' },
      update: { valor: numericValue },
      create: { chave: 'esc_valor_diaria', valor: numericValue }
    });
    res.json({ valor: conf.valor });
  }
}
