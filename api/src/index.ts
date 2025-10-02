// src/index.ts

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { sequelize } from './config/db';
import vendorRoutes from './routes/vendorRoutes';
import bookingRoutes from './routes/bookingRoutes';import paymentRoutes from './routes/paymentRoutes';
import './models/vendor';
import './models/booking';
import './models/bookingSlot';
import './models/payment';
import './models/idempotencyKey';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.use(cors());

// Routes

app.use('/api/vendors', vendorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// Start
async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');
    await sequelize.sync({ alter: true }); // For dev

    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('❌ DB connection error:', err);
  }
}

start();
