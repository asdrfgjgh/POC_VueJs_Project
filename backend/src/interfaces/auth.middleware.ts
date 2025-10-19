// src/interfaces/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend de Express Request interface om een 'user' eigenschap te hebben
export interface IRequestWithUser extends Request {
  user?: { studentId: string };
}

export const protect = (req: IRequestWithUser, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Geen token, autorisatie geweigerd.' });
  }

  const token = bearer.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'een-geheime-sleutel-die-je-moet-vervangen') as { studentId: string };
    req.user = decoded; // Voeg de gedecodeerde gebruiker toe aan de request
    next();
  } catch (e) {
    res.status(401).json({ message: 'Token is niet geldig.' });
  }
};