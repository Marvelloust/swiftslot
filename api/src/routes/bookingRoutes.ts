const express = require('express');
import { createBooking, getBooking, getAllBookings } from '../controllers/bookingController';
const { idempotencyMiddleware } = require('../middlewares/idempotencyMiddleware');

const router = express.Router();


router.post('/', idempotencyMiddleware('create-booking'), createBooking);
router.get('/', getAllBookings);
router.get('/:id', getBooking);

export default router;
