/**
 * Database Synchronization Script
 * Run with: npx ts-node scripts/sync-db.ts
 */

import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

import { initDatabase } from '../lib/infrastructure/database/init';

async function main() {
  try {
    // Get force flag from command line arguments
    const forceSync = process.argv.includes('--force');
    
    if (forceSync) {
      console.log('⚠️  WARNING: Force sync will drop all tables and recreate them!');
      console.log('⚠️  All data will be lost!');
    }

    await initDatabase({ force: forceSync });
    
    console.log('✅ Database sync completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error syncing database:', error);
    process.exit(1);
  }
}

main();


