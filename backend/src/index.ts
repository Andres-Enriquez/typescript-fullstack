
import express, { Application } from 'express';
import cors from 'cors';
// Rutas
import indexRoutes from './routes/index';

// Inicializando express
const app:Application = express();

// Configuracion del puerto del servidor
const PORT = process.env.PORT || 8000;

// Middlewares
const corsOptions = {origin: "http://localhost:4200"}
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Rutas
app.use('/api', indexRoutes);

// Escuchar el puerto del servidor
app.listen(PORT, (): void => {
    console.log(`Corriendo servidor en el puerto https://localhost:${PORT}`);
});
