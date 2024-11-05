import { Router } from 'express';
import pool from '../config/database';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 

const router = Router();

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
        
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length > 0) {
            const user = result.rows[0];

            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const token = jwt.sign({ id: user.id }, 'seu-segredo-aqui', { expiresIn: '1h' });
                res.json({ message: 'Login bem-sucedido', token });
            } else {
                res.status(401).json({ error: 'Senha incorreta' });
                
            }
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

export default router;
