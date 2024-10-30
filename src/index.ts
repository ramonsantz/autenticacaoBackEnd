import express from 'express';
import pool from './config/database'; 
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = 3000;

app.use(express.json());
pool.connect()
  .then(() => console.log('Conexão com o banco de dados estabelecida com sucesso!'))
  .catch(err => console.error('Erro ao conectar ao banco de dados:', err));

// Usar as rotas de autenticação
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
