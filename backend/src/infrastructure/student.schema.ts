import { Schema, model, Document } from 'mongoose';

// Interface voor de data in TypeScript
export interface IStudent extends Document {
  name: string;
  email: string;
  password?: string;
  shortlisted_modules: Schema.Types.ObjectId[]; // Array van module IDs
  interests: Schema.Types.ObjectId[]; // Array van tag IDs
}

const studentModelSchema = new Schema<IStudent>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // 'select: false' zorgt dat het wachtwoord niet standaard meekomt
  // Vertel Mongoose dat dit ObjectId's zijn die verwijzen naar 'ChoiceModule'
  shortlisted_modules: [{ type: Schema.Types.ObjectId, ref: 'ChoiceModule' }],
  // Vertel Mongoose dat dit ObjectId's zijn die verwijzen naar 'Tag'
  interests: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
});

export const StudentModel = model<IStudent>('Student', studentModelSchema);