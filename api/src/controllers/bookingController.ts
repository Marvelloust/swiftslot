import { Op } from 'sequelize';
export async function getAllBookings(req: Request, res: Response) {
  try {
    const bookings = await Booking.findAll();
    return res.json(bookings);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
import { Request, Response } from 'express';
import { Booking } from '../models/booking';
import { BookingSlot } from '../models/bookingSlot';
import { sequelize } from '../config/db';
import { toZonedTime } from 'date-fns-tz';
const ZONE = 'Africa/Lagos';

export async function createBooking(req: Request, res: Response) {
  const { vendor_id, start_time_local } = req.body;

  if (!vendor_id || !start_time_local) {
    return res.status(400).json({ error: 'Missing required fields' });
  }


  try {
    // Convert to UTC
    const startUtc = new Date(start_time_local); // Ensure this is in UTC
    const nowUtc = new Date();

    // Optionally, you can keep a minimum window, e.g., 10 minutes
    // const minWindow = new Date(nowUtc.getTime() + 10 * 60 * 1000);
    // if (startUtc < minWindow) {
    //   return res.status(400).json({ error: 'Cannot book within 10 minutes' });
    // }

    const endUtc = new Date(startUtc.getTime() + 30 * 60 * 1000); // 30 mins

    const result = await sequelize.transaction(async (t: any) => {
      const booking = await Booking.create(
        {
          vendor_id,
          buyer_id: 1, // Hardcoded
          start_time_utc: startUtc,
          end_time_utc: endUtc,
          status: 'pending',
        },
        { transaction: t }
      );

      await BookingSlot.create(
        {
          booking_id: booking.id,
          vendor_id,
          slot_start_utc: startUtc,
        },
        { transaction: t }
      );

      return booking;
    });

    return res.status(201).json({
      id: result.id,
      vendor_id: result.vendor_id,
      start_time_utc: result.start_time_utc,
      end_time_utc: result.end_time_utc,
      status: result.status,
    });

  } catch (err: any) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Slot already booked' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getBooking(req: Request, res: Response) {
  const id = req.params.id;
  const booking = await Booking.findByPk(id);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  return res.json(booking);
}

