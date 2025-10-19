// src/application/student.service.ts
import { Request, Response, NextFunction } from 'express';
import { StudentModel } from '../infrastructure/student.schema';
import { ChoiceModuleModel } from '../infrastructure/choicemodule.schema';
import { IRequestWithUser } from '../interfaces/auth.middleware';

export class StudentService {
  public getAllStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const students = await StudentModel.find().populate('shortlisted_modules');
      res.status(200).json(students);
    } catch (error) {
      next(error);
    }
  };

  public getStudentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const student = await StudentModel.findById(req.params.id).populate('shortlisted_modules');
      if (!student) {
        return res.status(404).json({ message: 'Student niet gevonden.' });
      }
      res.status(200).json(student);
    } catch (error) {
      next(error);
    }
  };

  public updateStudentProfile = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { studentId } = req.user!;
      const { name, email } = req.body; // De nieuwe data uit de request body

      // Controleer of de gebruiker zijn eigen profiel aanpast
      if (req.params.id !== studentId) {
        return res.status(403).json({ message: 'Je kunt alleen je eigen profiel aanpassen.' });
      }

      const updatedStudent = await StudentModel.findByIdAndUpdate(
        studentId,
        { name, email }, // Update de velden
        { new: true, runValidators: true } // `new: true` geeft het nieuwe document terug
      ).populate('shortlisted_modules');

      if (!updatedStudent) {
        return res.status(404).json({ message: 'Student niet gevonden.' });
      }

      res.status(200).json(updatedStudent);
    } catch (error) {
      next(error);
    }
  };

  
  // 👇 DIT IS DE NIEUWE FUNCTIE
  public updateShortlist = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { studentId } = req.user!; // ID van de ingelogde gebruiker uit de token
      const { moduleId, action } = req.body; // 'add' or 'remove'

      if (req.params.id !== studentId) {
        return res.status(403).json({ message: 'Je kunt alleen je eigen shortlist aanpassen.' });
      }

      const update =
        action === 'add'
          ? { $addToSet: { shortlisted_modules: moduleId } } // $addToSet voorkomt duplicaten
          : { $pull: { shortlisted_modules: moduleId } };

      const updatedStudent = await StudentModel.findByIdAndUpdate(
        studentId,
        update,
        { new: true } // Geeft het bijgewerkte document terug
      ).populate('shortlisted_modules');

      if (!updatedStudent) {
        return res.status(404).json({ message: 'Student niet gevonden.' });
      }

      res.status(200).json(updatedStudent);
    } catch (error) {
      next(error);
    }
  };

  public getStudentTagCounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studentId = req.params.id;
      const student = await StudentModel.findById(studentId).populate({
        path: 'shortlisted_modules',
        populate: {
          path: 'tags'
        }
      });
  
      if (!student) {
        return res.status(404).json({ message: 'Student niet gevonden.' });
      }
  
      const tagCounts: { [key: string]: { name: string, count: number } } = {};
  
      student.shortlisted_modules.forEach((module: any) => {
        module.tags.forEach((tag: any) => {
          if (tagCounts[tag._id]) {
            tagCounts[tag._id].count++;
          } else {
            tagCounts[tag._id] = { name: tag.name, count: 1 };
          }
        });
      });
  
      res.status(200).json(Object.values(tagCounts));
    } catch (error) {
      next(error);
    }
  };  
}