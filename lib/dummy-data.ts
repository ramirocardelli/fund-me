import { Project, Donation, UserProfile } from './types';

/**
 * Genera datos dummy para campañas (proyectos)
 */
export function generateDummyProjects(): Project[] {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  return [
    {
      id: 'campaign_1',
      title: 'Construcción de Escuela Rural',
      description: 'Ayudemos a construir una escuela en una comunidad rural que necesita acceso a educación. El proyecto incluye aulas, biblioteca y área de recreación para más de 100 niños.',
      goalAmount: 500000,
      currentAmount: 375000,
      creatorAddress: '0x1234567890123456789012345678901234567890',
      creatorName: 'María González',
      createdAt: oneMonthAgo,
      imageUrl: 'https://images.unsplash.com/photo-1503676260721-4d00c4ef78ba?w=800',
    },
    {
      id: 'campaign_2',
      title: 'Reforestación del Bosque Nativo',
      description: 'Proyecto para plantar 10,000 árboles nativos en áreas deforestadas. Cada árbol ayudará a restaurar el ecosistema y combatir el cambio climático.',
      goalAmount: 300000,
      currentAmount: 285000,
      creatorAddress: '0x2345678901234567890123456789012345678901',
      creatorName: 'Carlos Rodríguez',
      createdAt: twoWeeksAgo,
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    },
    {
      id: 'campaign_3',
      title: 'Centro de Salud Comunitario',
      description: 'Construcción de un centro de salud que brindará atención médica gratuita a más de 500 familias de bajos recursos en la zona.',
      goalAmount: 800000,
      currentAmount: 120000,
      creatorAddress: '0x3456789012345678901234567890123456789012',
      creatorName: 'Ana Martínez',
      createdAt: oneWeekAgo,
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800',
    },
    {
      id: 'campaign_4',
      title: 'Programa de Alimentación Infantil',
      description: 'Proveer comidas nutritivas diarias a 200 niños en situación de vulnerabilidad durante todo el año escolar.',
      goalAmount: 250000,
      currentAmount: 250000,
      creatorAddress: '0x4567890123456789012345678901234567890123',
      creatorName: 'Luis Fernández',
      createdAt: oneMonthAgo,
      imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800',
    },
    {
      id: 'campaign_5',
      title: 'Taller de Capacitación Laboral',
      description: 'Crear un espacio donde jóvenes puedan aprender oficios como carpintería, electricidad y plomería para mejorar sus oportunidades laborales.',
      goalAmount: 400000,
      currentAmount: 85000,
      creatorAddress: '0x5678901234567890123456789012345678901234',
      creatorName: 'Sofía López',
      createdAt: oneWeekAgo,
      imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800',
    },
    {
      id: 'campaign_6',
      title: 'Biblioteca Móvil para Barrios',
      description: 'Un bibliobús que recorrerá diferentes barrios llevando libros, talleres de lectura y actividades culturales a comunidades que no tienen acceso a bibliotecas.',
      goalAmount: 350000,
      currentAmount: 210000,
      creatorAddress: '0x6789012345678901234567890123456789012345',
      creatorName: 'Roberto Sánchez',
      createdAt: twoWeeksAgo,
      imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
    },
    {
      id: 'campaign_7',
      title: 'Huerta Comunitaria Orgánica',
      description: 'Establecer una huerta comunitaria donde familias puedan cultivar sus propios alimentos orgánicos y aprender técnicas de agricultura sostenible.',
      goalAmount: 180000,
      currentAmount: 45000,
      creatorAddress: '0x7890123456789012345678901234567890123456',
      creatorName: 'Patricia Díaz',
      createdAt: oneWeekAgo,
      imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
    },
    {
      id: 'campaign_8',
      title: 'Rescate de Animales Callejeros',
      description: 'Centro de rescate y rehabilitación para animales abandonados. Incluye atención veterinaria, esterilización y programa de adopción responsable.',
      goalAmount: 450000,
      currentAmount: 320000,
      creatorAddress: '0x8901234567890123456789012345678901234567',
      creatorName: 'Diego Morales',
      createdAt: twoWeeksAgo,
      imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
    },
  ];
}

