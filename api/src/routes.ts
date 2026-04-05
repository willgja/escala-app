import { Router } from 'express';
import { ColaboradorController } from './controllers/ColaboradorController';
import { EscalaController } from './controllers/EscalaController';
import { ConfiguracaoController } from './controllers/ConfiguracaoController';
import { AuthController } from './controllers/AuthController';
import { authMiddleware } from './middlewares/authMiddleware';

export const routes = Router();

const colabController = new ColaboradorController();
const escalaController = new EscalaController();
const configController = new ConfiguracaoController();
const authController = new AuthController();

routes.post('/login', authController.login);
routes.post('/registrar', authController.register);

// Rotas protegidas
routes.use(authMiddleware);

routes.get('/colaboradores', colabController.index);
routes.post('/colaboradores', colabController.create);
routes.delete('/colaboradores/:id', colabController.delete);

routes.get('/escalas', escalaController.index);
routes.post('/escalas/toggle', escalaController.toggle);

routes.get('/config', configController.get);
routes.put('/config', configController.update);
