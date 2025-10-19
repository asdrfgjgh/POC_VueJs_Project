// src/interfaces/auth.routes.ts
import { Router } from 'express';
import { AuthService } from '../application/auth.service';

const router = Router();
const authService = new AuthService();

router.post('/register', authService.register);
router.post('/login', authService.login);

export default router;