import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';

interface Translations {
  [key: string]: { 
    [lang: string]: string;
  };
}

const translations: Translations = {
  home: {
    NL: 'Home',
    EN: 'Home',
  },
  modules: {
    NL: 'Keuzemodules',
    EN: 'Modules',
  },
  myTags: {
    NL: 'Mijn Favorieten',
    EN: 'My Favorites',
  },
  login: {
    NL: 'Inloggen',
    EN: 'Login',
  },
  register: {
    NL: 'Registreren',
    EN: 'Register',
  },
  welcome: {
    NL: 'Welkom',
    EN: 'Welcome',
  },
  profileEdit: {
    NL: 'Profiel Bewerken',
    EN: 'Edit Profile',
  },
  myFavorites: {
    NL: 'Mijn Favorieten',
    EN: 'My Favorites',
  },
  logout: {
    NL: 'Uitloggen',
    EN: 'Logout',
  },
  studyPoints: {
    NL: 'Studiepunten',
    EN: 'Study Credits',
  },
  location: {
    NL: 'Locatie',
    EN: 'Location',
  },
  notSpecified: {
    NL: 'Niet gespecificeerd',
    EN: 'Not specified',
  },
  level: {
    NL: 'Niveau',
    EN: 'Level',
  },
  content: {
    NL: 'Inhoud',
    EN: 'Content',
  },
  learningOutcomes: {
    NL: 'Leeruitkomsten',
    EN: 'Learning Outcomes',
  },
  tags: {
    NL: 'Tags',
    EN: 'Tags',
  },
  // New translations for ModulesView filters
  levelFilter: {
    NL: 'Niveau:',
    EN: 'Level:',
  },
  locationFilter: {
    NL: 'Locatie:',
    EN: 'Location:',
  },
  studyCreditsFilter: {
    NL: 'Studiecredits:',
    EN: 'Study Credits:',
  },
  allLevels: {
    NL: 'Alle Niveaus',
    EN: 'All Levels',
  },
  allLocations: {
    NL: 'Alle Locaties',
    EN: 'All Locations',
  },
  allStudyCredits: {
    NL: 'Alle Studiecredits',
    EN: 'All Study Credits',
  },
  homeWelcomeTitle: {
    NL: 'Welkom bij de Keuzemodule Applicatie Jobbahub',
    EN: 'Welcome to the Elective Module Application Jobbahub',
  },
  homeWelcomeText: {
    NL: 'Gebruik de navigatie hierboven om de modules te bekijken',
    EN: 'Use the navigation above to view the modules',
  },
  homeParagraph1: {
    NL: 'Welkom op de Keuzemodule Applicatie van Jobbahub! Deze applicatie is ontworpen om studenten te helpen bij het verkennen en selecteren van keuzemodules die het beste aansluiten bij hun interesses en studiepad.',
    EN: 'Welcome to the Elective Module Application of Jobbahub! This application is designed to help students explore and select elective modules that best fit their interests and study path.',
  },
  homeParagraph2: {
    NL: 'Blader door ons uitgebreide aanbod van modules, filter op tags, niveau, locatie en studiepunten, en voeg je favorieten toe aan je persoonlijke shortlist. Ontdek nieuwe mogelijkheden en plan je academische route met gemak.',
    EN: 'Browse our extensive range of modules, filter by tags, level, location, and study credits, and add your favorites to your personal shortlist. Discover new opportunities and plan your academic route with ease.',
  },
  homeParagraph3: {
    NL: 'Of je nu op zoek bent naar verdieping in je hoofdvak, of een breed scala aan onderwerpen wilt verkennen, Jobbahub ondersteunt je in het maken van weloverwogen keuzes voor jouw toekomst. Begin vandaag nog met het ontdekken van jouw ideale modules!',
    EN: 'Whether you are looking to deepen your major, or explore a wide range of subjects, Jobbahub supports you in making informed choices for your future. Start discovering your ideal modules today!',
  },
  imageAltText: {
    NL: 'Afbeelding voor ',
    EN: 'Image for ',
  },
  studyPointsLabel: {
    NL: 'Studiepunten:',
    EN: 'Study Credits:',
  },
  recommendedModulesTitle: {
    NL: 'Aanbevolen Modules',
    EN: 'Recommended Modules',
  },
  paginationFirst: {
    NL: '« Eerste',
    EN: '« First',
  },
  paginationPrevious: {
    NL: '‹ Vorige',
    EN: '‹ Previous',
  },
  paginationPage: {
    NL: 'Pagina',
    EN: 'Page',
  },
  paginationOf: {
    NL: 'van',
    EN: 'of',
  },
  paginationNext: {
    NL: 'Volgende ›',
    EN: 'Next ›',
  },
  paginationLast: {
    NL: 'Laatste »',
    EN: 'Last »',
  },
  filterByTags: {
    NL: 'Filter op tags:',
    EN: 'Filter by tags:',
  },
  loginTitle: {
    NL: 'Inloggen',
    EN: 'Login',
  },
  emailLabel: {
    NL: 'E-mail',
    EN: 'Email',
  },
  passwordLabel: {
    NL: 'Wachtwoord',
    EN: 'Password',
  },
  loginButton: {
    NL: 'Inloggen',
    EN: 'Login',
  },
  loginFailed: {
    NL: 'Inloggen mislukt. Controleer je gegevens.',
    EN: 'Login failed. Check your credentials.',
  },
  profileEditTitle: {
    NL: 'Profiel Bewerken',
    EN: 'Edit Profile',
  },
  nameLabel: {
    NL: 'Naam',
    EN: 'Name',
  },
  saveButton: {
    NL: 'Opslaan',
    EN: 'Save',
  },
  profileUpdateSuccess: {
    NL: 'Profiel succesvol bijgewerkt!',
    EN: 'Profile updated successfully!',
  },
  profileUpdateFailed: {
    NL: 'Het bijwerken van het profiel is mislukt.',
    EN: 'Failed to update profile.',
  },
  registerTitle: {
    NL: 'Registreren',
    EN: 'Register',
  },
  registerButton: {
    NL: 'Registreren',
    EN: 'Register',
  },
  registerFailed: {
    NL: 'Registratie mislukt. Probeer het opnieuw.',
    EN: 'Registration failed. Please try again.',
  },
  tagPopularityTitle: {
    NL: 'Tag Populariteit',
    EN: 'Tag Popularity',
  },
  forLabel: {
    NL: 'voor',
    EN: 'for',
  },
  loadingData: {
    NL: 'Data aan het laden...',
    EN: 'Loading data...',
  },
  loginToViewStats: {
    NL: 'Log in om uw statistieken te bekijken.',
    EN: 'Login to view your statistics.',
  },
  noFavoriteModules: {
    NL: 'Je hebt nog geen favoriete modules.',
    EN: 'You have no favorite modules yet.',
  },
  goToModulesPage: {
    NL: 'Ga naar de modulepagina om modules aan je favorietenlijst toe te voegen.',
    EN: 'Go to the modules page to add modules to your favorites list.',
  },
  searchPlaceholder: {
    NL: 'Zoek op titel of beschrijving...',
    EN: 'Search by title or description...',
  },
  modulesFound: {
    NL: 'keuzemodules gevonden.',
    EN: 'modules found.',
  },
  moduleFound: {
    NL: 'keuzemodule gevonden.',
    EN: 'module found.',
  },
  legend: {
    NL: 'Legenda',
    EN: 'Legend',
  },
  moreInfoButton: {
    NL: 'Meer info',
    EN: 'More info',
  },
  registerOsirisButton: {
    NL: 'Aanmelden via Osiris',
    EN: 'Register via Osiris',
  },
  myFavoritesTitle: {
    NL: 'Mijn Favorieten',
    EN: 'My Favorites',
  },
  noFavoritesText: {
    NL: 'Je hebt nog geen modules aan je favorieten toegevoegd.',
    EN: 'You have not added any modules to your favorites yet.',
  },
};

export function useLocale() {
  const userStore = useUserStore();
  const currentLanguage = computed(() => userStore.currentLanguage);

  const t = (key: string): string => {
    const translation = translations[key];
    if (translation) {
      return translation[currentLanguage.value] || key; 
    }
    return key; 
  };

  return { t, currentLanguage };
}
