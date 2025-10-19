import mongoose, { Schema, Document } from 'mongoose';

export interface IChoiceModule extends Document {
  id: number;
  name: string;
  shortdescription: string;
  description: string;
  content: string;
  studycredit: number;
  location: string;
  contact_id: number;
  level: string;
  learningoutcomes: string;
  tags: mongoose.Types.ObjectId[];
}

const ChoiceModuleSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  shortdescription: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  studycredit: { type: Number, required: true },
  location: { type: String, required: true },
  contact_id: { type: Number, required: true },
  level: { type: String, required: true },
  learningoutcomes: { type: String, required: true },
  // Dit vertelt Mongoose dat 'tags' een lijst van ID's is die verwijzen naar het 'Tag' model
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }]
});

export const ChoiceModuleModel = mongoose.model<IChoiceModule>('ChoiceModule', ChoiceModuleSchema);