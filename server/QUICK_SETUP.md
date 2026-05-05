# Alternative: Use SQLite (No PostgreSQL Installation Required)

If you don't want to install PostgreSQL, you can use SQLite instead. Here's how:

## Option 1: Use SQLite Instead

1. **Install SQLite dependencies:**
   ```bash
   cd server
   npm install sqlite3 sqlite
   ```

2. **Update your .env file:**
   ```env
   # Comment out PostgreSQL settings
   # DB_HOST=localhost
   # DB_PORT=5432
   # DB_NAME=sweets_db
   # DB_USER=postgres
   # DB_PASSWORD=password

   # Use SQLite instead
   DATABASE_URL=sqlite:./sweets.db
   JWT_SECRET=your-secret-key-change-in-production
   ```

3. **Use the existing in-memory store** (temporary solution):
   Your current server.js already works with in-memory storage. Just run:
   ```bash
   npm start
   ```

## Option 2: PostgreSQL Installation for Windows

### Step-by-Step PostgreSQL Installation:

1. **Download PostgreSQL:**
   - Go to: https://www.postgresql.org/download/windows/
   - Download the installer for Windows

2. **Run the installer:**
   - Choose your installation directory (default is fine)
   - Set password for postgres user (remember this!)
   - Keep default port (5432)
   - Install pgAdmin if you want a GUI

3. **Update your .env file:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=sweets_db
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password_here
   JWT_SECRET=your-secret-key-change-in-production
   ```

4. **Start PostgreSQL service:**
   - Open Services (search for "services" in Windows search)
   - Find "postgresql-x64-XX" service
   - Right-click and select "Start"

5. **Test connection:**
   ```bash
   cd server
   npm run setup-db
   ```

6. **Start your server:**
   ```bash
   npm start
   ```

## Option 3: Use a Cloud Database (Recommended for Production)

For easier setup, you can use a cloud PostgreSQL service:

### Neon.tech (Free tier available):
1. Go to https://neon.tech
2. Sign up for free account
3. Create a new project
4. Copy the connection string
5. Update your .env:
   ```
   DATABASE_URL=postgresql://username:password@hostname/dbname
   ```

### Supabase (Free tier):
1. Go to https://supabase.com
2. Create free account
3. Create new project
4. Get connection details from Settings > Database
5. Update your .env with the connection string

## Quick Test

If you just want to test the application quickly, you can run it with in-memory storage:

```bash
cd server
npm start
```

This will work immediately but data won't persist between restarts.