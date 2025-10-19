import mongoose, { Schema, Document } from 'mongoose';

export interface ITag extends Document {
  name: string;
}

const TagSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true }
});

export const TagModel = mongoose.model<ITag>('Tag', TagSchema);