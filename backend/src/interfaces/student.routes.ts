// src/interfaces/student.routes.ts
import { Router } from 'express';
import { StudentService } from '../application/student.service';
import { protect } from './auth.middleware'; // NIEUW

const router = Router();
const studentService = new StudentService();

// Haal alle studenten op (publieke route)
router.get('/', studentService.getAllStudents);

// Haal een specifieke student op (publieke route)
router.get('/:id', studentService.getStudentById);

router.put('/:id', protect, studentService.updateStudentProfile);

// Update de shortlist van een student (BEVEILIGDE route)
router.put('/:id/shortlist', protect, studentService.updateShortlist);

// Haal tag counts op voor een student (publieke route)
router.get('/:id/tag-counts', studentService.getStudentTagCounts);

export default router;