// src/types/index.ts

export interface ITag {
  _id: string;
  name: string;
}

// 👇 CORRECTIE: Interface bijgewerkt met de nieuwe velden
export interface IChoiceModule {
  _id: string; // Was al aanwezig
  id?: number; // Alternatief id uit het nieuwe JSON-voorbeeld
  name: string; // Was al aanwezig
  description: string; // Was al aanwezig
  shortdescription?: string;
  content?: string;
  studycredit: number; // Hernoemd van studycredit voor consistentie
  location?: string;
  level?: string;
  learningoutcomes?: string;
  tags: ITag[]; // Was al aanwezig
}

export interface IStudent {
  _id: string;
  name: string;
  email: string;
  shortlisted_modules: IChoiceModule[];
  interests: ITag[];
}