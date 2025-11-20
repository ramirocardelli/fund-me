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
 * Las donaciones se generan de forma consistente: la suma de donaciones por proyecto
 * debe ser igual al currentAmount de ese proyecto
 */
export function generateDummyDonations(projects: Project[]): Donation[] {
  const now = new Date();
  const donations: Donation[] = [];
  let donationId = 1;
  
  const donorAddresses = [
    '0x1234567890123456789012345678901234567890', // Wallet del perfil dummy (primera)
    '0x1111111111111111111111111111111111111111',
    '0x2222222222222222222222222222222222222222',
    '0x3333333333333333333333333333333333333333',
    '0x4444444444444444444444444444444444444444',
    '0x5555555555555555555555555555555555555555',
  ];

  // Generar donaciones para cada proyecto
  projects.forEach((project, projectIndex) => {
    if (project.currentAmount === 0) return;
    
    // Calcular cuántas donaciones hacer para este proyecto (entre 2 y 6)
    const numDonations = Math.min(
      Math.floor(Math.random() * 5) + 2,
      Math.max(2, Math.floor(project.currentAmount / 10000))
    );
    
    let remainingAmount = project.currentAmount;
    const projectCreationDate = new Date(project.createdAt);
    const daysSinceCreation = Math.floor((now.getTime() - projectCreationDate.getTime()) / (24 * 60 * 60 * 1000));
    
    for (let i = 0; i < numDonations; i++) {
      // Para la última donación, usar el monto restante exacto
      let amount: number;
      if (i === numDonations - 1) {
        amount = remainingAmount;
      } else {
        // Calcular un monto aleatorio que no exceda el monto restante
        // y que sea al menos 5% del monto restante
        const minAmount = Math.max(5000, Math.floor(remainingAmount * 0.05));
        const maxAmount = Math.floor(remainingAmount * 0.5); // Máximo 50% del restante
        amount = Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount;
        // Redondear a miles
        amount = Math.round(amount / 1000) * 1000;
      }
      
      remainingAmount -= amount;
      
      // Generar una fecha entre la creación del proyecto y ahora
      const daysAfterCreation = Math.floor(Math.random() * Math.max(1, daysSinceCreation));
      const timestamp = new Date(projectCreationDate.getTime() + daysAfterCreation * 24 * 60 * 60 * 1000);
      
      // Hacer que aproximadamente 30% de las donaciones sean del usuario del perfil
      const useProfileWallet = Math.random() < 0.3;
      const donorAddress = useProfileWallet
        ? '0x1234567890123456789012345678901234567890'
        : donorAddresses[Math.floor(Math.random() * (donorAddresses.length - 1)) + 1];

      donations.push({
        id: `donation_${donationId++}`,
        projectId: project.id,
        amount,
        donorAddress,
        timestamp,
      });
    }
  });

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
      const dummyDonations = generateDummyDonations(projects);
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
  const dummyDonations = generateDummyDonations(dummyProjects);
  localStorage.setItem(donationsKey, JSON.stringify(dummyDonations));

  // Marcar como inicializado
  localStorage.setItem(initializedKey, 'true');
  
  // Verificar consistencia de datos (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    const verification = verifyDataConsistency();
    if (verification.valid) {
      console.log('✅ Datos dummy inicializados correctamente - Todas las verificaciones pasaron');
    } else {
      console.warn('⚠️ Inconsistencias en datos dummy:', verification.errors);
    }
  }
}

/**
 * Genera datos dummy para el perfil del usuario
 * Los stats se calculan basándose en las donaciones reales del usuario
 */
export function generateDummyProfile(): UserProfile {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

  // Calcular stats reales si hay donaciones
  let totalDonated = 0;
  let donationsCount = 0;
  
  if (typeof window !== 'undefined') {
    const donationsKey = 'lemoncash_donations';
    const existingDonations = localStorage.getItem(donationsKey);
    if (existingDonations) {
      const donations = JSON.parse(existingDonations);
      const userWallet = '0x1234567890123456789012345678901234567890';
      const userDonations = donations.filter(
        (d: Donation) => d.donorAddress.toLowerCase() === userWallet.toLowerCase()
      );
      totalDonated = userDonations.reduce((sum: number, d: Donation) => sum + d.amount, 0);
      donationsCount = userDonations.length;
    }
  }

  return {
    id: 'user_1',
    username: 'Juan Pérez',
    walletAddress: '0x1234567890123456789012345678901234567890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan',
    bio: 'Apasionado por el impacto social y la tecnología. Creo campañas para ayudar a comunidades necesitadas.',
    createdAt: sixMonthsAgo,
    stats: {
      campaignsCreated: 3,
      totalDonated,
      donationsCount,
    },
  };
}

/**
 * Verifica que los datos sean consistentes:
 * - La suma de donaciones por proyecto debe ser igual a su currentAmount
 * - Las fechas de donaciones deben estar entre la creación del proyecto y ahora
 */
export function verifyDataConsistency(): { valid: boolean; errors: string[] } {
  if (typeof window === 'undefined') {
    return { valid: true, errors: [] };
  }

  const errors: string[] = [];
  const projectsKey = 'lemoncash_projects';
  const donationsKey = 'lemoncash_donations';

  const projectsData = localStorage.getItem(projectsKey);
  const donationsData = localStorage.getItem(donationsKey);

  if (!projectsData || !donationsData) {
    return { valid: true, errors: [] };
  }

  const projects: Project[] = JSON.parse(projectsData);
  const donations: Donation[] = JSON.parse(donationsData);

  // Verificar que la suma de donaciones coincida con el currentAmount
  projects.forEach(project => {
    const projectDonations = donations.filter(d => d.projectId === project.id);
    const totalDonated = projectDonations.reduce((sum, d) => sum + d.amount, 0);

    if (Math.abs(totalDonated - project.currentAmount) > 0.01) {
      errors.push(
        `Proyecto ${project.id}: currentAmount (${project.currentAmount}) no coincide con suma de donaciones (${totalDonated})`
      );
    }

    // Verificar fechas
    const projectCreation = new Date(project.createdAt).getTime();
    const now = Date.now();
    
    projectDonations.forEach(donation => {
      const donationTime = new Date(donation.timestamp).getTime();
      if (donationTime < projectCreation) {
        errors.push(
          `Donación ${donation.id}: fecha (${donation.timestamp}) es anterior a la creación del proyecto ${project.id}`
        );
      }
      if (donationTime > now) {
        errors.push(
          `Donación ${donation.id}: fecha (${donation.timestamp}) es futura`
        );
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

