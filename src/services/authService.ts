// routes/authRoutes.ts
import { Router } from 'express';
import pool from '../config/database';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = Router();

// Rota de registro
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash da senha
      const result = await pool.query(
          'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
          [name, email, hashedPassword] // Usar a senha hasheada
      );
      res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];

      if (!user) {
          return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      const isMatch = await bcrypt.compare(password, user.password); // Comparar senha

      if (!isMatch) {
          return res.status(401).json({ error: 'Senha incorreta' });
      }

      // Gerar token JWT
      const token = jwt.sign({ id: user.id }, 'seu_segredo_aqui', { expiresIn: '1h' }); // Altere 'seu_segredo_aqui' para um segredo seguro

      res.status(200).json({ token });
  } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

export default router;
