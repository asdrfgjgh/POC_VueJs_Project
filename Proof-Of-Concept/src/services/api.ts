// In src/services/api.ts

const VITE_API_BASE_URL = "/api";

export const getAllModules = async (
  page: number,
  limit: number,
  tags: string[] = [],
  level?: string,
  location?: string,
  studycredit?: number
) => {
  // Gebruik URLSearchParams om de query parameters netjes op te bouwen
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  if (tags && tags.length > 0) {
    params.append('tags', tags.join(','));
  }
  if (level) {
    params.append('level', level);
  }
  if (location) {
    params.append('location', location);
  }
  // Controleer of studycredit een waarde heeft (ook 0)
  if (studycredit != null) {
    params.append('studycredit', studycredit.toString());
  }

  const url = `${VITE_API_BASE_URL}/modules?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch modules');
  }
  return response.json();
};


export async function updateStudentProfile(studentId: string, data: { name: string; email: string; }) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Niet geauthenticeerd.');
  }

  const response = await fetch(`${VITE_API_BASE_URL}/students/${studentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Profiel bijwerken mislukt');
  }
  return response.json();
}

export const getAllStudents = async () => {
  const response = await fetch(`${VITE_API_BASE_URL}/students`);
  if (!response.ok) {
    throw new Error('Failed to fetch students');
  }
  return response.json();
}

export const getStudentById = async (id: string) => {
  const response = await fetch(`${VITE_API_BASE_URL}/students/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch student');
  }
  return response.json();
}

export const updateShortlist = async (studentId: string, moduleId: string, action: 'add' | 'remove') => {
  // Haal de token op uit de lokale opslag
  const token = localStorage.getItem('token');
  if (!token) {
    // Gooi een error als de gebruiker niet is ingelogd
    throw new Error('Niet geauthenticeerd voor het bijwerken van de shortlist.');
  }

  const response = await fetch(`${VITE_API_BASE_URL}/students/${studentId}/shortlist`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // Voeg de token toe aan de Authorization header
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ moduleId, action }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Bijwerken van shortlist mislukt');
  }
  return response.json();
}


export const getStudentTagCounts = async (studentId: string) => {
  const response = await fetch(`${VITE_API_BASE_URL}/students/${studentId}/tag-counts`);
  if (!response.ok) {
    throw new Error('Failed to fetch tag counts');
  }
  return response.json();
}

export const getAllTags = async () => {
  const response = await fetch(`${VITE_API_BASE_URL}/tags`);
  if (!response.ok) {
    throw new Error('Failed to fetch tags');
  }
  return response.json();
};

export const getAllModulesForAnalytics = async () => {
  const response = await fetch(`${VITE_API_BASE_URL}/modules/all-for-analytics`);
  if (!response.ok) {
    throw new Error('Failed to fetch modules for analytics');
  }
  return response.json();
};

export async function registerUser(name: string, email: string, password: string) {
  const response = await fetch(`${VITE_API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registratie mislukt');
  }

  return response.json();
}

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${VITE_API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Inloggen mislukt');
  }

  return response.json();
}

export const getModuleFilterOptions = async () => {
  const url = `${VITE_API_BASE_URL}/modules/filters`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch filter options');
  }
  return response.json();
};