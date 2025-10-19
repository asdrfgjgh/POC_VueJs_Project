// src/application/auth.service.ts
import { Request, Response, NextFunction } from 'express';
import { StudentModel, IStudent } from '../infrastructure/student.schema'; // GEWIJZIGD
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export class AuthService {
  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Alle velden zijn verplicht.' });
      }

      const existingStudent = await StudentModel.findOne({ email }); // GEWIJZIGD
      if (existingStudent) {
        return res.status(400).json({ message: 'Student met dit e-mailadres bestaat al.' }); // GEWIJZIGD
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newStudent = new StudentModel({ // GEWIJZIGD
        name,
        email,
        password: hashedPassword,
        shortlisted_modules: [],
        interests: []
      });

      await newStudent.save();

      res.status(201).json({ message: 'Student succesvol geregistreerd.' }); // GEWIJZIGD
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'E-mail en wachtwoord zijn verplicht.' });
      }

      // 👇 DEZE REGEL IS AANGEPAST
      const student = await StudentModel.findOne({ email })
        .populate({
          path: 'shortlisted_modules', // Populate de favoriete modules...
          populate: {
            path: 'tags' // ...en populate OOK de tags binnen die modules.
          }
        })
        .select('+password');
        
      if (!student) {
        return res.status(401).json({ message: 'Ongeldige inloggegevens.' });
      }

      const isMatch = await bcrypt.compare(password, student.password!);
      if (!isMatch) {
        return res.status(401).json({ message: 'Ongeldige inloggegevens.' });
      }

      const studentObject = student.toObject();
      delete studentObject.password;

      const token = jwt.sign(
        { studentId: student._id },
        JWT_SECRET!,
        { expiresIn: '1h' }
      );

      res.status(200).json({ token, student: studentObject });
    } catch (error) {
      next(error);
    }
  };

}