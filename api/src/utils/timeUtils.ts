import { toZonedTime } from 'date-fns-tz';
import { formatISO, addMinutes } from 'date-fns';

const ZONE = 'Africa/Lagos';

export function generateDailySlots(dateStr: string): Date[] {
  const slots: Date[] = [];

  const start = toZonedTime(`${dateStr}T09:00:00`, ZONE);
  const end = toZonedTime(`${dateStr}T17:00:00`, ZONE);

  let current = new Date(start);
  while (current < end) {
    slots.push(new Date(current));
    current = addMinutes(current, 30);
  }

  return slots;
}
