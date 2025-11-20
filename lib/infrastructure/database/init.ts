import { testConnection, syncDatabase } from '@/lib/infrastructure/orm/sequelize/config';
// Import all models to ensure they are initialized before sync
import '@/lib/infrastructure/orm/sequelize/models/UserModel';
import '@/lib/infrastructure/orm/sequelize/models/BeneficiaryModel';
import '@/lib/infrastructure/orm/sequelize/models/CampaignModel';
import '@/lib/infrastructure/orm/sequelize/models/ProjectModel';
import '@/lib/infrastructure/orm/sequelize/models/DonationModel';
import '@/lib/infrastructure/orm/sequelize/models/DonationProjectModel';

/**
 * Initialize Database Connection
 * Tests connection and syncs models with database
 */
export async function initDatabase(options?: { force?: boolean; alter?: boolean }) {
  console.log('🔄 Initializing database connection...');

  // Test connection
  const connected = await testConnection();
  if (!connected) {
    throw new Error('Failed to connect to database');
  }

  // Sync database (create tables if they don't exist)
  if (options?.force !== undefined) {
    console.log('⚠️  Syncing database with force option...');
    await syncDatabase(options.force);
  } else {
    console.log('🔄 Syncing database...');
    await syncDatabase(false);
  }

  console.log('✅ Database initialized successfully');
}


