// src/db/seed.ts
const { sequelize } = require('../config/db');
const { Vendor } = require('../models/vendor');

async function seed() {
  await sequelize.sync({ force: true });

  await Vendor.bulkCreate([
    { name: 'Vendor A', timezone: 'Africa/Lagos' },
    { name: 'Vendor B', timezone: 'Africa/Lagos' },
    { name: 'Vendor C', timezone: 'Africa/Lagos' },
  ]);

  console.log('✅ Seeded vendors');
  process.exit();
}

seed();
