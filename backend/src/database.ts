// Importando modulos de postgreSQL
import { Pool } from 'pg';
// Credenciales para conectarnos a la base de datos local
export const db = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: '673et5!3C7uZhyP',
    database: 'restaurante',
    port: 5432
});

