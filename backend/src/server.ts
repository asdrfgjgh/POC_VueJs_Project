import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { connectDB } from './infrastructure/database';
import moduleRoutes from './interfaces/module.routes';
import studentRoutes from './interfaces/student.routes'; // NIEUW
import tagRoutes from './interfaces/tag.routes';
import dotenv from 'dotenv';
import './infrastructure/tag.schema';
import './infrastructure/choicemodule.schema';
import './infrastructure/student.schema';
import authRoutes from './interfaces/auth.routes';


dotenv.config();
const app = express();

// Database connectie
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/students', studentRoutes); // NIEUW
app.use('/api/tags', tagRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log de volledige fout naar de server console
  console.error(err.stack); 
  
  // Stuur een duidelijke foutmelding terug naar de client
  res.status(500).json({ 
    message: 'Er is een interne serverfout opgetreden.',
    error: err.message // Dit geeft de specifieke foutmelding weer
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Backend server draait op http://localhost:${PORT}`);
});