import { Request, Response } from 'express';
import { Payment } from '../models/payment';
import { Booking } from '../models/booking';
import { v4 as uuidv4 } from 'uuid';

export async function initializePayment(req: Request, res: Response) {
  const { booking_id } = req.body;
  console.log('initializePayment: booking_id received:', booking_id);

  if (!booking_id) {
    return res.status(400).json({ error: 'Missing booking_id' });
  }

  const booking = await Booking.findByPk(booking_id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const ref = uuidv4(); // Generate fake payment reference

  const payment = await Payment.create({
    booking_id,
    ref,
    status: 'pending',
  });
  console.log('initializePayment: payment created:', payment.toJSON());

  return res.status(200).json({
    ref: payment.ref,
    status: payment.status,
  });
}

export async function handleWebhook(req: Request, res: Response) {
  const { ref, event } = req.body;
  console.log('handleWebhook: webhook received:', req.body);

  if (!ref) {
    return res.status(400).json({ error: 'Missing payment reference' });
  }

  const payment = await Payment.findOne({ where: { ref } });
  console.log('handleWebhook: payment found:', payment ? payment.toJSON() : null);

  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }

  if (payment.status === 'paid') {
    return res.status(200).json({ message: 'Already paid' });
  }

  // Mark as paid
  await payment.update({
    status: 'paid',
    raw_event_json: event,
  });

  // Update related booking
  await Booking.update({ status: 'paid' }, { where: { id: payment.booking_id } });

  return res.status(200).json({ message: 'Payment successful' });
}