/**
 * Genera datos dummy para donaciones
 */
export function generateDummyDonations(projectIds: string[]): Donation[] {
  const now = new Date();
  const donations: Donation[] = [];
  
  // Generar donaciones para diferentes campañas
  const amounts = [5000, 10000, 15000, 20000, 25000, 30000, 50000, 75000, 100000];
  const donorAddresses = [
    '0x1234567890123456789012345678901234567890', // Wallet del perfil dummy (primera)
    '0x1111111111111111111111111111111111111111',
    '0x2222222222222222222222222222222222222222',
    '0x3333333333333333333333333333333333333333',
    '0x4444444444444444444444444444444444444444',
    '0x5555555555555555555555555555555555555555',
  ];

  // Crear 15 donaciones distribuidas en diferentes fechas
  for (let i = 0; i < 15; i++) {
    const daysAgo = Math.floor(Math.random() * 30); // Últimos 30 días
    const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const projectId = projectIds[Math.floor(Math.random() * projectIds.length)];
    const amount = amounts[Math.floor(Math.random() * amounts.length)];
    // Hacer que aproximadamente 1/3 de las donaciones sean del usuario del perfil
    const donorAddress = i < 5 
      ? '0x1234567890123456789012345678901234567890' 
      : donorAddresses[Math.floor(Math.random() * donorAddresses.length)];

    donations.push({
      id: `donation_${i + 1}`,
      projectId,
      amount,
      donorAddress,
      timestamp,
    });
  }

  // Ordenar por fecha más reciente primero
  return donations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Inicializa datos dummy si no existen datos en el storage
 */
export function initializeDummyData(): void {
  if (typeof window === 'undefined') return;

  const projectsKey = 'lemoncash_projects';
  const donationsKey = 'lemoncash_donations';
  const profileKey = 'lemoncash_user_profile';
  const initializedKey = 'lemoncash_dummy_initialized';

  // Siempre verificar y crear el perfil si no existe
  const existingProfile = localStorage.getItem(profileKey);
  if (!existingProfile) {
    const dummyProfile = generateDummyProfile();
    localStorage.setItem(profileKey, JSON.stringify(dummyProfile));
  }

  // Verificar si ya se inicializaron los datos dummy
  const alreadyInitialized = localStorage.getItem(initializedKey);
  if (alreadyInitialized === 'true') {
    return;
  }

  // Verificar si ya hay proyectos reales
  const existingProjects = localStorage.getItem(projectsKey);
  if (existingProjects && JSON.parse(existingProjects).length > 0) {
    // Si hay proyectos pero no hay donaciones, crear donaciones dummy
    const existingDonations = localStorage.getItem(donationsKey);
    if (!existingDonations || JSON.parse(existingDonations).length === 0) {
      const projects = JSON.parse(existingProjects);
      const projectIds = projects.map((p: any) => p.id);
      const dummyDonations = generateDummyDonations(projectIds);
      localStorage.setItem(donationsKey, JSON.stringify(dummyDonations));
    }
    // Marcar como inicializado
    localStorage.setItem(initializedKey, 'true');
    return;
  }

  // Generar y guardar proyectos dummy
  const dummyProjects = generateDummyProjects();
  localStorage.setItem(projectsKey, JSON.stringify(dummyProjects));

  // Generar y guardar donaciones dummy
  const projectIds = dummyProjects.map(p => p.id);
  const dummyDonations = generateDummyDonations(projectIds);
  localStorage.setItem(donationsKey, JSON.stringify(dummyDonations));

  // Marcar como inicializado
  localStorage.setItem(initializedKey, 'true');
}

/**
 * Genera datos dummy para el perfil del usuario
 */
export function generateDummyProfile(): UserProfile {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

  return {
    id: 'user_1',
    username: 'Juan Pérez',
    walletAddress: '0x1234567890123456789012345678901234567890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan',
    bio: 'Apasionado por el impacto social y la tecnología. Creo campañas para ayudar a comunidades necesitadas.',
    createdAt: sixMonthsAgo,
    stats: {
      campaignsCreated: 3,
      totalDonated: 125000,
      donationsCount: 8,
    },
  };
}

