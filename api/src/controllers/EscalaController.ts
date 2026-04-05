import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class EscalaController {
  async index(req: Request, res: Response) {
    const escalas = await prisma.escala.findMany();
    // Agrupar no formato esperado pelo frontend: { 'YYYY-MM-DD': { 'colabId': { d: 1, n: 0 } } }
    const formatted: any = {};
    for (const esc of escalas) {
      if (!formatted[esc.data]) formatted[esc.data] = {};
      if (!formatted[esc.data][esc.colaboradorId]) formatted[esc.data][esc.colaboradorId] = {};
      
      formatted[esc.data][esc.colaboradorId][esc.turno] = 1;
    }
    res.json(formatted);
  }

  async toggle(req: Request, res: Response) {
    const { colaboradorId, data, turno } = req.body;
    
    const existing = await prisma.escala.findUnique({
      where: {
        colaboradorId_data_turno: {
          colaboradorId, data, turno
        }
      }
    });

    if (existing) {
      await prisma.escala.delete({
        where: { id: existing.id }
      });
      return res.json({ action: 'removed' });
    } else {
      const created = await prisma.escala.create({
        data: { colaboradorId, data, turno }
      });
      return res.json({ action: 'added', data: created });
    }
  }
}
