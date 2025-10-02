export async function getVendorById(req: Request, res: Response) {
  const { id } = req.params;
  const vendor = await Vendor.findByPk(id);
  if (!vendor) {
    return res.status(404).json({ error: 'Vendor not found' });
  }
  res.json(vendor);
}
import { Request, Response } from 'express';
import { Vendor } from '../models/vendor';
import { BookingSlot } from '../models/bookingSlot';
import { generateDailySlots } from '../utils/timeUtils';
import { formatISO } from 'date-fns';

export async function getVendors(req: Request, res: Response) {
  try {
    const vendors = await Vendor.findAll();
    res.json(vendors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getAvailability(req: Request, res: Response) {
  const vendorId = Number(req.params.id);
  const { date } = req.query;

  if (!date || typeof date !== 'string') {
    return res.status(400).json({ error: 'Missing date parameter' });
  }

  try {
    const allSlots = generateDailySlots(date); // in UTC

    const bookedSlots = await BookingSlot.findAll({
      where: {
        vendor_id: vendorId,
        slot_start_utc: allSlots,
      },
    });

    const bookedSet = new Set(
      bookedSlots
        .map((slot) => slot.slot_start_utc)
        .filter((d) => d instanceof Date && !isNaN(d.getTime()))
        .map((d) => d.toISOString())
    );

    const available = allSlots
      .filter((slot) => !bookedSet.has(slot.toISOString()))
      .map((slot) => formatISO(slot));

    return res.json({ available_slots: available });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}