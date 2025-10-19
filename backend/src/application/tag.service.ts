// backend/src/application/tag.service.ts
import { TagModel, ITag } from '../infrastructure/tag.schema';

export const getAllTags = async (): Promise<ITag[]> => {
  return await TagModel.find({}).exec();
};