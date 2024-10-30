import { Pool } from 'pg';

// Nova string de conexão do Render.com
const connectionString = 'postgresql://autenticacaousuariofecaf_user:zpMBhSjom5X195cIlIVcXjfi5bdaMrlW@dpg-csglh53qf0us739n5s8g-a.oregon-postgres.render.com/autenticacaousuariofecaf';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, 
  },
});

export default pool;
