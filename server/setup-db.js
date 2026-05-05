#!/usr/bin/env node

import pkg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🐘 Setting up PostgreSQL database for Sweets Website...\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found. Please create it with your database configuration.');
  process.exit(1);
}

// Load environment variables
dotenv.config({ path: envPath });

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

if (!DB_HOST || !DB_PORT || !DB_NAME || !DB_USER || !DB_PASSWORD) {
  console.log('❌ Database configuration missing in .env file.');
  console.log('Please ensure your .env file contains:');
  console.log('DB_HOST=localhost');
  console.log('DB_PORT=5432');
  console.log('DB_NAME=sweets_db');
  console.log('DB_USER=postgres');
  console.log('DB_PASSWORD=your_password');
  process.exit(1);
}

async function setupDatabase() {
  const client = new Client({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: 'postgres' // Connect to default postgres database first
  });

  try {
    console.log('🔍 Testing PostgreSQL connection...');
    await client.connect();
    console.log('✅ PostgreSQL connection successful!');

    // Check if database exists
    const dbCheckQuery = `SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`;
    const dbExists = await client.query(dbCheckQuery);

    if (dbExists.rows.length === 0) {
      console.log(`📦 Creating database '${DB_NAME}'...`);
      await client.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`✅ Database '${DB_NAME}' created successfully`);
    } else {
      console.log(`ℹ️  Database '${DB_NAME}' already exists`);
    }

    // Close connection to postgres database
    await client.end();

    // Connect to the sweets_db database
    const dbClient = new Client({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME
    });

    await dbClient.connect();
    console.log('🏗️  Setting up database schema...');

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'database-schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    // Split schema into individual statements and execute them
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        await dbClient.query(statement);
      }
    }

    await dbClient.end();

    console.log('✅ Database setup completed successfully!');
    console.log('\n🚀 You can now start the server with: npm start');
    console.log('👑 Admin login: admin@sweetshop.com / admin123');

  } catch (error) {
    console.error('❌ Database setup failed:');
    console.error(error.message);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Make sure PostgreSQL is installed and running');
      console.log('2. Check if PostgreSQL service is started');
      console.log('3. Verify your .env file has correct credentials');
      console.log('4. Try starting PostgreSQL:');
      console.log('   - Windows: Start PostgreSQL from Services or pgAdmin');
      console.log('   - Or run: pg_ctl start -D "C:\\Program Files\\PostgreSQL\\XX\\data"');
    } else if (error.code === '28P01') {
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Check your DB_USER and DB_PASSWORD in .env file');
      console.log('2. Make sure the PostgreSQL user exists and has correct password');
    } else {
      console.log('\n🔧 General troubleshooting:');
      console.log('1. Make sure PostgreSQL is installed');
      console.log('2. Check your .env file credentials');
      console.log('3. Ensure PostgreSQL service is running');
      console.log('4. Try connecting manually with psql or pgAdmin');
    }

    process.exit(1);
  }
}

setupDatabase();