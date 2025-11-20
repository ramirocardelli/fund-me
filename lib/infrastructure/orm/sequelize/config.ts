import { Sequelize } from 'sequelize';
import pg from 'pg';

/**
 * Sequelize Configuration for Neon PostgreSQL
 * Uses environment variables for connection details
 */

let sequelize: Sequelize | null = null;

export const getSequelizeInstance = (): Sequelize => {
  if (sequelize) {
    return sequelize;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is not defined in environment variables. Please check your .env.local file.'
    );
  }

  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    dialectModule: pg,  // Explícitamente proveer pg para Turbopack
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Neon requires SSL
      },
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,      // Neon recomienda menos conexiones
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

  return sequelize;
};

export const testConnection = async (): Promise<boolean> => {
  try {
    const instance = getSequelizeInstance();
    await instance.authenticate();
    console.log('✅ Database connection established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    return false;
  }
};

export const syncDatabase = async (force: boolean = false): Promise<void> => {
  try {
    const instance = getSequelizeInstance();
    await instance.sync({ force, alter: !force });
    console.log('✅ Database synchronized successfully.');
  } catch (error) {
    console.error('❌ Error synchronizing database:', error);
    throw error;
  }
};

