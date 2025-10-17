import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'not-pokemon',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export async function connectDB(): Promise<void> {
  try {
    await pool.connect();
    console.log('Connexion à PostgreSQL réussie');
  } catch (error) {
    console.error('Erreur de connexion à PostgreSQL:', error);
    (1);
  }
}