import { Project, Donation, UserProfile } from './types';

const PROJECTS_STORAGE_KEY = 'lemoncash_projects';
const DONATIONS_STORAGE_KEY = 'lemoncash_donations';

// Funciones para Proyectos/Campañas
export function getProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const projects = JSON.parse(stored);
    return projects.map((p: any) => ({
      ...p,
      createdAt: new Date(p.createdAt),
    }));
  } catch {
    return [];
  }
}

export function saveProject(project: Project): void {
  const projects = getProjects();
  projects.push(project);
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
}

export function updateProject(projectId: string, updates: Partial<Project>): void {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === projectId);
  
  if (index !== -1) {
    projects[index] = { ...projects[index], ...updates };
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }
}

export function getProjectById(id: string): Project | undefined {
  return getProjects().find(p => p.id === id);
}

// Funciones para Donaciones/Aportes
export function getDonations(): Donation[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(DONATIONS_STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const donations = JSON.parse(stored);
    return donations.map((d: any) => ({
      ...d,
      timestamp: new Date(d.timestamp),
    }));
  } catch {
    return [];
  }
}

export function saveDonation(donation: Donation): void {
  const donations = getDonations();
  donations.push(donation);
  localStorage.setItem(DONATIONS_STORAGE_KEY, JSON.stringify(donations));
}

export function getDonationsByProjectId(projectId: string): Donation[] {
  return getDonations().filter(d => d.projectId === projectId);
}

// Funciones para Perfil de Usuario
const PROFILE_STORAGE_KEY = 'lemoncash_user_profile';

export function getUserProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!stored) return null;
  
  try {
    const profile = JSON.parse(stored);
    return {
      ...profile,
      createdAt: new Date(profile.createdAt),
    };
  } catch {
    return null;
  }
}

export function updateUserProfile(updates: Partial<UserProfile>): void {
  const profile = getUserProfile();
  if (profile) {
    const updatedProfile = { ...profile, ...updates };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
  }
}
