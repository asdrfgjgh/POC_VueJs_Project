import { ChoiceModuleModel, IChoiceModule } from '../infrastructure/choicemodule.schema';

export const getAllModules = async (
  page: number,
  limit: number,
  tags: string[],
  level?: string,
  location?: string,
  studycredit?: number
): Promise<{ modules: IChoiceModule[]; total: number }> => {
  const skip = (page - 1) * limit;

  // Bouw een query object.
  const query: any = {};

  if (tags && tags.length > 0) {
    query.tags = { $all: tags };
  }

  if (level) {
    query.level = level;
  }

  if (location) {
    query.location = location;
  }

  if (studycredit !== undefined) {
    query.studycredit = studycredit;
  }


  const modules = await ChoiceModuleModel.find(query) // Gebruik de query
    .populate('tags')
    .skip(skip)
    .limit(limit)
    .exec();

  // Zorg ervoor dat we het totaal van de *gefilterde* documenten tellen.
  const total = await ChoiceModuleModel.countDocuments(query);

  return { modules, total };
};

export const getAllModulesForAnalytics = async (): Promise<IChoiceModule[]> => {
  // Haalt alle modules op zonder paginering, maar alleen de 'tags' field.
  // Dit is efficiënter omdat we niet alle data nodig hebben.
  return await ChoiceModuleModel.find({}).populate('tags').select('tags').exec();
};

export const getFilterOptions = async (): Promise<{ levels: string[]; locations: string[]; studycredits: number[] }> => {
  // Gebruik Promise.all om de queries parallel uit te voeren voor betere performance
  const [levels, locations, studycredits] = await Promise.all([
    ChoiceModuleModel.find().distinct('level').exec(),
    ChoiceModuleModel.find().distinct('location').exec(),
    ChoiceModuleModel.find().distinct('studycredit').exec()
  ]);

  // Sorteer de studiecredits numeriek
  studycredits.sort((a, b) => a - b);

  return { levels, locations, studycredits };
};
