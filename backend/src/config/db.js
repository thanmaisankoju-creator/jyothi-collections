// backend/src/config/db.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
});

// Test connection on startup
prisma.$connect()
  .then(() => console.log('✅ Database connected'))
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.error('   Check DATABASE_URL in backend/.env');
    process.exit(1);
  });

module.exports = prisma;
