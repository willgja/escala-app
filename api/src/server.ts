import express from 'express';
import cors from 'cors';
import { routes } from './routes';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));
app.use(express.json());
app.use(routes);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3333;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
});
