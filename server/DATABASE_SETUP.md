# Database Setup Guide

This guide will help you set up PostgreSQL database for your Sweets Website backend.

## Prerequisites

1. **PostgreSQL installed and running**
   - Download from: https://www.postgresql.org/download/
   - Or use a package manager:
     - macOS: `brew install postgresql`
     - Ubuntu: `sudo apt install postgresql postgresql-contrib`
     - Windows: Use the installer from postgresql.org

2. **Node.js dependencies installed**
   ```bash
   cd server
   npm install
   ```

## Database Configuration

1. **Update `.env` file** with your PostgreSQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=sweets_db
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   JWT_SECRET=your-secret-key-change-in-production
   ```

2. **Start PostgreSQL service** (if not already running):
   - macOS: `brew services start postgresql`
   - Ubuntu: `sudo systemctl start postgresql`
   - Windows: Start from Services panel or pgAdmin

## Setup Database

Run the automated setup script:

```bash
cd server
npm run setup-db
```

This script will:
- Test your database connection
- Create the `sweets_db` database (if it doesn't exist)
- Create all necessary tables and indexes
- Initialize sample products

## Manual Setup (Alternative)

If the automated script fails, you can set up manually:

1. **Create database:**
   ```sql
   CREATE DATABASE sweets_db;
   ```

2. **Run the schema:**
   ```bash
   psql -h localhost -U postgres -d sweets_db -f database-schema.sql
   ```

## Start the Server

```bash
npm start
```

The server will:
- Connect to PostgreSQL
- Initialize the database schema (if needed)
- Create an admin user: `admin@sweetshop.com` / `admin123`
- Start the HTTP and WebSocket servers

## Troubleshooting

### Connection Issues
- Make sure PostgreSQL is running
- Check your `.env` credentials
- Try connecting manually: `psql -h localhost -U postgres -d postgres`

### Permission Issues
- Make sure your PostgreSQL user can create databases
- Try: `ALTER USER postgres CREATEDB;`

### Port Issues
- Default PostgreSQL port is 5432
- Make sure no other service is using it

## Database Schema

The database includes these tables:
- `users` - User accounts and authentication
- `products` - Product catalog with inventory
- `orders` - Customer orders with status tracking
- `carts` - Shopping cart data per user

All data persists between server restarts, unlike the previous in-memory implementation.